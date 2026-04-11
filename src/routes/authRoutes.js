import express from "express";
import {
  registerUser,
  loginUser,
  firebaseLogin,
} from "../controllers/authController.js";
import firebaseAuthMiddleware, { verifyFirebaseToken } from "../middleware/firebaseAuthMiddleware.js";

const router = express.Router(); // ✅ FIRST define router

// ================= NORMAL AUTH =================

// register
router.post("/register", registerUser);

// login
router.post("/login", loginUser);

// firebase login/upsert
router.post("/firebase-login", verifyFirebaseToken, firebaseLogin);

// protected route
router.get("/profile", firebaseAuthMiddleware, (req, res) => {
  res.json({
    message: "Protected route access granted",
    user: req.user,
  });
});

export default router; // ✅ MUST export