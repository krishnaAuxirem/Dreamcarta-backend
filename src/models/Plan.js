import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "month",
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    highlighted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    badge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default Plan;
