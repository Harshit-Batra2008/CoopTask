import BackendStatus from "./BackendStatus.jsx";

// ============================================================
// DEV-ONLY TOOL — NOT A COOPTASK PRODUCT FEATURE.
// A small, clearly-marked footer used only on the login screen during
// local development to confirm the backend is reachable. Safe to
// delete this file (and its one import in LoginScreen.jsx) at any time.
// ============================================================

export default function DevFooter() {
  return (
    <div
      style={{
        marginTop: "var(--space-5)",
        padding: "var(--space-2) var(--space-3)",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-sm)",
        fontSize: "11px",
      }}
    >
      <span style={{ color: "var(--color-text-muted)", marginRight: "6px" }}>[dev]</span>
      <BackendStatus />
    </div>
  );
}
