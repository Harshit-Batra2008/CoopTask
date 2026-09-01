// Authentication middleware.
//
// Reads the httpOnly auth cookie, verifies the JWT, and attaches the
// authenticated identity (id + role) to req.user. Any route that needs
// a logged-in user puts this middleware first.
//
// This does NOT trust anything the frontend claims about who the user
// is — it only trusts what it can verify from a valid, server-signed
// token.

import { verifyToken } from "../utils/jwt.js";
import { AUTH_COOKIE_NAME } from "../utils/cookies.js";

export function authenticate(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}
