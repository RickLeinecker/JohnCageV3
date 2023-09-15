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
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.Email) {
                res.status(400).send({
                    message: "Email can not be empty!"
                });
                return;
            }
            if (!req.body.UserName) {
                res.status(400).send({
                    message: "UserName can not be empty!"
                });
                return;
            }
            if (!req.body.Password) {
                res.status(400).send({
                    message: "Password can not be empty!"
                });
                return;
            }
            try {
                const user = req.body;
                if (!user.IsAdmin)
                    user.IsAdmin = false;
                if (!user.IsVerified)
                    user.IsVerified = false;
                const savedUser = yield user_repository_1.default.save(user);
                res.status(201).send(savedUser);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while creating users."
                });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserName = typeof req.query.UserName === "string" ? req.query.UserName : "";
            try {
                const users = yield user_repository_1.default.retrieveAll({ UserName });
                res.status(200).send(users);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while retrieving users."
                });
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const user = yield user_repository_1.default.retrieveById(id);
                if (user)
                    res.status(200).send(user);
                else
                    res.status(404).send({
                        message: `Cannot find User with id=${id}.`
                    });
            }
            catch (err) {
                res.status(500).send({
                    message: `Error retrieving User with id=${id}.`
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.body;
            user.ID = parseInt(req.params.id);
            try {
                const num = yield user_repository_1.default.update(user);
                if (num == 1) {
                    res.send({
                        message: "User was updated successfully."
                    });
                }
                else {
                    res.send({
                        message: `Cannot update User with id=${user.ID}. Maybe User was not found or req.body is empty!`
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Error updating User with id=${user.id}.`
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const num = yield user_repository_1.default.delete(id);
                if (num == 1) {
                    res.send({
                        message: "User was deleted successfully!"
                    });
                }
                else {
                    res.send({
                        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                    });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Could not delete User with id==${id}.`
                });
            }
        });
    }
    findAllVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_repository_1.default.retrieveAll({ IsVerified: true });
                res.status(200).send(users);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while retrieving verified users."
                });
            }
        });
    }
    findAllAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_repository_1.default.retrieveAll({ IsAdmin: true });
                res.status(200).send(users);
            }
            catch (err) {
                res.status(500).send({
                    message: "Some error occurred while retrieving admins."
                });
            }
        });
    }
}
exports.default = UserController;
