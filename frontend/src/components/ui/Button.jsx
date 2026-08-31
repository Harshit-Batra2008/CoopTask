// Reusable button. Two variants only (primary/secondary) — deliberately
// simple, no size/shape variant explosion, to stay easy to explain.

const VARIANT_STYLES = {
  primary: {
    background: "var(--color-primary)",
    color: "#ffffff",
    border: "1px solid var(--color-primary)",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-primary-dark)",
    border: "1px solid var(--color-border)",
  },
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  fullWidth = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANT_STYLES[variant],
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-3) var(--space-4)",
        fontSize: "var(--font-size-md)",
        fontWeight: "var(--font-weight-medium)",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
