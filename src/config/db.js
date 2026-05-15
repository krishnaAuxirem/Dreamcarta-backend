import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const isConnectionString = (value) => typeof value === "string" && /^mysqls?:\/\//i.test(value);

const rawDbUrl =
  process.env.DB_URL ||
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.DB_HOST ||
  process.env.MYSQLHOST;

const parsedDbUrl = isConnectionString(rawDbUrl) ? new URL(rawDbUrl) : null;

const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || parsedDbUrl?.pathname?.replace(/^\//, "");
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || parsedDbUrl?.username;
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || parsedDbUrl?.password;
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || parsedDbUrl?.hostname;
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT || parsedDbUrl?.port || 3306);
const sqliteStorage = process.env.DB_STORAGE || "./dreamcarta-dev.sqlite";

const useSqliteFallback = process.env.DB_FALLBACK_TO_SQLITE !== "false";

const useSsl = Boolean(
  process.env.DB_SSL === "true" ||
  process.env.MYSQLSSL === "true" ||
  String(dbHost || "").includes("rlwy.net") ||
  Boolean(parsedDbUrl)
);

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

const createSqliteSequelize = () =>
  new Sequelize({
    dialect: "sqlite",
    storage: sqliteStorage,
    logging: false,
  });

let sequelize = process.env.DB_DIALECT === "sqlite" ? createSqliteSequelize() : createMysqlSequelize();

try {
  await sequelize.authenticate();
  console.log(`Database connected successfully (${process.env.DB_DIALECT || "mysql"}) ✅`);
} catch (error) {
  console.error("Unable to connect to MySQL DB ❌", error);

  if (useSqliteFallback && process.env.DB_DIALECT !== "sqlite") {
    console.log("Falling back to local SQLite database ✅");
    sequelize = createSqliteSequelize();
    await sequelize.authenticate();
    console.log("SQLite fallback connected successfully ✅");
  } else {
    throw error;
  }
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.error("Unable to connect to DB ❌", error);
  }
};

export { sequelize, connectDB };