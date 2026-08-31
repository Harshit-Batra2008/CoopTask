import { useEffect, useState } from "react";

// ============================================================
// DEV-ONLY TOOL — NOT A COOPTASK PRODUCT FEATURE.
// Preserves the Phase 0 backend health-check for local development.
// Safe to delete this whole file at any time; nothing else imports it
// except src/dev/RoleSwitcher.jsx.
// ============================================================

const BACKEND_URL = "http://localhost:4000";

export default function BackendStatus() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`ok — "${data.status}" (${data.phase})`))
      .catch(() => setStatus("unreachable — is the backend running on port 4000?"));
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#555",
      }}
    >
      backend health: {status}
    </div>
  );
}
