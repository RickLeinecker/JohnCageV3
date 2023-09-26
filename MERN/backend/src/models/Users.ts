import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Groups, GroupsId } from './Groups';

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

  // Users hasMany Groups via User1ID
  User1_Groups!: Groups[];
  getUser1_Groups!: Sequelize.HasManyGetAssociationsMixin<Groups>;
  setUser1_Groups!: Sequelize.HasManySetAssociationsMixin<Groups, GroupsId>;
  addUser1_Group!: Sequelize.HasManyAddAssociationMixin<Groups, GroupsId>;
  addUser1_Groups!: Sequelize.HasManyAddAssociationsMixin<Groups, GroupsId>;
  createUser1_Group!: Sequelize.HasManyCreateAssociationMixin<Groups>;
  removeUser1_Group!: Sequelize.HasManyRemoveAssociationMixin<Groups, GroupsId>;
  removeUser1_Groups!: Sequelize.HasManyRemoveAssociationsMixin<Groups, GroupsId>;
  hasUser1_Group!: Sequelize.HasManyHasAssociationMixin<Groups, GroupsId>;
  hasUser1_Groups!: Sequelize.HasManyHasAssociationsMixin<Groups, GroupsId>;
  countUser1_Groups!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany Groups via User2ID
  User2_Groups!: Groups[];
  getUser2_Groups!: Sequelize.HasManyGetAssociationsMixin<Groups>;
  setUser2_Groups!: Sequelize.HasManySetAssociationsMixin<Groups, GroupsId>;
  addUser2_Group!: Sequelize.HasManyAddAssociationMixin<Groups, GroupsId>;
  addUser2_Groups!: Sequelize.HasManyAddAssociationsMixin<Groups, GroupsId>;
  createUser2_Group!: Sequelize.HasManyCreateAssociationMixin<Groups>;
  removeUser2_Group!: Sequelize.HasManyRemoveAssociationMixin<Groups, GroupsId>;
  removeUser2_Groups!: Sequelize.HasManyRemoveAssociationsMixin<Groups, GroupsId>;
  hasUser2_Group!: Sequelize.HasManyHasAssociationMixin<Groups, GroupsId>;
  hasUser2_Groups!: Sequelize.HasManyHasAssociationsMixin<Groups, GroupsId>;
  countUser2_Groups!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany Groups via User3ID
  User3_Groups!: Groups[];
  getUser3_Groups!: Sequelize.HasManyGetAssociationsMixin<Groups>;
  setUser3_Groups!: Sequelize.HasManySetAssociationsMixin<Groups, GroupsId>;
  addUser3_Group!: Sequelize.HasManyAddAssociationMixin<Groups, GroupsId>;
  addUser3_Groups!: Sequelize.HasManyAddAssociationsMixin<Groups, GroupsId>;
  createUser3_Group!: Sequelize.HasManyCreateAssociationMixin<Groups>;
  removeUser3_Group!: Sequelize.HasManyRemoveAssociationMixin<Groups, GroupsId>;
  removeUser3_Groups!: Sequelize.HasManyRemoveAssociationsMixin<Groups, GroupsId>;
  hasUser3_Group!: Sequelize.HasManyHasAssociationMixin<Groups, GroupsId>;
  hasUser3_Groups!: Sequelize.HasManyHasAssociationsMixin<Groups, GroupsId>;
  countUser3_Groups!: Sequelize.HasManyCountAssociationsMixin;
  // Users hasMany Groups via User4ID
  User4_Groups!: Groups[];
  getUser4_Groups!: Sequelize.HasManyGetAssociationsMixin<Groups>;
  setUser4_Groups!: Sequelize.HasManySetAssociationsMixin<Groups, GroupsId>;
  addUser4_Group!: Sequelize.HasManyAddAssociationMixin<Groups, GroupsId>;
  addUser4_Groups!: Sequelize.HasManyAddAssociationsMixin<Groups, GroupsId>;
  createUser4_Group!: Sequelize.HasManyCreateAssociationMixin<Groups>;
  removeUser4_Group!: Sequelize.HasManyRemoveAssociationMixin<Groups, GroupsId>;
  removeUser4_Groups!: Sequelize.HasManyRemoveAssociationsMixin<Groups, GroupsId>;
  hasUser4_Group!: Sequelize.HasManyHasAssociationMixin<Groups, GroupsId>;
  hasUser4_Groups!: Sequelize.HasManyHasAssociationsMixin<Groups, GroupsId>;
  countUser4_Groups!: Sequelize.HasManyCountAssociationsMixin;

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
