import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

const NAV_ITEMS = [
  { to: "/customer", label: "Home", icon: "🏠" },
  { to: "/customer/book", label: "Book", icon: "🔍" },
  { to: "/customer/bookings", label: "Bookings", icon: "📋" },
  { to: "/customer/profile", label: "Profile", icon: "👤" },
];

// Placeholder shell only — no booking data exists yet (no backend
// routes for bookings/services have been built in this phase).
export default function CustomerHome() {
  return (
    <AppShell roleLabel="Customer" navItems={NAV_ITEMS}>
      <Card>
        <h1 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-1)" }}>
          Welcome
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          Find a verified cooperative worker for your household or community
          service needs.
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Browse services
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-sm)",
            marginBottom: "var(--space-3)",
          }}
        >
          Service browsing and booking will be connected in a later phase.
        </p>
        <Button variant="primary" fullWidth disabled>
          Browse services
        </Button>
      </Card>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
          Your bookings
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          You have no bookings yet.
        </p>
      </Card>
    </AppShell>
  );
}
