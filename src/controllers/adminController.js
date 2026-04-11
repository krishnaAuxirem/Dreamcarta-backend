import User from "../models/User.js";

const sanitizeUser = (userInstance) => {
  const user = userInstance?.toJSON ? userInstance.toJSON() : userInstance;
  if (!user) {
    return user;
  }
  delete user.password;
  return user;
};

const toAdminListItem = (user) => ({
  id: String(user.id),
  name: user.name || "Unknown User",
  email: user.email || "",
  role: user.role === "admin" ? "admin" : "user",
  joinedAt: user.createdAt,
  goals: 0,
  habits: 0,
  status: user.isActive ? "active" : "inactive",
  isActive: Boolean(user.isActive),
});

export const getAdminUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const search = String(req.query.search || "").trim();

    const where = {};
    if (search) {
      where.name = search;
    }

    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    const filteredUsers = search
      ? users.filter((u) => {
          const name = String(u.name || "").toLowerCase();
          const email = String(u.email || "").toLowerCase();
          const needle = search.toLowerCase();
          return name.includes(needle) || email.includes(needle);
        })
      : users;

    res.status(200).json({
      users: filteredUsers.map((u) => toAdminListItem(sanitizeUser(u))),
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

export const updateAdminUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (status !== "active" && status !== "inactive") {
      return res.status(400).json({ message: "Status must be active or inactive ❌" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    if (req.admin?.id === user.id && status === "inactive") {
      return res.status(400).json({ message: "You cannot deactivate your own admin account ❌" });
    }

    user.isActive = status === "active";
    await user.save();

    res.status(200).json({
      message: "User status updated ✅",
      user: toAdminListItem(sanitizeUser(user)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    if (req.admin?.id === user.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account ❌" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};
