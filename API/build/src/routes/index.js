"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const home_routes_1 = __importDefault(require("./home.routes"));
const recording_routes_1 = __importDefault(require("./recording.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
class Routes {
    constructor(app) {
        app.use("/api", home_routes_1.default);
        app.use("/api/recordings", recording_routes_1.default);
        app.use("/api/users", user_routes_1.default);
    }
}
exports.default = Routes;
