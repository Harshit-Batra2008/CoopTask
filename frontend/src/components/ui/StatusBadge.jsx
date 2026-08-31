// Reusable status indicator chip.
//
// Deliberately generic: the caller passes a "tone" (success / warning /
// danger / pending) rather than this component trying to guess colors
// from raw enum strings like "COMPLETED" or "APPROVED". Keeping the
// status-to-tone mapping at the call site keeps this component simple
// and reusable for both booking status and worker verification status.

const TONE_STYLES = {
  success: { bg: "var(--color-success-soft)", fg: "var(--color-success)" },
  warning: { bg: "var(--color-warning-soft)", fg: "var(--color-warning)" },
  danger: { bg: "var(--color-danger-soft)", fg: "var(--color-danger)" },
  pending: { bg: "var(--color-pending-soft)", fg: "var(--color-pending)" },
};

export default function StatusBadge({ label, tone = "pending" }) {
  const { bg, fg } = TONE_STYLES[tone] || TONE_STYLES.pending;

  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: fg,
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-weight-medium)",
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
