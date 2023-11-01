import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { recordings, recordingsId } from './recordings';
import type { schedules, schedulesId } from './schedules';
import type { users, usersId } from './users';

export interface groupsAttributes {
  GroupID: number;
  DateCreated: Date;
  GroupLeaderID: number;
  GroupLeaderName?: string;
  User1Name?: string;
  User2Name?: string;
  User3Name?: string;
  User4Name?: string;
  GroupName?: string;
  Title: string;
  Tags?: string;
  PictureFileName?: string;
  Description?: string;
  Date: string;
  Time: string;
}

export type groupsPk = "GroupID";
export type groupsId = groups[groupsPk];
export type groupsOptionalAttributes = "GroupID" | "DateCreated" | "GroupLeaderName" | "User1Name" | "User2Name" | "User3Name" | "User4Name" | "GroupName" | "Tags" | "PictureFileName" | "Description" | "Date" | "Time";
export type groupsCreationAttributes = Optional<groupsAttributes, groupsOptionalAttributes>;

export class groups extends Model<groupsAttributes, groupsCreationAttributes> implements groupsAttributes {
  GroupID!: number;
  DateCreated!: Date;
  GroupLeaderID!: number;
  GroupLeaderName?: string;
  User1Name?: string;
  User2Name?: string;
  User3Name?: string;
  User4Name?: string;
  GroupName?: string;
  Title!: string;
  Tags?: string;
  PictureFileName?: string;
  Description?: string;
  Date!: string;
  Time!: string;

  // groups hasMany recordings via GroupID
  recordings!: recordings[];
  getRecordings!: Sequelize.HasManyGetAssociationsMixin<recordings>;
  setRecordings!: Sequelize.HasManySetAssociationsMixin<recordings, recordingsId>;
  addRecording!: Sequelize.HasManyAddAssociationMixin<recordings, recordingsId>;
  addRecordings!: Sequelize.HasManyAddAssociationsMixin<recordings, recordingsId>;
  createRecording!: Sequelize.HasManyCreateAssociationMixin<recordings>;
  removeRecording!: Sequelize.HasManyRemoveAssociationMixin<recordings, recordingsId>;
  removeRecordings!: Sequelize.HasManyRemoveAssociationsMixin<recordings, recordingsId>;
  hasRecording!: Sequelize.HasManyHasAssociationMixin<recordings, recordingsId>;
  hasRecordings!: Sequelize.HasManyHasAssociationsMixin<recordings, recordingsId>;
  countRecordings!: Sequelize.HasManyCountAssociationsMixin;
  // groups hasMany schedules via GroupID
  schedules!: schedules[];
  getSchedules!: Sequelize.HasManyGetAssociationsMixin<schedules>;
  setSchedules!: Sequelize.HasManySetAssociationsMixin<schedules, schedulesId>;
  addSchedule!: Sequelize.HasManyAddAssociationMixin<schedules, schedulesId>;
  addSchedules!: Sequelize.HasManyAddAssociationsMixin<schedules, schedulesId>;
  createSchedule!: Sequelize.HasManyCreateAssociationMixin<schedules>;
  removeSchedule!: Sequelize.HasManyRemoveAssociationMixin<schedules, schedulesId>;
  removeSchedules!: Sequelize.HasManyRemoveAssociationsMixin<schedules, schedulesId>;
  hasSchedule!: Sequelize.HasManyHasAssociationMixin<schedules, schedulesId>;
  hasSchedules!: Sequelize.HasManyHasAssociationsMixin<schedules, schedulesId>;
  countSchedules!: Sequelize.HasManyCountAssociationsMixin;
  // groups belongsTo users via GroupLeaderID
  GroupLeader!: users;
  getGroupLeader!: Sequelize.BelongsToGetAssociationMixin<users>;
  setGroupLeader!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createGroupLeader!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof groups {
    return groups.init({
    GroupID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    GroupLeaderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'ID'
      }
    },
    GroupLeaderName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    User1Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    User2Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    User3Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    User4Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GroupName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Title_UNIQUE"
    },
    Tags: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PictureFileName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(140),
      allowNull: true
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "2000-01-01"
    },
    Time: {
      type: DataTypes.TIME,
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
