import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Mention = sequelize.define(
  "Mention",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    context: {
      type: DataTypes.ENUM("dashboard", "post", "comment", "goal", "mentor_update"),
      defaultValue: "dashboard",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

Mention.belongsTo(User, { foreignKey: "fromUserId", as: "mentionedBy" });
Mention.belongsTo(User, { foreignKey: "toUserId", as: "mentionedTo" });

export default Mention;
