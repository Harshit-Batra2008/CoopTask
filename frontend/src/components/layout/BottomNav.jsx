import { NavLink } from "react-router-dom";

// Role-aware bottom navigation. Each role screen passes its own list of
// items — this component doesn't know about roles itself, it just
// renders whatever tabs it's given. Keeps it reusable and simple.
//
// items: [{ to: "/customer", label: "Home", icon: "🏠" }, ...]

export default function BottomNav({ items }) {
  return (
    <nav
      className="safe-bottom"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--bottom-nav-height)",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        zIndex: 10,
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className="tap-target"
          style={({ isActive }) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            fontSize: "var(--font-size-xs)",
            fontWeight: isActive ? "var(--font-weight-medium)" : "var(--font-weight-regular)",
            color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
          })}
        >
          <span style={{ fontSize: "18px" }} aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
