"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recording_controller_1 = __importDefault(require("../controllers/recording.controller"));
class RecordingRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new recording_controller_1.default();
        this.intializeRoutes();
    }
    intializeRoutes() {
        // Create a new Recording
        this.router.post("/", this.controller.create);
        // Retrieve all Recordings
        this.router.get("/", this.controller.findAll);
        // Search a Recording by Title, Tags
        this.router.get("/search", this.controller.search);
        // Retrieve a single Recording with id
        this.router.get("/:id", this.controller.findOne);
        // Update a Recording with id
        this.router.put("/:id", this.controller.update);
        // Delete a Recording with id
        this.router.delete("/:id", this.controller.delete);
    }
}
exports.default = new RecordingRoutes().router;
