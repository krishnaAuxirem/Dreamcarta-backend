import User from "../models/User.js";

const sanitizeUser = (userInstance) => {
  const user = userInstance?.toJSON ? userInstance.toJSON() : userInstance;
  if (!user) {
    return user;
  }
  delete user.password;
  return user;
};

// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      message: "User profile fetched ✅",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, email, profilePic } = req.body || {};
    if (!name && !email && !profilePic) {
      return res.status(400).json({
        message: "At least one field is required: name, email, or profilePic ❌",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully ✅",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ✅ DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully ✅",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};