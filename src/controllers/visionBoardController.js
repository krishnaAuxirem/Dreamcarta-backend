import VisionBoardItem from '../models/VisionBoardItem.js';

const resolveUserId = (req) => Number(req?.user?.id || 0);

export const getVisionItems = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const items = await VisionBoardItem.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch vision items ❌' });
  }
};

export const createVisionItem = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const {
      type = 'image',
      content = '',
      category = 'All',
      x = 0,
      y = 0,
      width = 4,
      height = 3,
    } = req.body || {};

    if (!content) {
      return res.status(400).json({ message: 'Vision item content is required ❌' });
    }

    const item = await VisionBoardItem.create({
      userId,
      type,
      content,
      category,
      x,
      y,
      width,
      height,
    });

    return res.status(201).json({ item });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create vision item ❌' });
  }
};

export const updateVisionItem = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const item = await VisionBoardItem.findOne({ where: { id: req.params.id, userId } });

    if (!item) {
      return res.status(404).json({ message: 'Vision item not found ❌' });
    }

    await item.update(req.body || {});
    return res.status(200).json({ item });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update vision item ❌' });
  }
};

export const deleteVisionItem = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const deletedCount = await VisionBoardItem.destroy({ where: { id: req.params.id, userId } });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Vision item not found ❌' });
    }

    return res.status(200).json({ message: 'Vision item deleted ✅' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete vision item ❌' });
  }
};
