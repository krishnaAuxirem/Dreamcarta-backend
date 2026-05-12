import Review from "../models/Review.js";

// CREATE
export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch {
    res.status(500).json({ message: "Create failed ❌" });
  }
};

// GET ALL
export const getReviews = async (req, res) => {
  const reviews = await Review.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(reviews);
};

// UPDATE
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found ❌" });
    }

    await review.update(req.body);

    res.json({ message: "Review updated ✅", review });
  } catch {
    res.status(500).json({ message: "Update failed ❌" });
  }
};

// DELETE
export const deleteReview = async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) return res.status(404).json({ message: "Not found" });

  await review.destroy();
  res.json({ message: "Deleted ✅" });
};
