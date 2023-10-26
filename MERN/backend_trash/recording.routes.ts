// import { Router } from "express";
// import RecordingController from "../controllers/recording.controller";

// class RecordingRoutes {
//   router = Router();
//   controller = new RecordingController();

//   constructor() {
//     this.intializeRoutes();
//   }

//   intializeRoutes() {
//     // Create a new Recording
//     this.router.post("/", this.controller.create);

//     // Retrieve all Recordings
//     this.router.get("/", this.controller.findAll);

//     // Retrieve all groups
//     this.router.get("/:group", this.controller.getRecordingsGroups);

//     // Search a Recording by Title, Tags
//     this.router.get("/search", this.controller.search);

//     // Retrieve a single Recording with id
//     this.router.get("/:id", this.controller.findOne);

//     // Update a Recording with id
//     this.router.put("/:id", this.controller.update);

//     // Delete a Recording with id
//     this.router.delete("/:id", this.controller.delete);

//   }
// }

// export default new RecordingRoutes().router;