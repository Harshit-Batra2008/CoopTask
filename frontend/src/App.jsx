import { Routes, Route } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/global.css";

import RoleSwitcher from "./dev/RoleSwitcher.jsx"; // DEV TOOL — see src/dev/
import CustomerHome from "./pages/customer/CustomerHome.jsx";
import WorkerHome from "./pages/worker/WorkerHome.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";

// Routing root for CoopTask.
//
// "/" is the temporary dev-only role switcher (see src/dev/RoleSwitcher.jsx)
// standing in for login until real authentication exists. Everything
// else here is a real (placeholder) product screen.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSwitcher />} />
      <Route path="/customer" element={<CustomerHome />} />
      <Route path="/worker" element={<WorkerHome />} />
      <Route path="/admin" element={<AdminHome />} />
    </Routes>
  );
}
