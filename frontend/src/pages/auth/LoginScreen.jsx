import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import TextField from "../../components/ui/TextField.jsx";
import DevFooter from "../../dev/DevFooter.jsx"; // DEV TOOL — see src/dev/

const ROLE_HOME = {
  CUSTOMER: "/customer",
  WORKER: "/worker",
  ADMIN: "/admin",
};

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
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
            Cooperative-owned household &amp; community services
          </p>
        </div>

        <Card>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
          >
            <h2 style={{ fontSize: "var(--font-size-lg)" }}>Sign in</h2>

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
              placeholder="••••••••"
              autoComplete="current-password"
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
              {submitting ? "Signing in…" : "Sign in"}
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
          New to CoopTask?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: "var(--font-weight-medium)" }}>
            Create an account
          </Link>
        </p>

        <DevFooter />
      </div>
    </div>
  );
}
