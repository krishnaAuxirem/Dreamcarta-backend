import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Dream = sequelize.define(
  'Dream',
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'personal',
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    milestones: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
  }
);

export default Dream;
