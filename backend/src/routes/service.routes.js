import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  listServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = Router();

// Any authenticated user (customer, worker, or admin) can read the catalog.
router.get("/", authenticate, listServices);

// Only admins can manage the catalog.
router.post("/", authenticate, authorize("ADMIN"), createService);
router.put("/:id", authenticate, authorize("ADMIN"), updateService);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteService);

export default router;
