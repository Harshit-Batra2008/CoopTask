import TopBar from "./TopBar.jsx";
import BottomNav from "./BottomNav.jsx";

// AppShell is the one reusable frame every customer/worker/admin screen
// renders inside: a top bar, a scrollable content area, and a bottom
// nav bar. Individual pages only need to provide their own content.

export default function AppShell({ roleLabel, navItems, children }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar roleLabel={roleLabel} />

      <main
        className="max-content-width"
        style={{
          flex: 1,
          width: "100%",
          padding: "var(--space-4)",
          paddingBottom: "calc(var(--bottom-nav-height) + var(--space-5))",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {children}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
