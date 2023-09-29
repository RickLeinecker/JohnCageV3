import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { groups, groupsId } from './groups';

export interface recordingsAttributes {
  ID: number;
  GroupID?: number;
  RecordingFileName: string;
}

export type recordingsPk = "ID";
export type recordingsId = recordings[recordingsPk];
export type recordingsOptionalAttributes = "ID" | "GroupID";
export type recordingsCreationAttributes = Optional<recordingsAttributes, recordingsOptionalAttributes>;

export class recordings extends Model<recordingsAttributes, recordingsCreationAttributes> implements recordingsAttributes {
  ID!: number;
  GroupID?: number;
  RecordingFileName!: string;

  // recordings belongsTo groups via GroupID
  Group!: groups;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groups>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groups, groupsId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groups>;

  static initModel(sequelize: Sequelize.Sequelize): typeof recordings {
    return recordings.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'GroupID'
      }
    },
    RecordingFileName: {
      type: DataTypes.STRING(255),
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
