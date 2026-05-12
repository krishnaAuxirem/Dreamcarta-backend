import User from "../models/User.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

const ALLOWED_ROLES = ["user", "mentor", "admin"];

const normalizeRole = (value, fallback = "user") => {
  const normalized = String(value || "").trim().toLowerCase();
  return ALLOWED_ROLES.includes(normalized) ? normalized : fallback;
};

// ================= UTIL =================
const sanitizeUser = (userInstance) => {
  const user = userInstance?.toJSON ? userInstance.toJSON() : userInstance;
  if (!user) return user;
  delete user.password;
  return user;
};

const toAdminListItem = (user) => ({
  id: String(user.id),
  name: user.name || "Unknown User",
  email: user.email || "",
  role: normalizeRole(user.role, "user"),
  joinedAt: user.createdAt,
  goals: 0,
  habits: 0,
  status: user.isActive ? "active" : "inactive",
  isActive: Boolean(user.isActive),
});

// ================= CREATE ADMIN =================
export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters ❌" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const requestedRole = normalizeRole(role, "user");
    const activeFlag = status === "inactive" ? false : true;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: requestedRole,
      isActive: activeFlag,
    });

    res.status(201).json({
      message: "User created successfully ✅",
      user: toAdminListItem(sanitizeUser(newUser)),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ================= GET USERS =================
export const getAdminUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : undefined;

    const users = await User.findAll({
      where,
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit,
    });

    const total = await User.count({ where });

    res.status(200).json({
      users: users.map((u) => toAdminListItem(sanitizeUser(u))),
      page,
      limit,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status, isActive } = req.body || {};

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    if (req.admin?.id === user.id && role && normalizeRole(role, "invalid") !== "admin") {
      return res.status(400).json({ message: "You cannot change your own role ❌" });
    }

    if (req.admin?.id === user.id && (status === "inactive" || isActive === false)) {
      return res.status(400).json({ message: "You cannot deactivate your own admin account ❌" });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (role !== undefined) {
      const nextRole = normalizeRole(role, "invalid");
      if (nextRole === "invalid") {
        return res.status(400).json({ message: "Role must be user, mentor or admin ❌" });
      }
      user.role = nextRole;
    }

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ message: "Status must be active or inactive ❌" });
      }
      user.isActive = status === "active";
    } else if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully ✅",
      user: toAdminListItem(sanitizeUser(user)),
    });
  } catch {
    return res.status(500).json({ message: "Server error ❌" });
  }
};

// ================= UPDATE STATUS =================
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

// ================= DELETE USER =================
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

// ================= UPDATE ROLE =================
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const nextRole = normalizeRole(role, "invalid");

    if (nextRole === "invalid") {
      return res.status(400).json({
        message: "Role must be admin, mentor or user ❌",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    // prevent self downgrade
    if (req.admin?.id === user.id && nextRole !== "admin") {
      return res.status(400).json({
        message: "You cannot change your own role ❌",
      });
    }

    user.role = nextRole;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully ✅",
      user: toAdminListItem(sanitizeUser(user)),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const activeUsers = await User.count({
      where: { isActive: true }
    });

    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    });

    const conversionRate = totalUsers
      ? ((activeUsers / totalUsers) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      totalUsers,
      activeUsers,
      newUsers,
      conversionRate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats ❌" });
  }
};
