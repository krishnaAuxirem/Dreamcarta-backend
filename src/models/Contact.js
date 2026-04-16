import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Contact = sequelize.define(
  'Contact',
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: true,
  }
);

export default Contact;
