// Reusable labeled select. Used for choosing a skill from the existing
// service catalog — never free text, to preserve the WorkerSkill <->
// Service naming convention.

export default function Select({ label, value, onChange, options, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        style={{
          minHeight: "var(--touch-target-min)",
          padding: "0 var(--space-3)",
          fontSize: "var(--font-size-md)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
