// Models
import { SequelizeOptions } from "sequelize-typescript";
//import { initModels } from "../models/init-models";

const isServerEnvironment = process.env.NODE_ENV === 'production';

//const models = [Recording, User, Tag];

const developmentSequelizeConfig: SequelizeOptions = {
  database: "jct3",
  username: "TheBeast",
  password: "WeLoveJCT",
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    //socketPath: "/var/run/mysqld/mysqld.sock" // May vary by environment
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
