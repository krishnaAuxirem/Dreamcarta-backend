import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import { createPlan, getAdminPlans, updatePlan } from "../controllers/planController.js";

const router = express.Router();

router.get("/", verifyToken, checkRole("admin"), getAdminPlans);
router.post("/", verifyToken, checkRole("admin"), createPlan);
router.put("/:id", verifyToken, checkRole("admin"), updatePlan);

export default router;
