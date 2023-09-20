// Models
import { SequelizeOptions } from "sequelize-typescript";
import Recording from "../models/recording.model";
import User from "../models/user.model";

// Haven't tested this yet. Backup above.
const sequelizeConfig: SequelizeOptions = {
  database: "JCT",
  username: "username",
  password: "!2#4%qwert",
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    socketPath: "/var/run/mysqld/mysqld.sock" // May need to change on server.
  },
  models: [Recording, User]
};

export { sequelizeConfig };