import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Habit = sequelize.define(
  'Habit',
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
      defaultValue: 'Mindfulness',
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'daily',
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completedToday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedDates: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    reminderTime: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
  }
);

export default Habit;
