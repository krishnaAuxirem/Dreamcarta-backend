import Blog from "../models/Blog.js";

// CREATE
export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch {
    res.status(500).json({ message: "Create failed ❌" });
  }
};

// GET ALL
export const getBlogs = async (req, res) => {
  const blogs = await Blog.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(blogs);
};

// UPDATE
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found ❌" });
    }

    await blog.update(req.body);

    res.json({ message: "Blog updated ✅", blog });
  } catch {
    res.status(500).json({ message: "Update failed ❌" });
  }
};

// DELETE
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });

  await blog.destroy();
  res.json({ message: "Deleted ✅" });
};
