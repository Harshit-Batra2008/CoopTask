import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import { apiFetch } from "../../utils/api.js";

const NAV_ITEMS = [
  { to: "/customer", label: "Home", icon: "🏠" },
  { to: "/customer/services", label: "Book", icon: "🔍" },
  { to: "/customer/bookings", label: "Bookings", icon: "📋" },
  { to: "/customer/profile", label: "Profile", icon: "👤" },
];

export default function CustomerServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch("/api/services")
      .then((data) => {
        if (!cancelled) setServices(data.services);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell roleLabel="Customer" navItems={NAV_ITEMS}>
      <h1 style={{ fontSize: "var(--font-size-lg)" }}>Services</h1>

      {loading && (
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
          Loading services…
        </p>
      )}

      {!loading && error && (
        <Card style={{ borderColor: "var(--color-danger)" }}>
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
            Couldn't load services: {error}
          </p>
        </Card>
      )}

      {!loading && !error && services.length === 0 && (
        <Card>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            No services are available yet. Check back soon.
          </p>
        </Card>
      )}

      {!loading &&
        !error &&
        services.map((service) => {
          const selected = selectedId === service.id;
          return (
            <Card
              key={service.id}
              style={{
                border: selected ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              }}
            >
              <div onClick={() => setSelectedId(selected ? null : service.id)} style={{ cursor: "pointer" }}>
                <h2 style={{ fontSize: "var(--font-size-md)" }}>{service.name}</h2>
                {service.category && (
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                    {service.category}
                  </p>
                )}
                {service.description && (
                  <p style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-2)" }}>
                    {service.description}
                  </p>
                )}
                {selected && (
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--color-primary)",
                      marginTop: "var(--space-2)",
                    }}
                  >
                    Selected — booking isn't available in this build yet.
                  </p>
                )}
              </div>
            </Card>
          );
        })}
    </AppShell>
  );
}
