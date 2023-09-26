import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Recordings, RecordingsId } from './Recordings';

export interface GroupsAttributes {
  GroupID: number;
  DateCreated: Date;
  GroupLeaderID: number;
  User1ID?: number;
  User2ID?: number;
  User3ID?: number;
  User4ID?: number;
  GroupName?: string;
}

export type GroupsPk = "GroupID";
export type GroupsId = Groups[GroupsPk];
export type GroupsOptionalAttributes = "GroupID" | "User1ID" | "User2ID" | "User3ID" | "User4ID" | "GroupName";
export type GroupsCreationAttributes = Optional<GroupsAttributes, GroupsOptionalAttributes>;

export class Groups extends Model<GroupsAttributes, GroupsCreationAttributes> implements GroupsAttributes {
  GroupID!: number;
  DateCreated!: Date;
  GroupLeaderID!: number;
  User1ID?: number;
  User2ID?: number;
  User3ID?: number;
  User4ID?: number;
  GroupName?: string;

  // Groups hasMany Recordings via GroupID
  Recordings!: Recordings[];
  getRecordings!: Sequelize.HasManyGetAssociationsMixin<Recordings>;
  setRecordings!: Sequelize.HasManySetAssociationsMixin<Recordings, RecordingsId>;
  addRecording!: Sequelize.HasManyAddAssociationMixin<Recordings, RecordingsId>;
  addRecordings!: Sequelize.HasManyAddAssociationsMixin<Recordings, RecordingsId>;
  createRecording!: Sequelize.HasManyCreateAssociationMixin<Recordings>;
  removeRecording!: Sequelize.HasManyRemoveAssociationMixin<Recordings, RecordingsId>;
  removeRecordings!: Sequelize.HasManyRemoveAssociationsMixin<Recordings, RecordingsId>;
  hasRecording!: Sequelize.HasManyHasAssociationMixin<Recordings, RecordingsId>;
  hasRecordings!: Sequelize.HasManyHasAssociationsMixin<Recordings, RecordingsId>;
  countRecordings!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Groups {
    return Groups.init({
    GroupID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: false
    },
    GroupLeaderID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    User1ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User2ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User3ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User4ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GroupName: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Groups',
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
    ]
  });
  }
}
