import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Frontend route guard.
//
// This exists purely for user experience — redirecting someone to
// /login instead of showing them a broken/empty screen. It is NOT the
// real security boundary: even if this were bypassed entirely, every
// protected backend endpoint independently verifies the session via
// the `authenticate`/`authorize` middleware and never trusts anything
// the frontend claims about who the user is.

const ROLE_HOME = {
  CUSTOMER: "/customer",
  WORKER: "/worker",
  ADMIN: "/admin",
};

export default function ProtectedRoute({ allowedRole, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "var(--space-5)", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Logged in, but as the wrong role — send them to their own area
    // rather than showing someone else's screen.
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return children;
}
