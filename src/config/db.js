import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const isConnectionString = (value) => typeof value === "string" && /^mysqls?:\/\//i.test(value);

const rawDbUrl =
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  process.env.MYSQLHOST;

const parsedDbUrl = isConnectionString(rawDbUrl) ? new URL(rawDbUrl) : null;

const dbName = process.env.MYSQLDATABASE || parsedDbUrl?.pathname?.replace(/^\//, "");
const dbUser = process.env.MYSQLUSER || parsedDbUrl?.username;
const dbPassword = process.env.MYSQLPASSWORD || parsedDbUrl?.password;
const dbHost = process.env.MYSQLHOST || parsedDbUrl?.hostname;
const dbPort = Number(process.env.MYSQLPORT || parsedDbUrl?.port || 3306);

const useSsl =
  process.env.MYSQLSSL === "true" || process.env.DB_SSL === "true" ||
  String(dbHost || "").includes("rlwy.net") || parsedDbUrl?.protocol === "mysqls:";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: useSsl
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {},
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database connected successfully ✅");
  } catch (error) {
    console.error("Unable to connect to MySQL DB ❌", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };