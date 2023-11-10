// Models
import { SequelizeOptions } from "sequelize-typescript";
import { isServerEnvironment } from "./env.config";

const developmentSequelizeConfig: SequelizeOptions = {
  database: "jct3",
  username: "username",
  password: "!2#4%qwert",
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
     socketPath: "/var/run/mysqld/mysqld.sock" // May vary by environment
  },
  define: {
    timestamps: false
  }
};

const serverSequelizeConfig: SequelizeOptions = {
  database: "jct3",
  username: "TheBeast",
  password: "WeLoveJCT",
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
