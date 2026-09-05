// Worker self-service controller.
//
// SECURITY NOTE: every function here resolves "which worker" from
// `req.user.id` (set by the `authenticate` middleware from the verified
// JWT) — never from a worker/profile ID in the URL or request body.
// This is what stops Worker A from editing or deleting Worker B's data
// by guessing or supplying an ID; there is no endpoint here that lets
// the caller specify whose profile to act on.

import prisma from "../utils/prisma.js";
import {
  pickWorkerProfileUpdate,
  validateWorkerProfileUpdate,
  validateSkillInput,
  validateCertificationInput,
} from "../utils/validators.js";

async function getOwnWorkerProfile(userId) {
  return prisma.workerProfile.findUnique({ where: { userId } });
}

// Never spreads the raw `user` relation into the response — only the
// two safe fields are pulled out, so passwordHash can never leak here
// even if a future edit adds more fields to the User model.
function toSafeWorkerProfile(workerProfile, user) {
  return {
    id: workerProfile.id,
    bio: workerProfile.bio,
    experienceYears: workerProfile.experienceYears,
    verificationStatus: workerProfile.verificationStatus,
    isAvailable: workerProfile.isAvailable,
    area: workerProfile.area,
    approxLatitude: workerProfile.approxLatitude,
    approxLongitude: workerProfile.approxLongitude,
    welfareStatus: workerProfile.welfareStatus,
    name: user?.name ?? null,
    email: user?.email ?? null,
  };
}

export async function getMyProfile(req, res) {
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId: req.user.id },
    include: {
      user: { select: { name: true, email: true } },
      skills: true,
      certifications: true,
    },
  });

  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  return res.status(200).json({
    profile: toSafeWorkerProfile(workerProfile, workerProfile.user),
    skills: workerProfile.skills,
    certifications: workerProfile.certifications,
  });
}

export async function updateMyProfile(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  // Whitelist FIRST. Even if the request body contains
  // "verificationStatus": "APPROVED", pickWorkerProfileUpdate silently
  // drops it — it is never passed to Prisma.
  const data = pickWorkerProfileUpdate(req.body);
  const errors = validateWorkerProfileUpdate(data);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const updated = await prisma.workerProfile.update({
    where: { id: workerProfile.id },
    data,
    include: { user: { select: { name: true, email: true } } },
  });

  return res.status(200).json({ profile: toSafeWorkerProfile(updated, updated.user) });
}

export async function listMySkills(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const skills = await prisma.workerSkill.findMany({
    where: { workerProfileId: workerProfile.id },
  });
  return res.status(200).json({ skills });
}

export async function addMySkill(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const { skillName, experienceYears } = req.body;
  const errors = validateSkillInput({ skillName, experienceYears });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  // Enforce the approved Service <-> WorkerSkill convention: the skill
  // must match an existing service (case-insensitive), and is stored
  // using the service's exact canonical name — not whatever casing the
  // client happened to send.
  const services = await prisma.service.findMany();
  const matchedService = services.find(
    (s) => s.name.toLowerCase() === skillName.trim().toLowerCase()
  );
  if (!matchedService) {
    return res.status(400).json({
      error: "Skill must match an existing service in the catalog. Please choose one from the list.",
    });
  }

  const alreadyHasSkill = await prisma.workerSkill.findFirst({
    where: { workerProfileId: workerProfile.id, skillName: matchedService.name },
  });
  if (alreadyHasSkill) {
    return res.status(409).json({ error: "You already have this skill listed." });
  }

  const skill = await prisma.workerSkill.create({
    data: {
      workerProfileId: workerProfile.id,
      skillName: matchedService.name,
      experienceYears: experienceYears ?? null,
    },
  });

  return res.status(201).json({ skill });
}

export async function removeMySkill(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const { skillId } = req.params;
  const skill = await prisma.workerSkill.findUnique({ where: { id: skillId } });

  // Same 404 whether the skill doesn't exist at all, or exists but
  // belongs to a different worker — never reveal which case it is.
  if (!skill || skill.workerProfileId !== workerProfile.id) {
    return res.status(404).json({ error: "Skill not found." });
  }

  await prisma.workerSkill.delete({ where: { id: skillId } });
  return res.status(200).json({ success: true });
}

export async function listMyCertifications(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const certifications = await prisma.certification.findMany({
    where: { workerProfileId: workerProfile.id },
  });
  return res.status(200).json({ certifications });
}

export async function addMyCertification(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const { name, issuingOrganization } = req.body;
  const errors = validateCertificationInput({ name, issuingOrganization });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const certification = await prisma.certification.create({
    data: {
      workerProfileId: workerProfile.id,
      name: name.trim(),
      issuingOrganization: issuingOrganization.trim(),
    },
  });

  return res.status(201).json({ certification });
}

export async function removeMyCertification(req, res) {
  const workerProfile = await getOwnWorkerProfile(req.user.id);
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker profile not found." });
  }

  const { certificationId } = req.params;
  const certification = await prisma.certification.findUnique({ where: { id: certificationId } });

  if (!certification || certification.workerProfileId !== workerProfile.id) {
    return res.status(404).json({ error: "Certification not found." });
  }

  await prisma.certification.delete({ where: { id: certificationId } });
  return res.status(200).json({ success: true });
}
