import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes/routes";
import MySQLDatabase from "./database/mysql";

class expressServer {
  public expressApp: Application = express();

  constructor() {
    this.config(this.expressApp);
    this.syncDatabase();
    new Routes(this.expressApp);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*"// Fix using env variable.
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    /*
    const db = new MySQLDatabase();
    db.sequelize?.sync();
    */
  }
}

export default expressServer;