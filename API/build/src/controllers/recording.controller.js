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
class RecordingController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.Title) {
                res.status(400).send({
                    message: "Content can not be empty!"
                });
                return;
            }
            try {
                const recording = req.body;
                const savedRecording = yield recording_repository_1.default.save(recording);
                res.status(201).send(savedRecording);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while retrieving recordings."
                });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Title = typeof req.query.Title === "string" ? req.query.Title : "";
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
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const recording = yield recording_repository_1.default.retrieveById(id);
                if (recording)
                    res.status(200).send(recording);
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let recording = req.body;
            recording.id = parseInt(req.params.id);
            try {
                const num = yield recording_repository_1.default.update(recording);
                if (num == 1) {
                    res.send({
                        message: "Recording was updated successfully."
                    });
                }
                else {
                    res.send({
                        message: `Cannot update Recording with id=${recording.id}. Maybe Recording was not found or req.body is empty!`
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Error updating Recording with id=${recording.id}.`
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const num = yield recording_repository_1.default.delete(id);
                if (num == 1) {
                    res.send({
                        message: "Recording deleted successfully!"
                    });
                }
                else {
                    res.send({
                        message: `Cannot delete Recording with id=${id}. Maybe Recording was not found!`,
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Could not delete Recording with id==${id}.`
                });
            }
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Title = typeof req.query.Title === "string" ? req.query.Title : "";
            const Tag1 = typeof req.query.Tag1 === "string" ? req.query.Tag1 : "";
            const Tag2 = typeof req.query.Tag2 === "string" ? req.query.Tag2 : "";
            const Tag3 = typeof req.query.Tag3 === "string" ? req.query.Tag3 : "";
            try {
                const recordings = yield recording_repository_1.default.retrieveAll({ Title, Tag1, Tag2, Tag3 });
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
exports.default = RecordingController;
