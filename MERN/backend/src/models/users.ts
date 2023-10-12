import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { groups, groupsId } from './groups';

export interface usersAttributes {
  ID: number;
  Role: string;
  DateCreated: Date;
  DateLastLoggedIn: Date;
  Name: string;
  UserName: string;
  Email: string;
  Password: string;
  Phone?: string;
  IsAdmin: number;
  IsVerified: number;
  VerificationCode?: number;
}

export type usersPk = "ID";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "ID" | "Role" | "DateCreated" | "DateLastLoggedIn" | "Phone" | "IsAdmin" | "IsVerified" | "VerificationCode";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  ID!: number;
  Role!: string;
  DateCreated!: Date;
  DateLastLoggedIn!: Date;
  Name!: string;
  UserName!: string;
  Email!: string;
  Password!: string;
  Phone?: string;
  IsAdmin!: number;
  IsVerified!: number;
  VerificationCode?: number;

  // users hasMany groups via GroupLeaderID
  groups!: groups[];
  getGroups!: Sequelize.HasManyGetAssociationsMixin<groups>;
  setGroups!: Sequelize.HasManySetAssociationsMixin<groups, groupsId>;
  addGroup!: Sequelize.HasManyAddAssociationMixin<groups, groupsId>;
  addGroups!: Sequelize.HasManyAddAssociationsMixin<groups, groupsId>;
  createGroup!: Sequelize.HasManyCreateAssociationMixin<groups>;
  removeGroup!: Sequelize.HasManyRemoveAssociationMixin<groups, groupsId>;
  removeGroups!: Sequelize.HasManyRemoveAssociationsMixin<groups, groupsId>;
  hasGroup!: Sequelize.HasManyHasAssociationMixin<groups, groupsId>;
  hasGroups!: Sequelize.HasManyHasAssociationsMixin<groups, groupsId>;
  countGroups!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
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
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "UserName_UNIQUE"
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "Email_UNIQUE"
    },
    Password: {
      type: DataTypes.STRING(69),
      allowNull: false
    },
    Phone: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    IsAdmin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    IsVerified: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    VerificationCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "UserName_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserName" },
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
    ]
  });
  }
}
