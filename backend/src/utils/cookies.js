// Shared cookie settings for the auth token. Kept in one place so the
// cookie set at login/register and the cookie cleared at logout always
// agree on the same options (a mismatch would make logout silently fail
// to clear the cookie in some browsers).

export const AUTH_COOKIE_NAME = "token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true, // not readable by frontend JS — reduces XSS token theft risk
  sameSite: "lax",
  // "secure" should be true once the app is served over HTTPS in a real
  // deployment. False here so cookies still work over plain http://localhost
  // during local development.
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_EXPIRY in utils/jwt.js
};
