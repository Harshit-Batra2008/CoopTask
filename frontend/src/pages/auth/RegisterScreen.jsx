import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import TextField from "../../components/ui/TextField.jsx";

const ROLE_HOME = {
  CUSTOMER: "/customer",
  WORKER: "/worker",
};

const ROLE_OPTIONS = [
  { value: "CUSTOMER", label: "I need a service", hint: "Book verified workers" },
  { value: "WORKER", label: "I provide a service", hint: "Join as a cooperative worker" },
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await register({ name, email, password, role });
      navigate(ROLE_HOME[user.role] || "/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "var(--space-5)",
        background: "var(--color-bg)",
      }}
    >
      <div className="max-content-width">
        <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
          <h1 style={{ fontSize: "var(--font-size-xl)", color: "var(--color-primary-dark)" }}>
            CoopTask
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            Create your account
          </p>
        </div>

        <Card>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
          >
            <div>
              <span
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--color-text-muted)",
                  display: "block",
                  marginBottom: "var(--space-2)",
                }}
              >
                I am registering as
              </span>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      style={{
                        flex: 1,
                        textAlign: "left",
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-sm)",
                        border: selected
                          ? "2px solid var(--color-primary)"
                          : "1px solid var(--color-border)",
                        background: selected ? "var(--color-primary-soft)" : "var(--color-surface)",
                        minHeight: "var(--touch-target-min)",
                      }}
                    >
                      <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        {option.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />

            {error && (
              <p
                role="alert"
                style={{
                  color: "var(--color-danger)",
                  background: "var(--color-danger-soft)",
                  borderRadius: "var(--radius-sm)",
                  padding: "var(--space-2) var(--space-3)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Card>

        <p
          style={{
            textAlign: "center",
            marginTop: "var(--space-4)",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: "var(--font-weight-medium)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
