import CommunityPost from "../models/CommunityPost.js";

const mapPost = (post) => ({
  id: post.id,
  author: post.authorName,
  authorAvatar: post.authorAvatar,
  content: post.content,
  image: post.image || undefined,
  tags: Array.isArray(post.tags) ? post.tags : [],
  likes: Number(post.likes || 0),
  comments: Number(post.comments || 0),
  shares: Number(post.shares || 0),
  liked: false,
  isHighlighted: Boolean(post.isHighlighted),
  isModerated: Boolean(post.isModerated),
  createdAt: post.createdAt,
});

export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      where: { isDeleted: false },
      order: [
        ["isHighlighted", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      posts: posts.map(mapPost),
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch community posts ❌" });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const content = String(req.body?.content || "").trim();
    const image = String(req.body?.image || "").trim();
    const incomingTags = Array.isArray(req.body?.tags) ? req.body.tags : [];
    const tags = incomingTags
      .map((tag) => String(tag || "").trim())
      .filter(Boolean)
      .slice(0, 8);

    if (!content) {
      return res.status(400).json({ message: "Post content is required ❌" });
    }

    const post = await CommunityPost.create({
      userId: req.user?.id || null,
      authorName: req.user?.name || req.user?.email || "DreamCarta User",
      authorAvatar: req.user?.profilePic || "",
      content,
      image,
      tags,
      likes: 0,
      comments: 0,
      shares: 0,
      isHighlighted: false,
      isModerated: true,
      isDeleted: false,
    });

    return res.status(201).json({
      message: "Post created ✅",
      post: mapPost(post),
    });
  } catch {
    return res.status(500).json({ message: "Failed to create post ❌" });
  }
};

export const toggleCommunityLike = async (req, res) => {
  try {
    const { id } = req.params;
    const action = String(req.body?.action || "toggle").toLowerCase();
    const post = await CommunityPost.findByPk(id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    if (action === "unlike") {
      post.likes = Math.max(0, Number(post.likes || 0) - 1);
    } else {
      post.likes = Number(post.likes || 0) + 1;
    }

    await post.save();
    return res.status(200).json({ post: mapPost(post) });
  } catch {
    return res.status(500).json({ message: "Failed to update like ❌" });
  }
};

export const addCommunityComment = async (req, res) => {
  try {
    const { id } = req.params;
    const content = String(req.body?.content || "").trim();
    if (!content) {
      return res.status(400).json({ message: "Comment content required ❌" });
    }

    const post = await CommunityPost.findByPk(id);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    post.comments = Number(post.comments || 0) + 1;
    await post.save();

    return res.status(200).json({
      message: "Comment added ✅",
      post: mapPost(post),
    });
  } catch {
    return res.status(500).json({ message: "Failed to add comment ❌" });
  }
};

export const deleteCommunityPostAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findByPk(id);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    post.isDeleted = true;
    post.isModerated = true;
    await post.save();

    return res.status(200).json({ message: "Post removed ✅" });
  } catch {
    return res.status(500).json({ message: "Failed to delete post ❌" });
  }
};

export const highlightCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findByPk(id);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    post.isHighlighted = !post.isHighlighted;
    post.isModerated = true;
    await post.save();

    return res.status(200).json({
      message: post.isHighlighted ? "Post highlighted ✅" : "Post unhighlighted ✅",
      post: mapPost(post),
    });
  } catch {
    return res.status(500).json({ message: "Failed to update highlight ❌" });
  }
};
