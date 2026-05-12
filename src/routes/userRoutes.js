import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getUserSettings,
  updateUserSettings,
} from "../controllers/userController.js";

const router = express.Router();

// GET profile
router.get("/profile", firebaseAuthMiddleware, getProfile);

// UPDATE profile
router.put("/profile", firebaseAuthMiddleware, updateProfile);

// DELETE profile
router.delete("/profile", firebaseAuthMiddleware, deleteProfile);

// GET settings
router.get("/settings", firebaseAuthMiddleware, getUserSettings);

// UPDATE settings
router.put("/settings", firebaseAuthMiddleware, updateUserSettings);

export default router;