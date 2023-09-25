import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Admin, AdminId } from './Admin';

export interface UsersAttributes {
  ID: number;
  Role: string;
  DateCreated: Date;
  DateLastLoggedIn: Date;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Phone: string;
  UserName: string;
  IsAdmin: number;
  isVerified: number;
}

export type UsersPk = "ID";
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes = "ID" | "Role" | "DateCreated" | "DateLastLoggedIn" | "FirstName" | "LastName" | "Email" | "Password" | "IsAdmin" | "isVerified";
export type UsersCreationAttributes = Optional<UsersAttributes, UsersOptionalAttributes>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
  ID!: number;
  Role!: string;
  DateCreated!: Date;
  DateLastLoggedIn!: Date;
  FirstName!: string;
  LastName!: string;
  Email!: string;
  Password!: string;
  Phone!: string;
  UserName!: string;
  IsAdmin!: number;
  isVerified!: number;

  // Users hasMany Admin via ReporterID
  Admins!: Admin[];
  getAdmins!: Sequelize.HasManyGetAssociationsMixin<Admin>;
  setAdmins!: Sequelize.HasManySetAssociationsMixin<Admin, AdminId>;
  addAdmin!: Sequelize.HasManyAddAssociationMixin<Admin, AdminId>;
  addAdmins!: Sequelize.HasManyAddAssociationsMixin<Admin, AdminId>;
  createAdmin!: Sequelize.HasManyCreateAssociationMixin<Admin>;
  removeAdmin!: Sequelize.HasManyRemoveAssociationMixin<Admin, AdminId>;
  removeAdmins!: Sequelize.HasManyRemoveAssociationsMixin<Admin, AdminId>;
  hasAdmin!: Sequelize.HasManyHasAssociationMixin<Admin, AdminId>;
  hasAdmins!: Sequelize.HasManyHasAssociationsMixin<Admin, AdminId>;
  countAdmins!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany Admin via ReporterName
  ReporterName_Admins!: Admin[];
  getReporterName_Admins!: Sequelize.HasManyGetAssociationsMixin<Admin>;
  setReporterName_Admins!: Sequelize.HasManySetAssociationsMixin<Admin, AdminId>;
  addReporterName_Admin!: Sequelize.HasManyAddAssociationMixin<Admin, AdminId>;
  addReporterName_Admins!: Sequelize.HasManyAddAssociationsMixin<Admin, AdminId>;
  createReporterName_Admin!: Sequelize.HasManyCreateAssociationMixin<Admin>;
  removeReporterName_Admin!: Sequelize.HasManyRemoveAssociationMixin<Admin, AdminId>;
  removeReporterName_Admins!: Sequelize.HasManyRemoveAssociationsMixin<Admin, AdminId>;
  hasReporterName_Admin!: Sequelize.HasManyHasAssociationMixin<Admin, AdminId>;
  hasReporterName_Admins!: Sequelize.HasManyHasAssociationsMixin<Admin, AdminId>;
  countReporterName_Admins!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    return Users.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Role: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "Leader"
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    DateLastLoggedIn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    FirstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    LastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "",
      unique: "Email_UNIQUE"
    },
    Password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Phone: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "UserName_UNIQUE"
    },
    IsAdmin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Users',
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
        name: "Email_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Email" },
        ]
      },
      {
        name: "UserName_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserName" },
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
    ]
  });
  }
}
