import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VisionBoardItem = sequelize.define(
  'VisionBoardItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'image',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'All',
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 4,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 3,
    },
  },
  {
    timestamps: true,
  }
);

export default VisionBoardItem;
