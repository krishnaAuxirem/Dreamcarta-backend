import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/roleMiddleware.js";
import { createBlog, deleteBlog, getBlogs, updateBlog } from "../controllers/blogController.js";
import upload from "../middleware/uploadLocal.js";

const router = express.Router();

router.get("/", verifyToken, checkRole("admin"), getBlogs);
router.post("/", verifyToken, checkRole("admin"), createBlog);
router.post(
	"/upload",
	verifyToken,
	checkRole("admin"),
	upload.single("image"),
	(req, res) => {
		if (!req.file) {
			return res.status(400).json({ message: "Image file required ❌" });
		}

		return res.status(200).json({
			url: `/uploads/${req.file.filename}`,
		});
	}
);
router.put("/:id", verifyToken, checkRole("admin"), updateBlog);
router.delete("/:id", verifyToken, checkRole("admin"), deleteBlog);

export default router;
