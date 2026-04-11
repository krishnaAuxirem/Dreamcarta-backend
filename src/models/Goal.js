import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Goal = sequelize.define(
  'Goal',
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'personal',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'short-term',
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    steps: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default Goal;
