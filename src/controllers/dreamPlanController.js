import DreamPlan from '../models/DreamPlan.js';

const resolveUserId = (req) => Number(req?.user?.id || 0);

const asString = (value, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback;

const asStringArray = (value) =>
  Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];

const normalizePriority = (value) => {
  const raw = asString(value, 'Medium');
  if (raw === 'High' || raw === 'Low') return raw;
  return 'Medium';
};

const normalizeStatus = (value) => {
  const raw = asString(value, 'Active');
  if (raw === 'Paused' || raw === 'Completed') return raw;
  return 'Active';
};

/**
 * GET /api/dream-plans
 * Returns all dream plans for the authenticated user, newest first.
 */
export const getDreamPlans = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const plans = await DreamPlan.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ dreamPlans: plans });
  } catch (error) {
    console.error('getDreamPlans error:', error);
    return res.status(500).json({ message: 'Failed to fetch dream plans' });
  }
};

/**
 * POST /api/dream-plans
 * Saves a new AI-generated dream plan.
 * When a new Active plan is saved, all previous Active plans are set to Paused.
 */
export const createDreamPlan = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const body = req.body || {};

    const dreamTitle = asString(body.dreamTitle);
    if (!dreamTitle) {
      return res.status(400).json({ message: 'dreamTitle is required' });
    }

    const goal = asString(body.goal);
    if (!goal) {
      return res.status(400).json({ message: 'goal is required' });
    }

    const habits = asStringArray(body.habits);
    const milestones = asStringArray(body.milestones);
    const weeklyPlan = asStringArray(body.weeklyPlan);

    if (habits.length < 1 || milestones.length < 1 || weeklyPlan.length < 1) {
      return res.status(400).json({ message: 'habits, milestones, and weeklyPlan must be non-empty arrays' });
    }

    // Pause all existing Active plans for this user
    await DreamPlan.update(
      { status: 'Paused' },
      { where: { userId, status: 'Active' } }
    );

    const plan = await DreamPlan.create({
      userId,
      dreamTitle,
      dreamDescription: asString(body.dreamDescription),
      targetYear: asString(body.targetYear),
      priority: normalizePriority(body.priority),
      goal,
      habits,
      milestones,
      weeklyPlan,
      motivation: asString(body.motivation),
      status: 'Active',
    });

    return res.status(201).json({ dreamPlan: plan });
  } catch (error) {
    console.error('createDreamPlan error:', error);
    return res.status(500).json({ message: 'Failed to save dream plan' });
  }
};

/**
 * PATCH /api/dream-plans/:id/status
 * Updates the status of a dream plan (Active, Paused, Completed).
 */
export const updateDreamPlanStatus = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { id } = req.params;
    const status = normalizeStatus(req.body?.status);

    const plan = await DreamPlan.findOne({ where: { id, userId } });
    if (!plan) {
      return res.status(404).json({ message: 'Dream plan not found' });
    }

    await plan.update({ status });
    return res.status(200).json({ dreamPlan: plan });
  } catch (error) {
    console.error('updateDreamPlanStatus error:', error);
    return res.status(500).json({ message: 'Failed to update dream plan status' });
  }
};

/**
 * DELETE /api/dream-plans/:id
 * Deletes a dream plan.
 */
export const deleteDreamPlan = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { id } = req.params;

    const deletedCount = await DreamPlan.destroy({ where: { id, userId } });
    if (!deletedCount) {
      return res.status(404).json({ message: 'Dream plan not found' });
    }

    return res.status(200).json({ message: 'Dream plan deleted' });
  } catch (error) {
    console.error('deleteDreamPlan error:', error);
    return res.status(500).json({ message: 'Failed to delete dream plan' });
  }
};
