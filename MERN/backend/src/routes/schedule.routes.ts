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
    }
}

export default new SchedulesRoutees().router;