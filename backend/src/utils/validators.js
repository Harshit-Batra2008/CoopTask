// Small, dependency-free validation helpers. Deliberately simple —
// no validation library, since the rules needed here are basic.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Only these two roles may be chosen at public registration.
// ADMIN is intentionally excluded — see auth.controller.js.
export const PUBLIC_REGISTERABLE_ROLES = ["CUSTOMER", "WORKER"];

export function isValidEmail(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH;
}

// Validates the shape of a registration request body.
// Returns an array of error messages (empty array = valid).
export function validateRegistrationInput({ name, email, password, role }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required.");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || !isValidPassword(password)) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (!role || !PUBLIC_REGISTERABLE_ROLES.includes(role)) {
    errors.push('Role must be either "CUSTOMER" or "WORKER".');
  }

  return errors;
}

export function validateLoginInput({ email, password }) {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push("Password is required.");
  }

  return errors;
}

// ---------- Checkpoint 4: services, worker profile, skills, certifications ----------

export function validateServiceInput({ name, category, description }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Service name is required.");
  }
  if (category !== undefined && category !== null && typeof category !== "string") {
    errors.push("Category must be text.");
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    errors.push("Description must be text.");
  }

  return errors;
}

// Fields a WORKER is allowed to edit on their own profile. Deliberately
// excludes verificationStatus/welfareStatus/insuranceProvider — those
// are admin-controlled, and this whitelist is what stops a worker from
// setting verificationStatus: "APPROVED" on themselves by simply
// including it in the request body.
const WORKER_PROFILE_EDITABLE_FIELDS = [
  "bio",
  "experienceYears",
  "isAvailable",
  "area",
  "approxLatitude",
  "approxLongitude",
];

export function pickWorkerProfileUpdate(body) {
  const data = {};
  for (const field of WORKER_PROFILE_EDITABLE_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

export function validateWorkerProfileUpdate(data) {
  const errors = [];

  if (data.bio !== undefined && data.bio !== null && typeof data.bio !== "string") {
    errors.push("Bio must be text.");
  }
  if (data.experienceYears !== undefined && data.experienceYears !== null) {
    if (!Number.isInteger(data.experienceYears) || data.experienceYears < 0 || data.experienceYears > 60) {
      errors.push("Experience years must be a whole number between 0 and 60.");
    }
  }
  if (data.isAvailable !== undefined && typeof data.isAvailable !== "boolean") {
    errors.push("Availability must be true or false.");
  }
  if (data.area !== undefined && data.area !== null && typeof data.area !== "string") {
    errors.push("Area must be text.");
  }
  if (data.approxLatitude !== undefined && data.approxLatitude !== null) {
    if (typeof data.approxLatitude !== "number" || data.approxLatitude < -90 || data.approxLatitude > 90) {
      errors.push("Latitude must be a number between -90 and 90.");
    }
  }
  if (data.approxLongitude !== undefined && data.approxLongitude !== null) {
    if (typeof data.approxLongitude !== "number" || data.approxLongitude < -180 || data.approxLongitude > 180) {
      errors.push("Longitude must be a number between -180 and 180.");
    }
  }

  return errors;
}

export function validateSkillInput({ skillName, experienceYears }) {
  const errors = [];

  if (!skillName || typeof skillName !== "string" || skillName.trim().length === 0) {
    errors.push("Skill name is required.");
  }
  if (experienceYears !== undefined && experienceYears !== null) {
    if (!Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 60) {
      errors.push("Experience years must be a whole number between 0 and 60.");
    }
  }

  return errors;
}

export function validateCertificationInput({ name, issuingOrganization }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Certification name is required.");
  }
  if (
    !issuingOrganization ||
    typeof issuingOrganization !== "string" ||
    issuingOrganization.trim().length === 0
  ) {
    errors.push("Issuing organization is required.");
  }

  return errors;
}

export function isValidVerificationDecision(decision) {
  return decision === "APPROVED" || decision === "REJECTED";
}
