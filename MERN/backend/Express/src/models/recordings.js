"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordings = void 0;
const sequelize_1 = require("sequelize");
class recordings extends sequelize_1.Model {
    static initModel(sequelize) {
        return recordings.init({
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
            RecordingFileName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "RecordingFileName_UNIQUE"
            }
        }, {
            sequelize,
            tableName: 'recordings',
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
                    name: "RecordingFileName_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "RecordingFileName" },
                    ]
                },
                {
                    name: "GroupID_idx",
                    using: "BTREE",
                    fields: [
                        { name: "GroupID" },
                    ]
                },
            ]
        });
    }
}
exports.recordings = recordings;
