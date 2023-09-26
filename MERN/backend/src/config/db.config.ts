// Models
import { SequelizeOptions } from "sequelize-typescript";
import Recording from "../models/recording.model";
import User from "../models/user.model";
import { Tag } from "../models/tag.model"
import { initModels } from "../models/init-models";

const isServerEnvironment = process.env.NODE_ENV === 'production';

//const models = [Recording, User, Tag];

const developmentSequelizeConfig: SequelizeOptions = {
  database: "JCT",
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
  },
  //models: models
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
  //models: models
};

const sequelizeConfig = isServerEnvironment ? serverSequelizeConfig : developmentSequelizeConfig;

export { sequelizeConfig };
