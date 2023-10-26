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
exports.groups = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class groups extends sequelize_1.Model {
    static initModel(sequelize) {
        return groups.init({
            GroupID: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            DateCreated: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
            },
            GroupLeaderID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'ID'
                }
            },
            GroupLeaderName: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            User1Name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            User2Name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            User3Name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            User4Name: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            GroupName: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            Title: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "Title_UNIQUE"
            },
            Tags: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true
            },
            PictureFileName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            Description: {
                type: sequelize_1.DataTypes.STRING(140),
                allowNull: true
            },
            Date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: "2000-01-01"
            },
            Time: {
                type: sequelize_1.DataTypes.TIME,
                allowNull: false,
                defaultValue: "00:00:00"
            }
        }, {
            sequelize,
            tableName: 'groups',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "GroupID" },
                    ]
                },
                {
                    name: "GroupID_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "GroupID" },
                    ]
                },
                {
                    name: "Title_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "Title" },
                    ]
                },
                {
                    name: "GroupLeaderID_idx",
                    using: "BTREE",
                    fields: [
                        { name: "GroupLeaderID" },
                    ]
                },
            ]
        });
    }
}
exports.groups = groups;
