import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Recordings, RecordingsId } from './Recordings';
import type { Users, UsersId } from './Users';

export interface AdminAttributes {
  ReportNumber: number;
  ReporterID?: number;
  ReporterName?: string;
  RecordingID?: number;
  Reason?: string;
}

export type AdminPk = "ReportNumber";
export type AdminId = Admin[AdminPk];
export type AdminOptionalAttributes = "ReportNumber" | "ReporterID" | "ReporterName" | "RecordingID" | "Reason";
export type AdminCreationAttributes = Optional<AdminAttributes, AdminOptionalAttributes>;

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  ReportNumber!: number;
  ReporterID?: number;
  ReporterName?: string;
  RecordingID?: number;
  Reason?: string;

  // Admin belongsTo Recordings via RecordingID
  Recording!: Recordings;
  getRecording!: Sequelize.BelongsToGetAssociationMixin<Recordings>;
  setRecording!: Sequelize.BelongsToSetAssociationMixin<Recordings, RecordingsId>;
  createRecording!: Sequelize.BelongsToCreateAssociationMixin<Recordings>;
  // Admin belongsTo Users via ReporterID
  Reporter!: Users;
  getReporter!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setReporter!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createReporter!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // Admin belongsTo Users via ReporterName
  ReporterName_User!: Users;
  getReporterName_User!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setReporterName_User!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createReporterName_User!: Sequelize.BelongsToCreateAssociationMixin<Users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Admin {
    return Admin.init({
    ReportNumber: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ReporterID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID'
      }
    },
    ReporterName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'UserName'
      }
    },
    RecordingID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Recordings',
        key: 'ID'
      }
    },
    Reason: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Admin',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ReportNumber" },
        ]
      },
      {
        name: "ReportNumber_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ReportNumber" },
        ]
      },
      {
        name: "UserID_idx",
        using: "BTREE",
        fields: [
          { name: "ReporterID" },
        ]
      },
      {
        name: "fk_UserName_idx",
        using: "BTREE",
        fields: [
          { name: "ReporterName" },
        ]
      },
      {
        name: "fk_RecordingID_idx",
        using: "BTREE",
        fields: [
          { name: "RecordingID" },
        ]
      },
    ]
  });
  }
}
