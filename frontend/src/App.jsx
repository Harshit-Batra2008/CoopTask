import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/global.css";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import LoginScreen from "./pages/auth/LoginScreen.jsx";
import RegisterScreen from "./pages/auth/RegisterScreen.jsx";
import CustomerHome from "./pages/customer/CustomerHome.jsx";
import CustomerServices from "./pages/customer/CustomerServices.jsx";
import WorkerHome from "./pages/worker/WorkerHome.jsx";
import WorkerProfileScreen from "./pages/worker/WorkerProfileScreen.jsx";
import WorkerAvailabilityScreen from "./pages/worker/WorkerAvailabilityScreen.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import AdminServicesScreen from "./pages/admin/AdminServicesScreen.jsx";
import AdminWorkersScreen from "./pages/admin/AdminWorkersScreen.jsx";

const ROLE_HOME = {
  CUSTOMER: "/customer",
  WORKER: "/worker",
  ADMIN: "/admin",
};

// "/" sends a signed-in user to their role's home, and an unsigned-in
// visitor to /login. Replaces the old dev-only RoleSwitcher as the
// entry point now that real authentication exists.
function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "var(--space-5)", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading…
      </div>
    );
  }

  return <Navigate to={user ? ROLE_HOME[user.role] || "/login" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerServices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRole="WORKER">
            <WorkerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/profile"
        element={
          <ProtectedRoute allowedRole="WORKER">
            <WorkerProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/availability"
        element={
          <ProtectedRoute allowedRole="WORKER">
            <WorkerAvailabilityScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminServicesScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/workers"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminWorkersScreen />
          </ProtectedRoute>
        }
      />

      {/* Anything unmatched falls back to the root redirect logic. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
