import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes/routes";
import MySQLDatabase from "./database/mysql";
import console_log from "./logging/console_log";

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

    // const db = new MySQLDatabase();
    // if (db.sequelize != undefined) {
    //   db.sequelize.sync();
    // }

  }
}

export default expressServer;