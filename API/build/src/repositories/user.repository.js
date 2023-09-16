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
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository {
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.create({
                    Role: user.Role,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Email: user.Email,
                    Password: user.Password,
                    Phone: user.Phone,
                    UserName: user.UserName,
                    IsAdmin: user.IsAdmin,
                    IsVerified: user.IsVerified
                });
            }
            catch (err) {
                throw new Error("Failed to create User!");
            }
        });
    }
    // async retrieveAll(searchParams: {UserName?: string, IsAdmin?: boolean, IsVerified: boolean}): Promise<User[]> {
    retrieveAll(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let condition = {};
                // if (searchParams?.IsAdmin) condition.IsAdmin = true;
                // if (searchParams?.IsVerified) condition.IsVerified = true;
                if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.UserName)
                    condition.UserName = { [sequelize_1.Op.like]: `%${searchParams.UserName}%` };
                return yield user_model_1.default.findAll({ where: condition });
            }
            catch (error) {
                throw new Error("Failed to retrieve Users!");
            }
        });
    }
    retrieveById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findByPk(userId);
            }
            catch (error) {
                throw new Error("Failed to retrieve User!");
            }
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, IsVerified } = user;
            try {
                const affectedRows = yield user_model_1.default.update({ ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, IsVerified }, { where: { id: ID } });
                return affectedRows[0];
            }
            catch (error) {
                throw new Error("Failed to update User!");
            }
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const affectedRows = yield user_model_1.default.destroy({ where: { ID: userId } });
                return affectedRows;
            }
            catch (error) {
                throw new Error("Failed to delete User!");
            }
        });
    }
}
exports.default = new UserRepository();
