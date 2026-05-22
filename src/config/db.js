import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const DATABASE_URL =
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL;

if (!DATABASE_URL) {
  console.error("❌ Database URL not found in environment variables");
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL Database", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };