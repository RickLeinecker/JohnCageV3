import { Router } from "express";
import RecordingsController from "../controllers/recordings.controller";

class RecordingsRoutes {
    router = Router();
    controller = new RecordingsController();

    constructor() {
      this.intializeRoutes();
    }
  
    intializeRoutes() {
      this.router.get("/", this.controller.getRecordings);
      this.router.get("/users", this.controller.getRecordingsUsers);
      this.router.get("/:group", this.controller.getRecordingsGroups);
    }
}

export default new RecordingsRoutes().router;