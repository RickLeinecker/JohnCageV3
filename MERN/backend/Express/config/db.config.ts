// Models
import { SequelizeOptions } from "sequelize-typescript";
import { isServerEnvironment } from "./env.config";

const developmentSequelizeConfig: SequelizeOptions = {
  database: "jct3",
  username: "root",
  password: "password1!",
  host: "localhost",
  dialect: "mysql",
  //port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // socketPath: "/var/run/mysqld/mysqld.sock" // May vary by environment
  },
  define: {
    timestamps: false
  }
};

const serverSequelizeConfig: SequelizeOptions = {
  database: process.env.MYSQL_SCHEMA,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    socketPath: "/var/run/mysqld/mysqld.sock"
  },
  define: {
    timestamps: false
  }
};

const sequelizeConfig = isServerEnvironment ? serverSequelizeConfig : developmentSequelizeConfig;

export { sequelizeConfig };
