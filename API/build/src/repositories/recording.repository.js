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
const sequelize_1 = require("sequelize");
const recording_model_1 = __importDefault(require("../models/recording.model"));
class RecordingRepository {
    save(recording) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield recording_model_1.default.create({
                    Title: recording.Title,
                    GroupID: recording.GroupID,
                    Tag1: recording.Tag1,
                    Tag2: recording.Tag2,
                    Tag3: recording.Tag3,
                });
            }
            catch (err) {
                throw new Error("Failed to create Recording!");
            }
        });
    }
    retrieveAll(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let condition = {};
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.Title)
                    condition.title = { [sequelize_1.Op.like]: `%${searchParams.Title}%` };
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.Tag1)
                    condition.tag1 = { [sequelize_1.Op.like]: `%${searchParams.Tag1}%` };
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.Tag2)
                    condition.tag2 = { [sequelize_1.Op.like]: `%${searchParams.Tag2}%` };
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.Tag3)
                    condition.tag3 = { [sequelize_1.Op.like]: `%${searchParams.Tag3}%` };
                return yield recording_model_1.default.findAll({ where: condition });
            }
            catch (error) {
                throw new Error("Failed to retrieve Recording!");
            }
        });
    }
    retrieveById(recordingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield recording_model_1.default.findByPk(recordingId);
            }
            catch (error) {
                throw new Error("Failed to retrieve Recording!");
            }
        });
    }
    update(recording) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, Title, GroupID, Tag1, Tag2, Tag3 } = recording;
            try {
                const affectedRows = yield recording_model_1.default.update({ Title, GroupID, Tag1, Tag2, Tag3 }, { where: { id: id } });
                return affectedRows[0];
            }
            catch (error) {
                throw new Error("Failed to update Recording!");
            }
        });
    }
    delete(recordingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const affectedRows = yield recording_model_1.default.destroy({ where: { id: recordingId } });
                return affectedRows;
            }
            catch (error) {
                throw new Error("Failed to delete Recording!");
            }
        });
    }
}
exports.default = new RecordingRepository();
