import { useEffect, useState } from "react";

// TrustServe frontend — Phase 0 foundation.
// This component intentionally has NO business features yet.
// Its only job is to prove the frontend can reach the backend API.

const BACKEND_URL = "http://localhost:4000";

export default function App() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`connected — backend says: "${data.status}" (${data.phase})`))
      .catch(() => setStatus("could not reach backend — is it running on port 4000?"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "60px auto", padding: 24 }}>
      <h1>TrustServe</h1>
      <p>SIH 2026 — Problem Statement 26089</p>
      <p>Phase 0: Foundation scaffold.</p>
      <hr />
      <p>
        <strong>Backend connection status:</strong> {status}
      </p>
    </div>
  );
}
