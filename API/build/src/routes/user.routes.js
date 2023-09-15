"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new user_controller_1.default();
        this.intializeRoutes();
    }
    intializeRoutes() {
        // Create a new User
        this.router.post("/", this.controller.create);
        // Retrieve all Users
        this.router.get("/", this.controller.findAll);
        // Retrieve a single User with id
        this.router.get("/:id", this.controller.findOne);
        // Update a User with id
        this.router.put("/:id", this.controller.update);
        // Delete a User with id
        this.router.delete("/:id", this.controller.delete);
    }
}
exports.default = new UserRoutes().router;
