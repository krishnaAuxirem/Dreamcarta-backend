import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const UserSetting = sequelize.define(
  "UserSetting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
  }
);

export default UserSetting;