import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import { createReview, deleteReview, getReviews, updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", verifyToken, checkRole("admin"), getReviews);
router.post("/", verifyToken, checkRole("admin"), createReview);
router.put("/:id", verifyToken, checkRole("admin"), updateReview);
router.delete("/:id", verifyToken, checkRole("admin"), deleteReview);

export default router;
