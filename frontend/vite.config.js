import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal Vite config — Phase 0 foundation. No extra plugins/abstractions.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
