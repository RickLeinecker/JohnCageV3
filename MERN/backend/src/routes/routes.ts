import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes";
import concertsRoutes from "./concerts.routes";
import scheduleRoutes from "./schedule.routes";

class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/concerts", concertsRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/schedules", scheduleRoutes);
  }
}

export default Routes;