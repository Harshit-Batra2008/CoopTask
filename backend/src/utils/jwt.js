// JWT helpers. The secret always comes from the environment — never
// hardcoded — and the server refuses to start without it (see index.js).

import jwt from "jsonwebtoken";

const TOKEN_EXPIRY = "7d";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
