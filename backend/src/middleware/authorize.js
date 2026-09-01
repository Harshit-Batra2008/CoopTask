// Role authorization middleware.
//
// Must run AFTER `authenticate` (it depends on req.user being set).
// Restricts a route to one or more roles. The role checked here always
// comes from the verified JWT payload set by `authenticate` — never
// from anything the frontend sends in the request body — which is what
// makes this the real security boundary, not just a UI convenience.
//
// Usage: router.get("/admin-only", authenticate, authorize("ADMIN"), handler)

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have access to this resource." });
    }

    next();
  };
}
