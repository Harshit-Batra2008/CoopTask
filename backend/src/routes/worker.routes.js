import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
  getMyProfile,
  updateMyProfile,
  listMySkills,
  addMySkill,
  removeMySkill,
  listMyCertifications,
  addMyCertification,
  removeMyCertification,
} from "../controllers/worker.controller.js";

const router = Router();

router.get("/me", authenticate, authorize("WORKER"), getMyProfile);
router.put("/me", authenticate, authorize("WORKER"), updateMyProfile);

router.get("/me/skills", authenticate, authorize("WORKER"), listMySkills);
router.post("/me/skills", authenticate, authorize("WORKER"), addMySkill);
router.delete("/me/skills/:skillId", authenticate, authorize("WORKER"), removeMySkill);

router.get("/me/certifications", authenticate, authorize("WORKER"), listMyCertifications);
router.post("/me/certifications", authenticate, authorize("WORKER"), addMyCertification);
router.delete(
  "/me/certifications/:certificationId",
  authenticate,
  authorize("WORKER"),
  removeMyCertification
);

export default router;
