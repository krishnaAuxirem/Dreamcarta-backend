import Dream from '../models/Dream.js';

const resolveUserId = (req) => Number(req?.user?.id || 0);

export const getDreams = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const dreams = await Dream.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ dreams });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dreams ❌' });
  }
};

export const toggleDreamMilestone = async (req, res) => {
  try {
    const { dreamId, milestoneId } = req.params;
    const userId = resolveUserId(req);

    const dream = await Dream.findOne({ where: { id: dreamId, userId } });
    if (!dream) {
      return res.status(404).json({ message: 'Dream not found ❌' });
    }

    const milestones = Array.isArray(dream.milestones) ? [...dream.milestones] : [];
    const milestoneIndex = milestones.findIndex((milestone) => String(milestone?.id) === milestoneId);

    if (milestoneIndex < 0) {
      return res.status(404).json({ message: 'Milestone not found ❌' });
    }

    const currentMilestone = milestones[milestoneIndex];
    const completed = !currentMilestone.completed;

    milestones[milestoneIndex] = {
      ...currentMilestone,
      completed,
      completedAt: completed ? new Date().toISOString().split('T')[0] : undefined,
    };

    const completedCount = milestones.filter((milestone) => milestone.completed).length;
    const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;

    await dream.update({ milestones, progress });
    return res.status(200).json({ dream });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update milestone ❌' });
  }
};
