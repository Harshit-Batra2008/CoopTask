import { useNavigate } from "react-router-dom";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

const NAV_ITEMS = [
  { to: "/worker", label: "Home", icon: "🏠" },
  { to: "/worker/jobs", label: "Jobs", icon: "🧰" },
  { to: "/worker/availability", label: "Availability", icon: "🗓️" },
  { to: "/worker/profile", label: "Profile", icon: "👤" },
];

// Placeholder shell only — no worker profile or job-request data exists
// yet (no backend routes for workers/bookings have been built).
export default function WorkerHome() {
  const navigate = useNavigate();

  return (
    <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
      <Card>
        <h1 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-1)" }}>
          Your profile
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginBottom: "var(--space-3)" }}>
          Manage your bio, skills, certifications, and see your current
          verification status.
        </p>
        <Button variant="primary" fullWidth onClick={() => navigate("/worker/profile")}>
          View my profile
        </Button>
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
