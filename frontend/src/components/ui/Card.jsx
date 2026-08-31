// Reusable content card. Used throughout CoopTask to group related
// information (a service, a booking, a worker, a stat) with consistent
// spacing and elevation.

export default function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
