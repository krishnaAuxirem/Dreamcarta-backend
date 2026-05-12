import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";

export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    const planId = String(req.body?.planId || "").trim();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized ❌" });
    }

    if (!planId) {
      return res.status(400).json({ message: "planId is required ❌" });
    }

    const plan = await Plan.findByPk(planId);
    if (!plan || !plan.isEnabled) {
      return res.status(404).json({ message: "Plan not available ❌" });
    }

    const existing = await Subscription.findOne({
      where: {
        userId,
        status: "active",
      },
      order: [["createdAt", "DESC"]],
    });

    if (existing && existing.planId === planId) {
      return res.status(200).json({
        message: "Already subscribed to this plan ✅",
        subscription: existing,
      });
    }

    if (existing) {
      existing.status = "cancelled";
      await existing.save();
    }

    const subscription = await Subscription.create({
      userId,
      planId,
      status: "active",
      startedAt: new Date(),
    });

    return res.status(201).json({
      message: "Subscription activated ✅",
      subscription,
    });
  } catch {
    return res.status(500).json({ message: "Failed to subscribe ❌" });
  }
};
