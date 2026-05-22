import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const isConnectionString = (value) => typeof value === "string" && /^mysqls?:\/\//i.test(value);
const resolveTemplateValue = (value) =>
  typeof value === "string"
    ? value.replace(/\$\{\{([^}]+)\}\}/g, (_, key) => process.env[key.trim()] || "")
    : value;

const rawDbUrl = resolveTemplateValue(
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQLHOST
);

const parsedDbUrl = isConnectionString(rawDbUrl) ? new URL(rawDbUrl) : null;

const dbName = parsedDbUrl?.pathname?.replace(/^\//, "") || process.env.MYSQLDATABASE;
const dbUser = parsedDbUrl?.username || process.env.MYSQLUSER;
const dbPassword = parsedDbUrl?.password || process.env.MYSQLPASSWORD;
const dbHost = parsedDbUrl?.hostname || process.env.MYSQLHOST;
const dbPort = Number(parsedDbUrl?.port || process.env.MYSQLPORT || 3306);
const dbDialect = String(process.env.DB_DIALECT || "mysql").toLowerCase();
const sqliteStorage = process.env.DB_STORAGE || "./dreamcarta-dev.sqlite";
const allowSqliteFallback = process.env.DB_FALLBACK_TO_SQLITE !== "false";

const useSsl =
  process.env.MYSQLSSL === "true" || process.env.DB_SSL === "true" ||
  String(dbHost || "").includes("rlwy.net") || parsedDbUrl?.protocol === "mysqls:";

const createMysqlSequelize = () =>
  new Sequelize(dbName, dbUser, dbPassword, {
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

// const createSqliteSequelize = () =>
//   new Sequelize({
//     dialect: "sqlite",
//     storage: sqliteStorage,
//     logging: false,
//   });

let sequelize = dbDialect === "sqlite" ? createSqliteSequelize() : createMysqlSequelize();

if (dbDialect !== "sqlite") {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database connected successfully ✅");
  } catch (error) {
    console.error("Unable to connect to MySQL DB ❌", error);

    if (allowSqliteFallback) {
      sequelize = createSqliteSequelize();
      await sequelize.authenticate();
      console.log("SQLite fallback connected successfully ✅");
    } else {
      throw error;
    }
  }
} else {
  await sequelize.authenticate();
  console.log("SQLite Database connected successfully ✅");
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.error("Unable to connect to DB ❌", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };