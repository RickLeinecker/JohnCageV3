import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { groups, groupsId } from './groups';

export interface schedulesAttributes {
  ID: number;
  GroupID?: number;
  Date: string;
  Time: string;
  MaestroPasscode?: number;
  User1Passcode?: number;
  User2Passcode?: number;
  User3Passcode?: number;
  User4Passcode?: number;
  ListenerPasscode?: number;
  Mixer?: string;
}

export type schedulesPk = "ID";
export type schedulesId = schedules[schedulesPk];
export type schedulesOptionalAttributes = "ID" | "GroupID" | "MaestroPasscode" | "User1Passcode" | "User2Passcode" | "User3Passcode" | "User4Passcode" | "ListenerPasscode" | "Mixer";
export type schedulesCreationAttributes = Optional<schedulesAttributes, schedulesOptionalAttributes>;

export class schedules extends Model<schedulesAttributes, schedulesCreationAttributes> implements schedulesAttributes {
  ID!: number;
  GroupID?: number;
  Date!: string;
  Time!: string;
  MaestroPasscode?: number;
  User1Passcode?: number;
  User2Passcode?: number;
  User3Passcode?: number;
  User4Passcode?: number;
  ListenerPasscode?: number;
  Mixer?: string;

  // schedules belongsTo groups via GroupID
  Group!: groups;
  getGroup!: Sequelize.BelongsToGetAssociationMixin<groups>;
  setGroup!: Sequelize.BelongsToSetAssociationMixin<groups, groupsId>;
  createGroup!: Sequelize.BelongsToCreateAssociationMixin<groups>;

  static initModel(sequelize: Sequelize.Sequelize): typeof schedules {
    return schedules.init({
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
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    MaestroPasscode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User1Passcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User2Passcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User3Passcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    User4Passcode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ListenerPasscode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mixer: {
      type: DataTypes.STRING(45),
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
