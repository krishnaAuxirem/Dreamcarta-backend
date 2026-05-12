import express from "express";
import { getPublicPlans } from "../controllers/planController.js";
import { subscribeToPlan } from "../controllers/subscriptionController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getPublicPlans);
router.post("/subscribe", verifyToken, checkRole("user", "mentor", "admin"), subscribeToPlan);

export default router;
