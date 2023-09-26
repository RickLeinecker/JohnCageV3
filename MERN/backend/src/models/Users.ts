import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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
