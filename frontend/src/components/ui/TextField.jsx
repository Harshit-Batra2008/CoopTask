// Reusable labeled text input. Simple, controlled component — no form
// library, since two short forms (login/register) don't need one.

export default function TextField({ label, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          minHeight: "var(--touch-target-min)",
          padding: "0 var(--space-3)",
          fontSize: "var(--font-size-md)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      />
    </label>
  );
}
