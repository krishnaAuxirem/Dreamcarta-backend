import User from "../models/User.js";
import UserSetting from "../models/UserSetting.js";

const toMentorResponse = (mentor, dashboardSetting = {}) => ({
  id: mentor.id,
  name: mentor.name,
  email: mentor.email,
  avatar: mentor.profilePic || "",
  isActive: mentor.isActive,
  createdAt: mentor.createdAt,
  dashboardMessage: dashboardSetting.dashboardMessage || "",
  dashboardMessageUpdatedAt: dashboardSetting.dashboardMessageUpdatedAt,
  dashboardMessageUpdatedBy: dashboardSetting.dashboardMessageUpdatedBy,
});

// GET ALL MENTORS
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.findAll({
      where: { role: "mentor" },
      attributes: ["id", "name", "email", "profilePic", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json(mentors.map((mentor) => toMentorResponse(mentor)));
  } catch {
    res.status(500).json({ message: "Error fetching mentors ❌" });
  }
};

// UPDATE MENTOR DASHBOARD MESSAGE
export const updateMentorDashboardMessage = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "Message is required ❌" });
    }

    const mentor = await User.findByPk(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found ❌" });
    }

    const [settingRecord] = await UserSetting.findOrCreate({
      where: { userId: mentor.id },
      defaults: {
        userId: mentor.id,
        settings: {},
      },
    });

    settingRecord.settings = {
      ...(settingRecord.settings || {}),
      dashboardMessage: message,
      dashboardMessageUpdatedAt: new Date().toISOString(),
      dashboardMessageUpdatedBy: req.user?.id || "admin",
    };

    await settingRecord.save();

    res.json({
      message: "Mentor dashboard updated ✅",
      mentor: toMentorResponse(mentor, settingRecord.settings),
    });
  } catch {
    res.status(500).json({ message: "Update failed ❌" });
  }
};

// GET MENTOR DASHBOARD DATA
export const getMentorDashboardData = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await User.findByPk(mentorId);
    
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found ❌" });
    }

    const settingsRecord = await UserSetting.findOne({ where: { userId: mentor.id } });
    const dashboardSettings = settingsRecord?.settings || {};

    res.json({
      ...toMentorResponse(mentor, dashboardSettings),
    });
  } catch {
    res.status(500).json({ message: "Error fetching mentor data ❌" });
  }
};
