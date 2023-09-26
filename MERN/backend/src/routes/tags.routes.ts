import { Router } from "express";
import TagsController from "../controllers/tags.controller";

class TagsRoutes {
    router = Router();
    controller = new TagsController();

    constructor() {
      this.intializeRoutes();
    }
  
    intializeRoutes() {
      this.router.get("/", this.controller.getTags);
    }
}

export default new TagsRoutes().router;