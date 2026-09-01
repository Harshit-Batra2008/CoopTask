import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Top bar shown on every role screen. Brand name + current role label,
// same as before — now also shows who's signed in and a real logout
// button, since real auth exists as of Phase 3.

export default function TopBar({ roleLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header
      style={{
        height: "var(--top-bar-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-4)",
        background: "var(--color-primary)",
        color: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-lg)" }}>
          CoopTask
        </span>
        {roleLabel && (
          <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.85 }}>{roleLabel}</span>
        )}
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.9 }}>{user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.6)",
              color: "#ffffff",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-1) var(--space-2)",
              fontSize: "var(--font-size-xs)",
            }}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
