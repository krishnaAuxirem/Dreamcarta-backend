import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import {
  getUserActivity,
  getAllActivity,
  getUserMentions,
  markMentionAsRead,
} from "../controllers/activityController.js";

const router = express.Router();

// Get user's own activity
router.get("/user/:userId", verifyToken, getUserActivity);

// Get all activity (superadmin/admin only)
router.get(
  "/all",
  verifyToken,
  checkRole("admin"),
  getAllActivity
);

// Get mentions for current user
router.get("/mentions/my", verifyToken, getUserMentions);

// Mark mention as read
router.patch("/mentions/:mentionId/read", verifyToken, markMentionAsRead);

export default router;
