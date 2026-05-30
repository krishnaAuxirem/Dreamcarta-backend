import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * DreamPlan — persists AI-generated dream plans for a user.
 * Each plan is tied to a user and stores the full Groq-generated
 * structure: goal, habits, milestones, weeklyPlan, motivation.
 */
const DreamPlan = sequelize.define(
  'DreamPlan',
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
    dreamTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dreamDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    targetYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    priority: {
      type: DataTypes.ENUM('High', 'Medium', 'Low'),
      allowNull: false,
      defaultValue: 'Medium',
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    habits: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    milestones: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    weeklyPlan: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    motivation: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('Active', 'Paused', 'Completed'),
      allowNull: false,
      defaultValue: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export default DreamPlan;
