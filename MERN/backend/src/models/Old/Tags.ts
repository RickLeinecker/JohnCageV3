import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TagsAttributes {
  idTags: number;
  Tags?: string;
}

export type TagsPk = "idTags";
export type TagsId = Tags[TagsPk];
export type TagsOptionalAttributes = "idTags" | "Tags";
export type TagsCreationAttributes = Optional<TagsAttributes, TagsOptionalAttributes>;

export class Tags extends Model<TagsAttributes, TagsCreationAttributes> implements TagsAttributes {
  idTags!: number;
  Tags?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof Tags {
    return Tags.init({
    idTags: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tags: {
      type: DataTypes.STRING(500),
      allowNull: true,
      unique: "Tags_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'Tags',
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
        name: "Tags_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Tags" },
        ]
      },
    ]
  });
  }
}
