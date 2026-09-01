// Auth controller.
//
// Handles registration, login, session check ("me"), and logout.
// Deliberately simple and linear — no service-layer abstraction, since
// there isn't enough logic yet to justify one. Easy to read top to
// bottom and explain to judges.

import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { signToken } from "../utils/jwt.js";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "../utils/cookies.js";
import { validateRegistrationInput, validateLoginInput } from "../utils/validators.js";

const SALT_ROUNDS = 10;

// Fields safe to send to the frontend. passwordHash is NEVER included.
function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
  };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  const errors = validateRegistrationInput({ name, email, password, role });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  // Defense in depth: validateRegistrationInput already rejects any role
  // other than CUSTOMER/WORKER, but this makes the rule impossible to
  // miss even if that validation is ever changed carelessly later.
  // ADMIN accounts can only be created by the seed script (see
  // backend/prisma/seed.js) — never through this public endpoint.
  if (role === "ADMIN") {
    return res.status(403).json({ error: "Admin accounts cannot be created through registration." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Customer registration creates only a User.
  // Worker registration creates a User AND a WorkerProfile
  // (verificationStatus defaults to PENDING per the approved schema).
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      ...(role === "WORKER" ? { workerProfile: { create: {} } } : {}),
    },
  });

  const token = signToken({ id: user.id, role: user.role });
  res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

  return res.status(201).json({ user: toSafeUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const errors = validateLoginInput({ email, password });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Same generic message whether the email doesn't exist or the
  // password is wrong — avoids revealing which emails are registered.
  const invalidCredentialsResponse = () =>
    res.status(401).json({ error: "Invalid email or password." });

  if (!user) {
    return invalidCredentialsResponse();
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return invalidCredentialsResponse();
  }

  const token = signToken({ id: user.id, role: user.role });
  res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

  return res.status(200).json({ user: toSafeUser(user) });
}

// Requires `authenticate` middleware to have run first.
// Re-reads the user from the database (rather than trusting the JWT
// payload alone) so the frontend always sees the current role/state.
export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  return res.status(200).json({ user: toSafeUser(user) });
}

export async function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
  return res.status(200).json({ success: true });
}
