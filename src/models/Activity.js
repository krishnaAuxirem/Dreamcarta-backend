import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "goal_created",
        "goal_updated",
        "goal_completed",
        "habit_created",
        "habit_updated",
        "vision_board_updated",
        "post_created",
        "post_liked",
        "comment_added",
        "dream_created",
        "mentor_update",
        "admin_update",
        "image_uploaded",
        "image_deleted"
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
  }
);

Activity.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Activity;
