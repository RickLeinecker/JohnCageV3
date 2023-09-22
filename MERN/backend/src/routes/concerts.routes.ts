import { Router } from "express";
import ConcertsController from "../controllers/concerts.controller";

class ConcertsRoutes {
    router = Router();
    controller = new ConcertsController();

    constructor() {
      this.intializeRoutes();
    }
  
    intializeRoutes() {
      this.router.get("/getSongFile", this.controller.pipeConcertFile);
      this.router.get("/getSongData", this.controller.retrieveConcertData);
      this.router.get("/searchSongs", this.controller.searchConcerts);
      this.router.get("/getTags", this.controller.retrieveRandomTags);
    }
}
  
export default new ConcertsRoutes().router;