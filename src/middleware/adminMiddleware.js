import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const sessionUserId = req.user?.id || req.admin?.id;
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const user = await User.findByPk(sessionUserId);
    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is inactive ❌" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required ❌" });
    }

    req.admin = user;
    req.user = {
      ...(req.user || {}),
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error ❌" });
  }
};

export default adminMiddleware;
