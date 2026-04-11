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
import createAdmin from "./utils/createAdmin.js";
import './models/Dream.js';

const app = express();


const ensureUserAuthColumns = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("Users");

  if (!tableDefinition.role) {
    await queryInterface.addColumn("Users", "role", {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: "user",
    });
    console.log("Added missing Users.role column ✅");
  }

  if (!tableDefinition.isActive) {
    await queryInterface.addColumn("Users", "isActive", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    console.log("Added missing Users.isActive column ✅");
  }
};

// const bootstrapAdminFromEnv = async () => {
//   const adminEmail = process.env.ADMIN_EMAIL;
//   if (!adminEmail) {
//     return;
//   }

//   const user = await User.findOne({ where: { email: adminEmail } });
//   if (!user) {
//     console.log(`ADMIN_EMAIL user not found: ${adminEmail}`);
//     return;
//   }

//   if (user.role !== 'admin') {
//     user.role = 'admin';
//     user.isActive = true;
//     await user.save();
//     console.log(`Promoted admin user: ${adminEmail}`);
//   }
// };

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081,http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedHostnames = new Set(['localhost', '127.0.0.1', '::1']);

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  const normalizedOrigin = String(origin).toLowerCase();
  if (
    normalizedOrigin.startsWith('http://localhost:') ||
    normalizedOrigin.startsWith('https://localhost:') ||
    normalizedOrigin.startsWith('http://127.0.0.1:') ||
    normalizedOrigin.startsWith('https://127.0.0.1:') ||
    normalizedOrigin === 'http://localhost' ||
    normalizedOrigin === 'https://localhost' ||
    normalizedOrigin === 'http://127.0.0.1' ||
    normalizedOrigin === 'https://127.0.0.1'
  ) {
    return true;
  }

  try {
    const parsed = new URL(origin);
    return allowedHostnames.has(parsed.hostname);
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/vision-board", visionBoardRoutes);
app.use("/api/dreams", dreamsRoutes);
app.use("/api/admin", adminRoutes);

// Return JSON when request body has invalid JSON syntax.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON body ❌" });
  }
  return next(err);
});

// DB connect
await connectDB();
await sequelize.sync();
await ensureUserAuthColumns();
// await bootstrapAdminFromEnv();
console.log("Tables synced ✅");


await createAdmin(); 

// test route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
