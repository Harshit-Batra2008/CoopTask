// Top bar shown on every role screen. Simple: brand name + current
// role label. No search, no icons yet — kept minimal on purpose.

export default function TopBar({ roleLabel }) {
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
      <span style={{ fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-lg)" }}>
        CoopTask
      </span>
      {roleLabel && (
        <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.85 }}>{roleLabel}</span>
      )}
    </header>
  );
}
