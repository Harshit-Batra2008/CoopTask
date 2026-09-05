// CoopTask backend entrypoint.
//
// Phase 3 adds: cookie parsing (for the httpOnly auth cookie),
// credentialed CORS (so the frontend's cookie-based session works
// across ports in local development), and the /api/auth/* routes.
//
// Still deliberately simple: one file wiring everything together, no
// app factory pattern, no dependency injection framework — a student
// can read this file top to bottom and understand the whole server.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import workerRoutes from "./routes/worker.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

// Fail fast and loudly if a required secret is missing, rather than
// silently signing tokens with `undefined`.
if (!process.env.JWT_SECRET) {
  console.error(
    "Missing JWT_SECRET in environment. Copy backend/.env.example to backend/.env and set a value."
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // required for the httpOnly auth cookie to be sent/received
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check — used by the frontend dev tool to confirm frontend
// <-> backend communication is working. Nothing more.
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "cooptask-backend",
    phase: "4-service-catalog-worker-profile",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`CoopTask backend listening on http://localhost:${PORT}`);
});
