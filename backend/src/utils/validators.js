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
