import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import {
  getAllMentors,
  updateMentorDashboardMessage,
  getMentorDashboardData,
} from "../controllers/adminMentorController.js";

const router = express.Router();

// Get all mentors
router.get("/", verifyToken, checkRole("admin"), getAllMentors);

// Get mentor dashboard data
router.get("/:mentorId/dashboard", verifyToken, checkRole("admin"), getMentorDashboardData);

// Update mentor dashboard message
router.put(
  "/:mentorId/dashboard",
  verifyToken,
  checkRole("admin"),
  updateMentorDashboardMessage
);

export default router;
