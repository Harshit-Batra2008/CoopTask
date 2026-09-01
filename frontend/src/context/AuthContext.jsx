import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";

// Auth session state, shared across the app via React Context — no
// external state-management library needed for something this small.
//
// IMPORTANT: this context is for USER EXPERIENCE only (showing the
// right screens, hiding nav the user can't use). It is NOT the
// security boundary — the backend re-checks the real session on every
// protected request via the `authenticate`/`authorize` middleware,
// regardless of what this context believes on the frontend.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load (including a hard browser refresh), ask the backend
  // "who am I, if anyone?" using the httpOnly cookie. This is what
  // makes a page refresh correctly preserve — or correctly NOT grant —
  // the logged-in state, since there's no token sitting in JS-readable
  // storage to trust blindly.
  const loadSession = useCallback(async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function login(email, password) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data.user;
  }

  async function register({ name, email, password, role }) {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
