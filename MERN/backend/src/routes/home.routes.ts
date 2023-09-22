import { Router } from "express";
import HomeController from "../controllers/home.controller";

class HomeRoutes {
    router = Router();
    controller = new HomeController();

    constructor() {
      this.intializeRoutes();
    }
  
    intializeRoutes() {
      this.router.get("/", this.controller.welcome);
    }
}
  
export default new HomeRoutes().router;