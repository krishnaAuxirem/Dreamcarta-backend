import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const user = await User.findByPk(req.user.id);
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
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error ❌" });
  }
};

export default adminMiddleware;
