import Goal from '../models/Goal.js';

const today = () => new Date().toISOString().split('T')[0];
const resolveUserId = (req) => Number(req?.user?.id || 0);

export const getGoals = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const goals = await Goal.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ goals });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch goals ❌' });
  }
};

export const getGoalById = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const goal = await Goal.findOne({ where: { id: req.params.id, userId } });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found ❌' });
    }

    return res.status(200).json({ goal });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch goal ❌' });
  }
};

export const createGoal = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { title, description = '', category = 'personal', type = 'short-term', deadline = today(), progress = 0, steps = [] } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: 'Goal title is required ❌' });
    }

    const progressValue = Number(progress) || 0;
    const goal = await Goal.create({
      userId,
      title,
      description,
      category,
      type,
      deadline,
      progress: progressValue,
      steps: Array.isArray(steps) ? steps : [],
      status: progressValue >= 100 ? 'completed' : 'active',
    });

    return res.status(201).json({ goal });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create goal ❌' });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const goal = await Goal.findOne({ where: { id: req.params.id, userId } });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found ❌' });
    }

    const payload = { ...req.body };
    if (payload.progress !== undefined) {
      const progress = Number(payload.progress) || 0;
      payload.progress = progress;
      payload.status = progress >= 100 ? 'completed' : payload.status || goal.status || 'active';
    }

    if (payload.steps && !Array.isArray(payload.steps)) {
      payload.steps = [];
    }

    await goal.update(payload);
    return res.status(200).json({ goal });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update goal ❌' });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const deletedCount = await Goal.destroy({ where: { id: req.params.id, userId } });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Goal not found ❌' });
    }

    return res.status(200).json({ message: 'Goal deleted ✅' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete goal ❌' });
  }
};
