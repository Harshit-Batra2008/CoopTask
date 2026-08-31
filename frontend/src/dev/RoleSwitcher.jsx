import { Link } from "react-router-dom";
import BackendStatus from "./BackendStatus.jsx";

// ============================================================
// DEV-ONLY TOOL — NOT A COOPTASK PRODUCT FEATURE.
//
// This is a temporary stand-in for login/authentication, which has not
// been built yet. It lets the team preview the customer/worker/admin
// screens without a real auth flow.
//
// It is styled deliberately differently from the rest of the app
// (monospace font, dashed border, warning colors, "DEV TOOL" label) so
// it can never be mistaken for a real CoopTask screen in a demo or
// screenshot.
//
// REMOVE THIS FILE (and its route in App.jsx) once real authentication
// is implemented. Nothing else in the app imports from src/dev/.
// ============================================================

const ROLES = [
  { to: "/customer", label: "Customer" },
  { to: "/worker", label: "Worker" },
  { to: "/admin", label: "Cooperative Admin" },
];

export default function RoleSwitcher() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        background: "#fffbea",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          border: "2px dashed #d98a11",
          borderRadius: "var(--radius-md)",
          background: "#ffffff",
          padding: "var(--space-5)",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#d98a11",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-3)",
          }}
        >
          DEV TOOL — NOT A PRODUCT SCREEN
        </div>

        <h1 style={{ fontSize: "16px", marginBottom: "var(--space-1)" }}>
          CoopTask — role preview
        </h1>
        <p style={{ fontSize: "12px", color: "#555", marginBottom: "var(--space-4)" }}>
          Temporary stand-in for login. Pick a role to preview its screens.
          This screen will be removed once authentication is built.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {ROLES.map((role) => (
            <Link
              key={role.to}
              to={role.to}
              style={{
                display: "block",
                textAlign: "center",
                padding: "var(--space-3)",
                border: "1px solid #d98a11",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                color: "#1a1f1c",
              }}
            >
              View as: {role.label}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-4)", borderTop: "1px dashed #d98a11", paddingTop: "var(--space-3)" }}>
          <BackendStatus />
        </div>
      </div>
    </div>
  );
}
