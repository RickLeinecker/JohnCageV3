import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes/routes";
import MySQLDatabase from "./database/mysql";
import console_log from "../../functions/logging/console_log";
import { getNextTimeslot, minutesToMilliseconds } from "../../functions/date.functions";
import { removeDirectoryFiles } from "../../functions/file.functions";
import { TEMP_FOLDER } from "../config/express.config";
import { saveConcert } from "./functions/saveConcert.functions";

class expressServer {
  public expressApp: Application = express();

  constructor() {
    this.config(this.expressApp);
    this.syncDatabase();
    new Routes(this.expressApp);
    this.expressApp.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
      );
      next();
    });
    this.cleanupTimerStart(minutesToMilliseconds(20));
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*" // Fix using env variable.
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new MySQLDatabase();
    if (db.sequelize != undefined) {
      db.sequelize.sync();
    }
  }

  private cleanupTimerStart(msPerInterval: number): void {
    // Handle concert data in DB before deleting the data.
    saveConcert();

    // Remove group info and passcodes from temporary file folder.
    removeDirectoryFiles(TEMP_FOLDER);
    removeDirectoryFiles(TEMP_FOLDER + "passcodes/");

    // Difficult to comprehensively test at intended interval 20 minutes each. 
    // Look at this function if there are temp file problems.
    // Finding a new offset each interval and using recursion ensures a degree of accuracy over time. 
    const msUntilNextCall = getNextTimeslot(msPerInterval);
    setTimeout(() => { console_log("Cleaning files from old group."); this.cleanupTimerStart(msPerInterval); }, msUntilNextCall);
  }
}

export default expressServer;