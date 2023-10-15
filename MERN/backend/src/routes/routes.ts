import { Application } from "express";
import homeRoutes from "./home.routes";
import recordingRoutes from "./recording.routes";
import userRoutes from "./user.routes";
import concertsRoutes from "./concerts.routes";
import scheduleRoutes from "./schedule.routes";
// import RecordingsRoutes from "./recordings.routes";

class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/concerts", concertsRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/recordings", recordingRoutes);
    app.use("/api/schedules", scheduleRoutes);
    // app.use("/api/recordings", RecordingsRoutes);
  }
}

export default Routes;