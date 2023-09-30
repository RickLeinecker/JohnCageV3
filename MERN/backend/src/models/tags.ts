import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface tagsAttributes {
  idTags: number;
  Tag?: string;
}

export type tagsPk = "idTags";
export type tagsId = tags[tagsPk];
export type tagsOptionalAttributes = "idTags" | "Tag";
export type tagsCreationAttributes = Optional<tagsAttributes, tagsOptionalAttributes>;

export class tags extends Model<tagsAttributes, tagsCreationAttributes> implements tagsAttributes {
  idTags!: number;
  Tag?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof tags {
    return tags.init({
    idTags: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    Tag: {
      type: DataTypes.STRING(15),
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
