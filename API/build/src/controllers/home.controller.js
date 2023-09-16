"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recording_repository_1 = __importDefault(require("../repositories/recording.repository"));
var ms = require('mediaserver');
class HomeController {
    welcome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json({ message: "Welcome to JCT application." });
        });
    }
    listenToRecording(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const recording = yield recording_repository_1.default.retrieveById(id);
                if (recording) {
                    // Create a filepath for the song.
                    const controllerFolder = __dirname + "/";
                    const musicFolder = "Music" + "/";
                    const Title = recording === null || recording === void 0 ? void 0 : recording.dataValues.Title;
                    const fileType = ".mp3";
                    const recordingLoc = controllerFolder + musicFolder + Title + fileType;
                    ms.pipe(req, res, recordingLoc);
                }
                else
                    res.status(404).send({
                        message: `Cannot find Recording with id=${id}.`
                    });
            }
            catch (err) {
                res.status(500).send({
                    message: `Error retrieving Recording with id=${id}.`
                });
            }
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Title = typeof req.query.Title === "string" ? req.query.Title : "";
            console.log(Title);
            try {
                const recordings = yield recording_repository_1.default.retrieveAll({ Title });
                res.status(200).send(recordings);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while retrieving recordings."
                });
            }
        });
    }
}
exports.default = HomeController;
