"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tags = void 0;
const sequelize_1 = require("sequelize");
class tags extends sequelize_1.Model {
    static initModel(sequelize) {
        return tags.init({
            idTags: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            Tag: {
                type: sequelize_1.DataTypes.STRING(15),
                allowNull: true,
                unique: "Tag_UNIQUE"
            }
        }, {
            sequelize,
            tableName: 'tags',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "idTags" },
                    ]
                },
                {
                    name: "Tag_UNIQUE",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "Tag" },
                    ]
                },
            ]
        });
    }
}
exports.tags = tags;
