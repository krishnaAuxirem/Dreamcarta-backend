import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
  createAdminUser,
  updateUserRole,
  getAdminStats
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

// ✅ Update role (ONLY ONE TIME)
router.patch(
  "/users/:id/role",
  firebaseAuthMiddleware,
  adminMiddleware,
  updateUserRole
);

// ✅ Delete user
router.delete(
  "/users/:id",
  firebaseAuthMiddleware,
  adminMiddleware,
  deleteAdminUser
);

// ✅ Create admin
router.post(
  "/create-admin",
  firebaseAuthMiddleware,
  adminMiddleware,
  createAdminUser
);

router.get(
  "/stats",
  firebaseAuthMiddleware,
  adminMiddleware,
  getAdminStats
);
export default router; 