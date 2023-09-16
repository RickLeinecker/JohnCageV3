"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = __importDefault(require("../controllers/home.controller"));
class HomeRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new home_controller_1.default();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get("/", this.controller.welcome);
        this.router.get("/listen/:id", this.controller.listenToRecording);
    }
}
exports.default = new HomeRoutes().router;
