import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import TextField from "../../components/ui/TextField.jsx";
import { apiFetch } from "../../utils/api.js";

const NAV_ITEMS = [
  { to: "/worker", label: "Home", icon: "🏠" },
  { to: "/worker/jobs", label: "Jobs", icon: "🧰" },
  { to: "/worker/availability", label: "Availability", icon: "🗓️" },
  { to: "/worker/profile", label: "Profile", icon: "👤" },
];

export default function WorkerAvailabilityScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);

  const [isAvailable, setIsAvailable] = useState(true);
  const [area, setArea] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/workers/me")
      .then((data) => {
        if (cancelled) return;
        setIsAvailable(data.profile.isAvailable);
        setArea(data.profile.area || "");
        setLatitude(data.profile.approxLatitude === null ? "" : String(data.profile.approxLatitude));
        setLongitude(data.profile.approxLongitude === null ? "" : String(data.profile.approxLongitude));
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

  async function handleSave(e) {
    e.preventDefault();
    setSaveError(null);
    setSaved(false);
    setSaving(true);
    try {
      const body = {
        isAvailable,
        area: area.trim() === "" ? null : area.trim(),
        approxLatitude: latitude === "" ? null : Number(latitude),
        approxLongitude: longitude === "" ? null : Number(longitude),
      };
      await apiFetch("/api/workers/me", { method: "PUT", body: JSON.stringify(body) });
      setSaved(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>Loading…</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
        <Card style={{ borderColor: "var(--color-danger)" }}>
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
            Couldn't load availability: {error}
          </p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
      <h1 style={{ fontSize: "var(--font-size-lg)" }}>Availability</h1>

      <Card>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
                display: "block",
                marginBottom: "var(--space-2)",
              }}
            >
              Current status
            </span>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button
                type="button"
                variant={isAvailable ? "primary" : "secondary"}
                fullWidth
                onClick={() => setIsAvailable(true)}
              >
                Available
              </Button>
              <Button
                type="button"
                variant={!isAvailable ? "primary" : "secondary"}
                fullWidth
                onClick={() => setIsAvailable(false)}
              >
                Not available
              </Button>
            </div>
          </div>

          <TextField label="Area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Area A" />

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <div style={{ flex: 1 }}>
              <TextField
                label="Approx. latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 28.61"
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextField
                label="Approx. longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 77.20"
              />
            </div>
          </div>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            An approximate location is enough — no live GPS or exact address is used.
          </p>

          {saveError && (
            <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{saveError}</p>
          )}
          {saved && !saveError && (
            <p style={{ color: "var(--color-success)", fontSize: "var(--font-size-sm)" }}>Availability saved.</p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={saving}>
            {saving ? "Saving…" : "Save availability"}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
