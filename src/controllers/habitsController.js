import Habit from '../models/Habit.js';

const today = () => new Date().toISOString().split('T')[0];
const resolveUserId = (req) => Number(req?.user?.id || 0);

export const getHabits = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const habits = await Habit.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ habits });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch habits ❌' });
  }
};

export const createHabit = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const {
      title,
      description = '',
      category = 'Mindfulness',
      frequency = 'daily',
      reminderTime = '',
      color = '',
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: 'Habit title is required ❌' });
    }

    const habit = await Habit.create({
      userId,
      title,
      description,
      category,
      frequency,
      streak: 0,
      completedToday: false,
      completedDates: [],
      reminderTime,
      color,
    });

    return res.status(201).json({ habit });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create habit ❌' });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const habit = await Habit.findOne({ where: { id: req.params.id, userId } });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found ❌' });
    }

    await habit.update(req.body || {});
    return res.status(200).json({ habit });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update habit ❌' });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const deletedCount = await Habit.destroy({ where: { id: req.params.id, userId } });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Habit not found ❌' });
    }

    return res.status(200).json({ message: 'Habit deleted ✅' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete habit ❌' });
  }
};

export const checkInHabit = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const habit = await Habit.findOne({ where: { id: req.params.id, userId } });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found ❌' });
    }

    const day = today();
    const completedDates = Array.isArray(habit.completedDates) ? [...habit.completedDates] : [];

    if (habit.completedToday) {
      habit.completedToday = false;
      habit.completedDates = completedDates.filter((date) => date !== day);
      habit.streak = Math.max(0, Number(habit.streak) - 1);
    } else {
      habit.completedToday = true;
      if (!completedDates.includes(day)) {
        habit.completedDates = [...completedDates, day];
      }
      habit.streak = Number(habit.streak) + 1;
    }

    await habit.save();
    return res.status(200).json({ habit });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update habit check-in ❌' });
  }
};
