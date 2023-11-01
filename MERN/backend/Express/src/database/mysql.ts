// Debug
import console_log from "../../../functions/logging/console_log";

// Database
import { Sequelize } from "sequelize-typescript";
import { sequelizeConfig } from "../../config/db.config";
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
        console_log("Sequelize: Unable to connect to MySQL:");
        console_log(err);
      });
  }
}

export default MySQLDatabase;