import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

const NAV_ITEMS = [
  { to: "/worker", label: "Home", icon: "🏠" },
  { to: "/worker/jobs", label: "Jobs", icon: "🧰" },
  { to: "/worker/availability", label: "Availability", icon: "🗓️" },
  { to: "/worker/profile", label: "Profile", icon: "👤" },
];

// Placeholder shell only — no worker profile or job-request data exists
// yet (no backend routes for workers/bookings have been built).
export default function WorkerHome() {
  return (
    <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-1)",
          }}
        >
          <h1 style={{ fontSize: "var(--font-size-lg)" }}>Your profile</h1>
          <StatusBadge label="Verification: not yet submitted" tone="pending" />
        </div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          Profile setup, skills, and certifications will be connected in a
          later phase.
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Job requests
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          You have no job requests yet.
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Completed jobs
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          No completed jobs yet.
        </p>
      </Card>
    </AppShell>
  );
}
