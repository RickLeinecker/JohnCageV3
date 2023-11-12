import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes/routes";
import MySQLDatabase from "./database/mysql";
import console_log from "../../functions/logging/console_log";
import { getNextTimeslot, minutesToMilliseconds } from "../../functions/date.functions";
import { removeDirectoryFiles } from "../../functions/file.functions";
import { TEMP_FOLDER } from "../config/express.config";
import { saveConcert } from "./functions/saveConcert.functions";
import { sendEmail } from "./functions/sendEmail";
const fs = require("fs");

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

    // Try to save and cleanup concert every minute.
    this.saveTimerStart(minutesToMilliseconds(1));

    // Save and clenaup concert every 20 minutes.
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

  private saveTimerStart(msPerInterval: number): void {
    const now = new Date();
    console_log("Saving at " + now.toString());

    if (fs.existsSync("../temp/finished")) {
      fs.unlink("../temp/finished");
      this.cleanup();
    }

    setTimeout(() => { console_log("Save timer event fired."); this.saveTimerStart(msPerInterval); }, msPerInterval);
  }

  private cleanup() {
    const now = new Date();
    console_log("Cleaning up at " + now.toString());

    // Handle concert data in DB before deleting the data.
    saveConcert();

    // Remove concert group info and passcodes from temporary file folder.
    removeDirectoryFiles(TEMP_FOLDER);
    removeDirectoryFiles(TEMP_FOLDER + "passcodes/maestro/");
    removeDirectoryFiles(TEMP_FOLDER + "passcodes/performers/");
    removeDirectoryFiles(TEMP_FOLDER + "passcodes/listener/");
  }

  private cleanupTimerStart(msPerInterval: number): void {
    this.cleanup()
    // Difficult to comprehensively test at intended interval 20 minutes each. 
    // Look at this function if there are temp file problems.
    // Finding a new offset each interval and using recursion ensures a degree of accuracy over time. 
    const msUntilNextCall = getNextTimeslot(msPerInterval);
    setTimeout(() => { console_log("Cleaning files from old group."); this.cleanupTimerStart(msPerInterval); }, msUntilNextCall);
  }
}

export default expressServer;