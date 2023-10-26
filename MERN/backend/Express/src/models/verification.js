"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verification = void 0;
const sequelize_1 = require("sequelize");
class verification extends sequelize_1.Model {
    static initModel(sequelize) {
        return verification.init({
            ID: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            VerificationCode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            UserID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'ID'
                }
            }
        }, {
            sequelize,
            tableName: 'verification',
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
                    name: "UserID_idx",
                    using: "BTREE",
                    fields: [
                        { name: "UserID" },
                    ]
                },
            ]
        });
    }
}
exports.verification = verification;
