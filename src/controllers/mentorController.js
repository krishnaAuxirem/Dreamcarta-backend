import { fn, col, Op } from "sequelize";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";
import MentorAdvice from "../models/MentorAdvice.js";

const buildCountMap = (rows, keyName, countName) =>
  rows.reduce((accumulator, row) => {
    accumulator[String(row[keyName])] = Number(row[countName] || 0);
    return accumulator;
  }, {});

const toMentorUser = (user, goalCountMap, habitCountMap) => {
  const goals = Number(goalCountMap[String(user.id)] || 0);
  const habits = Number(habitCountMap[String(user.id)] || 0);
  const progress = Math.min(100, Math.round(goals * 12 + habits * 8 + (user.isActive ? 10 : 0)));

  return {
    id: String(user.id),
    name: user.name || "Unknown User",
    email: user.email || "",
    role: user.role,
    isActive: Boolean(user.isActive),
    goals,
    habits,
    progress,
    joinedAt: user.createdAt,
  };
};

export const getMentorUsers = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const where = {
      role: { [Op.in]: ["user", "mentor"] },
    };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const [users, goalCounts, habitCounts] = await Promise.all([
      User.findAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: 200,
      }),
      Goal.findAll({
        attributes: ["userId", [fn("COUNT", col("id")), "goalCount"]],
        group: ["userId"],
        raw: true,
      }),
      Habit.findAll({
        attributes: ["userId", [fn("COUNT", col("id")), "habitCount"]],
        group: ["userId"],
        raw: true,
      }),
    ]);

    const goalCountMap = buildCountMap(goalCounts, "userId", "goalCount");
    const habitCountMap = buildCountMap(habitCounts, "userId", "habitCount");

    return res.status(200).json({ users: users.map((user) => toMentorUser(user, goalCountMap, habitCountMap)) });
  } catch {
    return res.status(500).json({ message: "Failed to fetch mentor users ❌" });
  }
};

export const getMentorGoals = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: "Valid userId is required ❌" });
    }

    const goals = await Goal.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ goals });
  } catch {
    return res.status(500).json({ message: "Failed to fetch mentor goals ❌" });
  }
};

export const addMentorAdvice = async (req, res) => {
  try {
    const userId = Number(req.body?.userId);
    const goalId = req.body?.goalId || null;
    const advice = String(req.body?.advice || "").trim();

    if (!userId || !advice) {
      return res.status(400).json({ message: "userId आणि advice आवश्यक आहेत ❌" });
    }

    const mentorId = Number(req.user?.id || 0) || null;

    const createdAdvice = await MentorAdvice.create({
      userId,
      mentorId,
      goalId: goalId || null,
      advice,
    });

    return res.status(201).json({ advice: createdAdvice });
  } catch {
    return res.status(500).json({ message: "Failed to save mentor advice ❌" });
  }
};

export const getMentorAnalytics = async (_req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "user" } });
    const activeUsers = await User.count({ where: { role: "user", isActive: true } });
    const mentors = await User.count({ where: { role: "mentor", isActive: true } });

    const engagement = totalUsers ? Number(((activeUsers / totalUsers) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      totalUsers,
      activeUsers,
      mentors,
      engagement,
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch mentor analytics ❌" });
  }
};


export const getAvailableMentors = async (req, res) => {
  try {
    const mentors = await User.findAll({
      where: {
        role: "mentor",
        isActive: true,
      },
      attributes: ["id", "name", "email", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const mentorList = mentors.map((mentor) => ({
      id: String(mentor.id),
      name: mentor.name || "Mentor",
      email: mentor.email || "",
      expertise: "Goals & Dreams", // Default expertise
      bio: "Experienced mentor helping you achieve your dreams",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=6133B4&color=fff`,
      followers: Math.floor(Math.random() * 50) + 10,
      rating: Math.floor(Math.random() * 2) + 4, // Rating between 4-5
    }));

    return res.status(200).json({ mentors: mentorList });
  } catch {
    return res.status(500).json({ message: "Failed to fetch available mentors ❌" });
  }
};
