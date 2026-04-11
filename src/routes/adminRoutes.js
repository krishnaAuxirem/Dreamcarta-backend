import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", firebaseAuthMiddleware, adminMiddleware, getAdminUsers);
router.patch("/users/:id/status", firebaseAuthMiddleware, adminMiddleware, updateAdminUserStatus);
router.delete("/users/:id", firebaseAuthMiddleware, adminMiddleware, deleteAdminUser);

export default router;
