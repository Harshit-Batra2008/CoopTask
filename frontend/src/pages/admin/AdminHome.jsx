import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { apiFetch } from "../../utils/api.js";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/workers", label: "Workers", icon: "🧑‍🔧" },
  { to: "/admin/bookings", label: "Bookings", icon: "📋" },
  { to: "/admin/services", label: "Services", icon: "🗂️" },
];

// "Active bookings" stays "--" — Booking is not implemented yet, and
// this dashboard never shows invented numbers for unbuilt features.
// "Verified workers" and the pending-verification count ARE real,
// fetched from GET /api/admin/stats.
export default function AdminHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null); // null until loaded — never a fake starting number
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setStatsError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            {stats ? stats.verifiedWorkersCount : "--"}
          </p>
        </Card>
      </div>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Worker verification queue
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginBottom: "var(--space-3)" }}>
          {stats
            ? stats.pendingWorkersCount === 0
              ? "No workers are currently awaiting verification."
              : `${stats.pendingWorkersCount} worker${stats.pendingWorkersCount === 1 ? "" : "s"} awaiting verification.`
            : statsError
            ? "Couldn't load the pending count right now."
            : "Loading…"}
        </p>
        <Button variant="primary" fullWidth onClick={() => navigate("/admin/workers")}>
          Review workers
        </Button>
      </Card>
    </AppShell>
  );
}
