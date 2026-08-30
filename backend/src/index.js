// TrustServe backend — Phase 0 foundation
//
// This file intentionally contains NO business logic, NO authentication,
// and NO database queries yet. Its only job right now is to prove that
// the backend server runs and that the frontend can reach it.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check — used by the frontend to confirm frontend <-> backend
// communication is working. Nothing more.
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "trustserve-backend",
    phase: "0-foundation",
  });
});

app.listen(PORT, () => {
  console.log(`TrustServe backend listening on http://localhost:${PORT}`);
});
