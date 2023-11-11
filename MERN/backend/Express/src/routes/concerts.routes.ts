import { Router } from "express";
import ConcertsController from "../controllers/concerts.controller";

class ConcertsRoutes {
  router = Router();
  controller = new ConcertsController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/getSongFile", this.controller.findAndPipeAudio);
    this.router.get("/getSongData", this.controller.findOne);
    this.router.get("/searchSongs", this.controller.searchConcerts);
    this.router.get("/downloadConcertFile", this.controller.downloadConcertFile);

    this.router.get("/groups", this.controller.findAllGroups);
    this.router.get("/groups/startDate-endDate", this.controller.filterConcertsByDateRange);
  }
}

export default new ConcertsRoutes().router;