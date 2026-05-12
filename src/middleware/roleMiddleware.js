export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    const userRole = String(req.user.role || "").toLowerCase();
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Insufficient role permissions ❌" });
    }

    return next();
  };
};

export default checkRole;
