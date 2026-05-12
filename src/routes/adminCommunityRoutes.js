import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import { deleteCommunityPostAsAdmin, getCommunityPosts } from "../controllers/communityController.js";

const router = express.Router();

router.get("/", verifyToken, checkRole("admin", "mentor"), getCommunityPosts);
router.delete("/:id", verifyToken, checkRole("admin"), deleteCommunityPostAsAdmin);

export default router;
