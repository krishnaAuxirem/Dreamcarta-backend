import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const CommunityPost = sequelize.define(
  "CommunityPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isHighlighted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isModerated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

export default CommunityPost;
