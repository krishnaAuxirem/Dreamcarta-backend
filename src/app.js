import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { DataTypes } from 'sequelize';
import { sequelize, connectDB } from "./config/db.js";
import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import goalsRoutes from "./routes/goalsRoutes.js";
import habitsRoutes from "./routes/habitsRoutes.js";
import visionBoardRoutes from "./routes/visionBoardRoutes.js";
import dreamsRoutes from "./routes/dreamsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import './models/Goal.js';
import './models/Habit.js';
import './models/VisionBoardItem.js';
import './models/Dream.js';

import createAdmin from "./utils/createAdmin.js";

const app = express();


// 🔧 Ensure columns
const ensureUserAuthColumns = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("Users");

  if (!tableDefinition.role) {
    await queryInterface.addColumn("Users", "role", {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: "user",
    });
    console.log("Added Users.role ✅");
  }

  if (!tableDefinition.isActive) {
    await queryInterface.addColumn("Users", "isActive", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    console.log("Added Users.isActive ✅");
  }
};


// ================== 🔥 MIDDLEWARE ==================

// ✅ CORS FIX (FINAL)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dreamcarta.co.in',
    'https://www.dreamcarta.co.in'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// 🔥 IMPORTANT — handle preflight


// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================== 🔥 ROUTES ==================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/vision-board", visionBoardRoutes);
app.use("/api/dreams", dreamsRoutes);
app.use("/api/admin", adminRoutes);


// ================== 🔥 ERROR HANDLER ==================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON body ❌" });
  }
  next(err);
});


// ================== 🔥 DB INIT ==================

await connectDB();
await sequelize.sync();
await ensureUserAuthColumns();

console.log("Tables synced ✅");

// Create admin if not exists
await createAdmin();


// ================== 🔥 TEST ROUTE ==================

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});


// ================== 🔥 START SERVER ==================

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});