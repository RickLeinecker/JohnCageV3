// Models
import { SequelizeOptions } from "sequelize-typescript";
import Recording from "../models/recording.model";
import User from "../models/user.model";

// Don't delete unless "config" works. Haven't tested yet.
const config_backup = {
  HOST: "",
  USER: "",
  PASSWORD: "",
  DB: "",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Haven't tested this yet. Backup above.
const sequelizeConfig: SequelizeOptions = {
  database: "",
  username: "",
  password: "",
  host: "",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  models: [Recording, User]
};

export { sequelizeConfig };