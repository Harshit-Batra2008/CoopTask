// Small fetch wrapper used by the whole frontend for talking to the
// backend. Centralizes three things every call needs: the base URL,
// sending the httpOnly auth cookie (`credentials: "include"`), and
// turning a non-2xx response into a thrown Error with the backend's
// error message.

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // send/receive the httpOnly auth cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = body?.error || `Request failed (${response.status}).`;
    throw new Error(message);
  }

  return body;
}
