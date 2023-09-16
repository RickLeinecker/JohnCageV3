import { Router } from "express";
import ConcertsController from "../controllers/concerts.controller";

class HomeRoutes {
    router = Router();
    controller = new ConcertsController();

    constructor() {
      this.intializeRoutes();
    }
  
    intializeRoutes() {
      this.router.get("/getSong", this.controller.listenToRecording);
      this.router.get("/searchSongs", this.controller.search);
    }
}
  
export default new HomeRoutes().router;