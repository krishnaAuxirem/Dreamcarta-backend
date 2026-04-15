import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
  createAdminUser // 👈 ADD THIS
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Get users
router.get(
  "/users",
  firebaseAuthMiddleware,
  adminMiddleware,
  getAdminUsers
);

// ✅ Update status
router.patch(
  "/users/:id/status",
  firebaseAuthMiddleware,
  adminMiddleware,
  updateAdminUserStatus
);

// ✅ Delete user
router.delete(
  "/users/:id",
  firebaseAuthMiddleware,
  adminMiddleware,
  deleteAdminUser
);

// 🔥 CREATE ADMIN (IMPORTANT)
router.post(
  "/create-admin",
  firebaseAuthMiddleware,
  adminMiddleware,
  createAdminUser
);

export default router;
