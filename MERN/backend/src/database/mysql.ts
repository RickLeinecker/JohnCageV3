// Debug
import console_err from "../logging/console_err";
import console_log from "../logging/console_log";

// Database
import { Sequelize } from "sequelize-typescript";
import { sequelizeConfig } from "../config/db.config";
import { initModels } from "../models/init-models";

class MySQLDatabase {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize(sequelizeConfig);

    // Initialize models
    initModels(this.sequelize);

    await this.sequelize.authenticate()
      .then(() => {
        console_log("Sequelize: MySQL connection has been established.");
      })
      .catch((err) => {
        console_err("Sequelize: Unable to connect to MySQL:");
        console_err(err);
      });
  }
}

export default MySQLDatabase;