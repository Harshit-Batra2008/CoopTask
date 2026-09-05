import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  listWorkersForAdmin,
  getWorkerForAdmin,
  verifyWorker,
  getAdminStats,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/stats", authenticate, authorize("ADMIN"), getAdminStats);
router.get("/workers", authenticate, authorize("ADMIN"), listWorkersForAdmin);
router.get("/workers/:id", authenticate, authorize("ADMIN"), getWorkerForAdmin);
router.patch("/workers/:id/verify", authenticate, authorize("ADMIN"), verifyWorker);

export default router;
