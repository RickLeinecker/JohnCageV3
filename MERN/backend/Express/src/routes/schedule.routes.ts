import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller";

class SchedulesRoutees {
    router = Router();
    controller = new ScheduleController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/schedule", this.controller.scheduleConcert);
        this.router.get("/getSchedule", this.controller.getSchedule);
        this.router.post("/prepareConcert", this.controller.prepareConcert);
        this.router.post("/validatePerformer", this.controller.validatePerformer);
        this.router.get("/getNextConcert", this.controller.getNextConcert);
        this.router.get("/getMixMethods", this.controller.getMixMethods);
    }
}

export default new SchedulesRoutees().router;