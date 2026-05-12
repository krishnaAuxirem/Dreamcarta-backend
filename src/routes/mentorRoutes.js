import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import {
  addMentorAdvice,
  getMentorAnalytics,
  getMentorGoals,
  getMentorUsers,
  getAvailableMentors,
} from "../controllers/mentorController.js";
import { highlightCommunityPost } from "../controllers/communityController.js";

const router = express.Router();

router.get("/users", verifyToken, checkRole("mentor", "admin"), getMentorUsers);
router.get("/goals/:userId", verifyToken, checkRole("mentor", "admin"), getMentorGoals);
router.get("/analytics", verifyToken, checkRole("mentor", "admin"), getMentorAnalytics);
router.post("/advice", verifyToken, checkRole("mentor", "admin"), addMentorAdvice);
router.get("/available", verifyToken, getAvailableMentors);
router.patch(
  "/community/:id/highlight",
  verifyToken,
  checkRole("mentor", "admin"),
  highlightCommunityPost
);

export default router;
