import Plan from "../models/Plan.js";

const mapPlan = (plan) => ({
  id: plan.id,
  name: plan.name,
  price: Number(plan.price || 0),
  period: plan.period || "month",
  description: plan.description || "",
  features: Array.isArray(plan.features) ? plan.features : [],
  highlighted: Boolean(plan.highlighted),
  badge: plan.badge || undefined,
  isEnabled: Boolean(plan.isEnabled),
  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
});

export const getPublicPlans = async (_req, res) => {
  try {
    const plans = await Plan.findAll({
      where: { isEnabled: true },
      order: [["price", "ASC"]],
    });

    return res.status(200).json({ plans: plans.map(mapPlan) });
  } catch {
    return res.status(500).json({ message: "Failed to fetch plans ❌" });
  }
};

export const getAdminPlans = async (_req, res) => {
  try {
    const plans = await Plan.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ plans: plans.map(mapPlan) });
  } catch {
    return res.status(500).json({ message: "Failed to fetch plans ❌" });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { name, price, period, description, features, highlighted, badge, isEnabled } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: "Plan name required ❌" });
    }

    const plan = await Plan.create({
      name: String(name).trim(),
      price: Number(price || 0),
      period: String(period || "month"),
      description: String(description || ""),
      features: Array.isArray(features) ? features : [],
      highlighted: Boolean(highlighted),
      badge: badge ? String(badge) : null,
      isEnabled: isEnabled === false ? false : true,
    });

    return res.status(201).json({ message: "Plan created ✅", plan: mapPlan(plan) });
  } catch {
    return res.status(500).json({ message: "Failed to create plan ❌" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found ❌" });
    }

    const updates = req.body || {};
    if (updates.name !== undefined) {
      plan.name = String(updates.name).trim();
    }
    if (updates.price !== undefined) {
      plan.price = Number(updates.price || 0);
    }
    if (updates.period !== undefined) {
      plan.period = String(updates.period || "month");
    }
    if (updates.description !== undefined) {
      plan.description = String(updates.description || "");
    }
    if (updates.features !== undefined) {
      plan.features = Array.isArray(updates.features) ? updates.features : [];
    }
    if (updates.highlighted !== undefined) {
      plan.highlighted = Boolean(updates.highlighted);
    }
    if (updates.badge !== undefined) {
      plan.badge = updates.badge ? String(updates.badge) : null;
    }
    if (updates.isEnabled !== undefined) {
      plan.isEnabled = Boolean(updates.isEnabled);
    }

    await plan.save();

    return res.status(200).json({ message: "Plan updated ✅", plan: mapPlan(plan) });
  } catch {
    return res.status(500).json({ message: "Failed to update plan ❌" });
  }
};
