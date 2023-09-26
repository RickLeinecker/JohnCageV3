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
    }
}

export default new RecordingsRoutes().router;