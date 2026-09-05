import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { apiFetch } from "../../utils/api.js";
import { verificationBadge } from "../../utils/verificationBadge.js";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/workers", label: "Workers", icon: "🧑‍🔧" },
  { to: "/admin/bookings", label: "Bookings", icon: "📋" },
  { to: "/admin/services", label: "Services", icon: "🗂️" },
];

const FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminWorkersScreen() {
  const [filter, setFilter] = useState("PENDING");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decidingId, setDecidingId] = useState(null);
  const [decisionError, setDecisionError] = useState(null);

  function loadWorkers() {
    setLoading(true);
    setError(null);
    const query = filter ? `?status=${filter}` : "";
    return apiFetch(`/api/admin/workers${query}`)
      .then((data) => setWorkers(data.workers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleDecision(workerId, decision) {
    setDecisionError(null);
    setDecidingId(workerId);
    try {
      const data = await apiFetch(`/api/admin/workers/${workerId}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      });
      setWorkers((prev) => {
        // If the current filter no longer matches this worker's new
        // status, drop it from the list; otherwise update it in place.
        const updated = data.worker;
        if (filter && updated.verificationStatus !== filter) {
          return prev.filter((w) => w.id !== workerId);
        }
        return prev.map((w) => (w.id === workerId ? updated : w));
      });
    } catch (err) {
      setDecisionError(err.message);
    } finally {
      setDecidingId(null);
    }
  }

  return (
    <AppShell roleLabel="Cooperative Admin" navItems={NAV_ITEMS}>
      <h1 style={{ fontSize: "var(--font-size-lg)" }}>Worker verification</h1>

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              flex: 1,
              padding: "var(--space-2)",
              borderRadius: "var(--radius-sm)",
              border: filter === f.value ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: filter === f.value ? "var(--color-primary-soft)" : "var(--color-surface)",
              fontSize: "var(--font-size-xs)",
              minHeight: "var(--touch-target-min)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {decisionError && <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{decisionError}</p>}

      {loading && <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>Loading workers…</p>}

      {!loading && error && (
        <Card style={{ borderColor: "var(--color-danger)" }}>
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>Couldn't load workers: {error}</p>
        </Card>
      )}

      {!loading && !error && workers.length === 0 && (
        <Card>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            No workers match this filter.
          </p>
        </Card>
      )}

      {!loading &&
        !error &&
        workers.map((worker) => {
          const badge = verificationBadge(worker.verificationStatus);
          return (
            <Card key={worker.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                <div>
                  <p style={{ fontWeight: "var(--font-weight-medium)" }}>{worker.name}</p>
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>{worker.email}</p>
                </div>
                <StatusBadge label={badge.label} tone={badge.tone} />
              </div>

              {worker.bio && (
                <p style={{ fontSize: "var(--font-size-sm)", marginBottom: "var(--space-2)" }}>{worker.bio}</p>
              )}

              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>
                Skills: {worker.skills.length === 0 ? "none listed" : worker.skills.map((s) => s.skillName).join(", ")}
              </p>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                Certifications:{" "}
                {worker.certifications.length === 0
                  ? "none listed"
                  : worker.certifications.map((c) => `${c.name} (${c.issuingOrganization})`).join(", ")}
              </p>

              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={decidingId === worker.id || worker.verificationStatus === "APPROVED"}
                  onClick={() => handleDecision(worker.id, "APPROVED")}
                >
                  {decidingId === worker.id ? "…" : "Approve"}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  disabled={decidingId === worker.id || worker.verificationStatus === "REJECTED"}
                  onClick={() => handleDecision(worker.id, "REJECTED")}
                >
                  {decidingId === worker.id ? "…" : "Reject"}
                </Button>
              </div>
            </Card>
          );
        })}
    </AppShell>
  );
}
