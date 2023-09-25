// Models
import { SequelizeOptions } from "sequelize-typescript";
import Recording from "../models/recording.model";
import User from "../models/user.model";
import { Tag } from "../models/tag.model"

const isServerEnvironment = process.env.NODE_ENV === 'production';

const model = [Recording, User, Tag];

const developmentSequelizeConfig: SequelizeOptions = {
  database: "JCT",
  username: "TheBeast",
  password: "WeLoveJCT",
  host: "localhost",
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
  },
  models: model
};

const serverSequelizeConfig: SequelizeOptions = {
  database: "JCT",
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
  },
  models: model
};

const sequelizeConfig = isServerEnvironment ? serverSequelizeConfig : developmentSequelizeConfig;

export { sequelizeConfig };