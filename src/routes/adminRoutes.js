import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
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

// ✅ Create user/admin/mentor
router.post(
  "/users",
  firebaseAuthMiddleware,
  adminMiddleware,
  createAdminUser
);

// ✅ Patch user fields
router.patch(
  "/users/:id",
  firebaseAuthMiddleware,
  adminMiddleware,
  updateAdminUser
);
router.post(
  "/users/:id",
  firebaseAuthMiddleware,
  adminMiddleware,
  updateAdminUser
);

// ✅ Update status
router.patch(
  "/users/:id/status",
  firebaseAuthMiddleware,
  adminMiddleware,
  updateAdminUserStatus
);
router.post(
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
router.post(
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