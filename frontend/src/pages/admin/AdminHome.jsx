import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/workers", label: "Workers", icon: "🧑‍🔧" },
  { to: "/admin/bookings", label: "Bookings", icon: "📋" },
  { to: "/admin/services", label: "Services", icon: "🗂️" },
];

// Placeholder shell only — statistics show "--" rather than invented
// numbers, since no backend/data layer has been connected in this phase.
export default function AdminHome() {
  return (
    <AppShell roleLabel="Cooperative Admin" navItems={NAV_ITEMS}>
      <Card>
        <h1 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-1)" }}>
          Cooperative dashboard
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          Statistics, forecasting, and workforce allocation will be
          connected in a later phase.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <Card>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            Active bookings
          </p>
          <p style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)" }}>
            --
          </p>
        </Card>
        <Card>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            Verified workers
          </p>
          <p style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)" }}>
            --
          </p>
        </Card>
      </div>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Worker verification queue
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          No pending verification requests yet.
        </p>
      </Card>
    </AppShell>
  );
}
