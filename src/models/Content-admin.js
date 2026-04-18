import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Content = sequelize.define("Content", {
  key: {
    type: DataTypes.STRING,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT,
  },
});

export default Content;
