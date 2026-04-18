import Content from "../models/Content.js";

// ✅ GET ALL CONTENT
export const getContent = async (req, res) => {
  try {
    const items = await Content.findAll();

    const formatted = {};

    items.forEach((item) => {
      formatted[item.key] = item.value;
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch content ❌" });
  }
};


// ✅ UPDATE CONTENT (ADMIN ONLY)
export const updateContent = async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Invalid data ❌" });
    }

    for (const key in updates) {
      const value = updates[key];

      const [item] = await Content.findOrCreate({
        where: { key },
        defaults: { value },
      });

      item.value = value;
      await item.save();
    }

    res.status(200).json({ message: "Content updated successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update content ❌" });
  }
};