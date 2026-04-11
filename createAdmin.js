import bcrypt from "bcrypt";
import User from "./src/models/User.js";
import { sequelize } from "./src/config/db.js";

const createAdmin = async () => {
  try {
    await sequelize.authenticate(); // optional but clean

    const existingAdmin = await User.findOne({
      where: { email: "admin@dreamcarta.in" }
    });

    if (existingAdmin) {
      console.log("⚡ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@dreamcarta.in",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin created successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();