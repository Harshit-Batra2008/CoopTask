import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import TextField from "../../components/ui/TextField.jsx";
import { apiFetch } from "../../utils/api.js";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/workers", label: "Workers", icon: "🧑‍🔧" },
  { to: "/admin/bookings", label: "Bookings", icon: "📋" },
  { to: "/admin/services", label: "Services", icon: "🗂️" },
];

const EMPTY_FORM = { name: "", category: "", description: "" };

export default function AdminServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  function loadServices() {
    setLoading(true);
    setLoadError(null);
    return apiFetch("/api/services")
      .then((data) => setServices(data.services))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const data = await apiFetch("/api/services", { method: "POST", body: JSON.stringify(form) });
      setServices((prev) => [...prev, data.service].sort((a, b) => a.name.localeCompare(b.name)));
      setForm(EMPTY_FORM);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(service) {
    setEditingId(service.id);
    setEditForm({ name: service.name, category: service.category || "", description: service.description || "" });
    setEditError(null);
  }

  async function handleSaveEdit(e, id) {
    e.preventDefault();
    setEditError(null);
    setSavingEdit(true);
    try {
      const data = await apiFetch(`/api/services/${id}`, { method: "PUT", body: JSON.stringify(editForm) });
      setServices((prev) => prev.map((s) => (s.id === id ? data.service : s)));
      setEditingId(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    setDeleteError(null);
    setDeletingId(id);
    try {
      await apiFetch(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell roleLabel="Cooperative Admin" navItems={NAV_ITEMS}>
      <h1 style={{ fontSize: "var(--font-size-lg)" }}>Services</h1>

      <Card>
        <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>Add a service</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Plumbing" />
          <TextField label="Category (optional)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Home repair" />
          <TextField label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
          {createError && <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{createError}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={creating}>
            {creating ? "Adding…" : "Add service"}
          </Button>
        </form>
      </Card>

      {loading && <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>Loading services…</p>}

      {!loading && loadError && (
        <Card style={{ borderColor: "var(--color-danger)" }}>
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>Couldn't load services: {loadError}</p>
        </Card>
      )}

      {!loading && !loadError && services.length === 0 && (
        <Card>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            No services yet. Add the first one above.
          </p>
        </Card>
      )}

      {deleteError && <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{deleteError}</p>}

      {!loading &&
        !loadError &&
        services.map((service) => (
          <Card key={service.id}>
            {editingId === service.id ? (
              <form onSubmit={(e) => handleSaveEdit(e, service.id)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <TextField label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <TextField label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                <TextField label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                {editError && <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{editError}</p>}
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <Button type="submit" variant="primary" fullWidth disabled={savingEdit}>
                    {savingEdit ? "Saving…" : "Save"}
                  </Button>
                  <Button type="button" variant="secondary" fullWidth onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontSize: "var(--font-size-md)" }}>{service.name}</h2>
                  {service.category && (
                    <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>{service.category}</p>
                  )}
                  {service.description && (
                    <p style={{ fontSize: "var(--font-size-sm)", marginTop: "var(--space-1)" }}>{service.description}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <Button variant="secondary" onClick={() => startEdit(service)}>
                    Edit
                  </Button>
                  <Button variant="secondary" onClick={() => handleDelete(service.id)} disabled={deletingId === service.id}>
                    {deletingId === service.id ? "…" : "Delete"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
    </AppShell>
  );
}
