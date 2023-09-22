import { Application } from "express";
import homeRoutes from "./home.routes";
import recordingRoutes from "./recording.routes";
import userRoutes from "./user.routes";
import concertsRoutes from "./concerts.routes";

class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/concerts", concertsRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/recordings", recordingRoutes);
  }
}

export default Routes;