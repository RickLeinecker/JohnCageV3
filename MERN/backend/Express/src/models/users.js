"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class users extends sequelize_1.Model {
    static initModel(sequelize) {
        return users.init({
            ID: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            Role: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false,
                defaultValue: "Leader"
            },
            DateCreated: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            DateLastLoggedIn: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            UserName: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                unique: "UserName_UNIQUE"
            },
            Email: {
                type: sequelize_1.DataTypes.STRING(150),
                allowNull: false,
                unique: "Email_UNIQUE"
            },
            Password: {
                type: sequelize_1.DataTypes.STRING(69),
                allowNull: false
            },
            IsAdmin: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            },
            IsVerified: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            },
            VerificationCode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'users',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "ID" },
                    ]
                },
                {
                    name: "ID_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "ID" },
                    ]
                },
                {
                    name: "UserName_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "UserName" },
                    ]
                },
                {
                    name: "Email_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "Email" },
                    ]
                },
            ]
        });
    }
}
exports.users = users;
