"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedules = void 0;
const sequelize_1 = require("sequelize");
class schedules extends sequelize_1.Model {
    static initModel(sequelize) {
        return schedules.init({
            ID: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            GroupID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'groups',
                    key: 'GroupID'
                }
            },
            Date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            Time: {
                type: sequelize_1.DataTypes.TIME,
                allowNull: false
            },
            MaestroPasscode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            User1Passcode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            User2Passcode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            User3Passcode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            User4Passcode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'schedules',
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
                    name: "uniqueDatetime",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "Date" },
                        { name: "Time" },
                    ]
                },
                {
                    name: "IDGroup_idx",
                    using: "BTREE",
                    fields: [
                        { name: "GroupID" },
                    ]
                },
            ]
        });
    }
}
exports.schedules = schedules;
