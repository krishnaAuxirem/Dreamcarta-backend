import User from "../models/User.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    const adminExists = await User.findOne({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin created from ENV ✅");
    } else {
      console.log("Admin already exists ✅");
    }
  } catch (error) {
    console.log(error);
  }
};

export default createAdmin;