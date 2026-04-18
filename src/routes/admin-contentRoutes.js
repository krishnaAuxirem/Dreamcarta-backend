import express from "express";
import { getContent, updateContent } from "../controllers/admin-contentController.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public (website fetch)
router.get("/", getContent);

// Admin update
router.put("/", firebaseAuthMiddleware, adminMiddleware, updateContent);

export default router;