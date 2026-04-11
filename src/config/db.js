import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE;
const dbUser = process.env.DB_USER || process.env.MYSQLUSER;
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST;
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);



const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.error("Unable to connect to DB ❌", error);
  }
};

export { sequelize, connectDB };