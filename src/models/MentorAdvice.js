import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MentorAdvice = sequelize.define(
  'MentorAdvice',
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
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      index: true,
    },
    goalId: {
      type: DataTypes.UUID,
      allowNull: true,
      index: true,
    },
    advice: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default MentorAdvice;