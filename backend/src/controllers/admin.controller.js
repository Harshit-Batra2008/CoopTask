// Admin controller — worker verification.
//
// Every route this controller serves requires `authorize("ADMIN")` in
// the route file. Nothing in here re-checks the role — that would be
// redundant with the middleware, not an extra safeguard, since both
// read from the same verified `req.user.role`.

import prisma from "../utils/prisma.js";
import { isValidVerificationDecision } from "../utils/validators.js";

const VALID_STATUS_FILTERS = ["PENDING", "APPROVED", "REJECTED"];

const WORKER_INCLUDE = {
  user: { select: { name: true, email: true, createdAt: true } },
  skills: true,
  certifications: true,
};

function toAdminWorkerView(workerProfile) {
  return {
    id: workerProfile.id,
    name: workerProfile.user?.name ?? null,
    email: workerProfile.user?.email ?? null,
    memberSince: workerProfile.user?.createdAt ?? null,
    bio: workerProfile.bio,
    experienceYears: workerProfile.experienceYears,
    verificationStatus: workerProfile.verificationStatus,
    isAvailable: workerProfile.isAvailable,
    area: workerProfile.area,
    approxLatitude: workerProfile.approxLatitude,
    approxLongitude: workerProfile.approxLongitude,
    welfareStatus: workerProfile.welfareStatus,
    skills: workerProfile.skills,
    certifications: workerProfile.certifications,
  };
}

export async function listWorkersForAdmin(req, res) {
  const { status } = req.query;

  if (status && !VALID_STATUS_FILTERS.includes(status)) {
    return res.status(400).json({ error: "Invalid status filter." });
  }

  const workers = await prisma.workerProfile.findMany({
    where: status ? { verificationStatus: status } : {},
    include: WORKER_INCLUDE,
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({ workers: workers.map(toAdminWorkerView) });
}

export async function getWorkerForAdmin(req, res) {
  const { id } = req.params;

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { id },
    include: WORKER_INCLUDE,
  });

  if (!workerProfile) {
    return res.status(404).json({ error: "Worker not found." });
  }

  return res.status(200).json({ worker: toAdminWorkerView(workerProfile) });
}

export async function verifyWorker(req, res) {
  const { id } = req.params;
  const { decision } = req.body;

  if (!isValidVerificationDecision(decision)) {
    return res.status(400).json({ error: 'Decision must be "APPROVED" or "REJECTED".' });
  }

  const workerProfile = await prisma.workerProfile.findUnique({ where: { id } });
  if (!workerProfile) {
    return res.status(404).json({ error: "Worker not found." });
  }

  const updated = await prisma.workerProfile.update({
    where: { id },
    data: { verificationStatus: decision },
    include: WORKER_INCLUDE,
  });

  return res.status(200).json({ worker: toAdminWorkerView(updated) });
}

// Minimal dashboard stats — currently just the two worker-verification
// counts the admin dashboard needs. Deliberately NOT a general-purpose
// "analytics" endpoint; add more counts here only as concrete screens
// need them, not speculatively.
export async function getAdminStats(req, res) {
  const [verifiedWorkersCount, pendingWorkersCount] = await Promise.all([
    prisma.workerProfile.count({ where: { verificationStatus: "APPROVED" } }),
    prisma.workerProfile.count({ where: { verificationStatus: "PENDING" } }),
  ]);

  return res.status(200).json({ verifiedWorkersCount, pendingWorkersCount });
}
