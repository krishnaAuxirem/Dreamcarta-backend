import express from "express";
import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadLocal.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin
router.post("/", firebaseAuthMiddleware, adminMiddleware, createBlog);
router.post(
  "/upload",
  firebaseAuthMiddleware,
  adminMiddleware,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Image file required ❌" });
    }

    res.json({
      url: `/uploads/${req.file.filename}`,
    });
  }
);
router.put("/:id", firebaseAuthMiddleware, adminMiddleware, updateBlog);
router.delete("/:id", firebaseAuthMiddleware, adminMiddleware, deleteBlog);

export default router;
