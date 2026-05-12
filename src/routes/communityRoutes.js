import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import {
  addCommunityComment,
  createCommunityPost,
  getCommunityPosts,
  toggleCommunityLike,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/", getCommunityPosts);
router.post("/", verifyToken, checkRole("user", "mentor", "admin"), createCommunityPost);
router.patch("/:id/like", verifyToken, checkRole("user", "mentor", "admin"), toggleCommunityLike);
router.post("/:id/comments", verifyToken, checkRole("user", "mentor", "admin"), addCommunityComment);

export default router;
