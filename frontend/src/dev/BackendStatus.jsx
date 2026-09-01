import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api.js";

// ============================================================
// DEV-ONLY TOOL — NOT A COOPTASK PRODUCT FEATURE.
// Preserves the Phase 0 backend health-check for local development.
// Safe to delete this whole file at any time; the only place it's used
// is src/dev/DevFooter.jsx.
// ============================================================

export default function BackendStatus() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`ok — "${data.status}" (${data.phase})`))
      .catch(() => setStatus("unreachable — is the backend running on port 4000?"));
  }, []);

  return (
    <div style={{ fontFamily: "monospace" }}>
      backend health: {status}
    </div>
  );
}
