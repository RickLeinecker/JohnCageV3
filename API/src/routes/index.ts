import { Application } from "express";
import homeRoutes from "./home.routes";
import recordingRoutes from "./recording.routes";
import userRoutes from "./user.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/recordings", recordingRoutes);
    app.use("/api/users", userRoutes);
  }
}