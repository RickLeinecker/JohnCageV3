import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Users, UsersId } from './Users';

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

  // Groups belongsTo Users via GroupLeaderID
  GroupLeader!: Users;
  getGroupLeader!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setGroupLeader!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createGroupLeader!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // Groups belongsTo Users via User1ID
  User1!: Users;
  getUser1!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setUser1!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createUser1!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // Groups belongsTo Users via User2ID
  User2!: Users;
  getUser2!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setUser2!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createUser2!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // Groups belongsTo Users via User3ID
  User3!: Users;
  getUser3!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setUser3!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createUser3!: Sequelize.BelongsToCreateAssociationMixin<Users>;
  // Groups belongsTo Users via User4ID
  User4!: Users;
  getUser4!: Sequelize.BelongsToGetAssociationMixin<Users>;
  setUser4!: Sequelize.BelongsToSetAssociationMixin<Users, UsersId>;
  createUser4!: Sequelize.BelongsToCreateAssociationMixin<Users>;

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
      allowNull: false,
      references: {
        model: 'Users',
        key: 'ID'
      }
    },
    User1ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID'
      }
    },
    User2ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID'
      }
    },
    User3ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID'
      }
    },
    User4ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'ID'
      }
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
      {
        name: "GroupLeaderID_idx",
        using: "BTREE",
        fields: [
          { name: "GroupLeaderID" },
        ]
      },
      {
        name: "User1ID_idx",
        using: "BTREE",
        fields: [
          { name: "User1ID" },
        ]
      },
      {
        name: "User2ID_idx",
        using: "BTREE",
        fields: [
          { name: "User2ID" },
        ]
      },
      {
        name: "User3ID_idx",
        using: "BTREE",
        fields: [
          { name: "User3ID" },
        ]
      },
      {
        name: "User4ID_idx",
        using: "BTREE",
        fields: [
          { name: "User4ID" },
        ]
      },
    ]
  });
  }
}
