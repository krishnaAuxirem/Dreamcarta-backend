import Activity from "../models/Activity.js";
import Mention from "../models/Mention.js";
import User from "../models/User.js";
import { Op } from "sequelize";

// CREATE ACTIVITY
export const createActivity = async (userId, type, description, metadata = {}) => {
  try {
    const activity = await Activity.create({
      userId,
      type,
      description,
      metadata,
    });
    return activity;
  } catch (error) {
    console.error("Activity creation error:", error);
  }
};

// GET USER ACTIVITY
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.findAll({
      where: { userId },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(activities);
  } catch {
    res.status(500).json({ message: "Error fetching activities ❌" });
  }
};

// GET ALL ACTIVITY (SUPERADMIN)
export const getAllActivity = async (req, res) => {
  try {
    const { limit = 100, type } = req.query;
    const whereClause = type ? { type } : {};

    const activities = await Activity.findAll({
      where: whereClause,
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
    });
    res.json(activities);
  } catch {
    res.status(500).json({ message: "Error fetching activities ❌" });
  }
};

// CREATE MENTION
export const createMention = async (fromUserId, toUserId, content, context = "dashboard") => {
  try {
    const mention = await Mention.create({
      fromUserId,
      toUserId,
      content,
      context,
    });
    return mention;
  } catch (error) {
    console.error("Mention creation error:", error);
  }
};

// GET USER MENTIONS
export const getUserMentions = async (req, res) => {
  try {
    const userId = req.user.id;
    const mentions = await Mention.findAll({
      where: { toUserId: userId },
      include: [
        { model: User, as: "mentionedBy", attributes: ["id", "name", "email", "profilePic"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(mentions);
  } catch {
    res.status(500).json({ message: "Error fetching mentions ❌" });
  }
};

// MARK MENTION AS READ
export const markMentionAsRead = async (req, res) => {
  try {
    const { mentionId } = req.params;
    const mention = await Mention.findByPk(mentionId);
    if (!mention) return res.status(404).json({ message: "Mention not found" });

    await mention.update({ isRead: true });
    res.json({ message: "Marked as read ✅" });
  } catch {
    res.status(500).json({ message: "Error updating mention ❌" });
  }
};
