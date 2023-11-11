import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface verificationAttributes {
  ID: number;
  VerificationCode?: number;
  UserID?: number;
  DateCreated?: Date;
}

export type verificationPk = "ID";
export type verificationId = verification[verificationPk];
export type verificationOptionalAttributes = "ID" | "VerificationCode" | "UserID" | "DateCreated";
export type verificationCreationAttributes = Optional<verificationAttributes, verificationOptionalAttributes>;

export class verification extends Model<verificationAttributes, verificationCreationAttributes> implements verificationAttributes {
  ID!: number;
  VerificationCode?: number;
  UserID?: number;
  DateCreated?: Date;

  // verification belongsTo users via UserID
  User!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof verification {
    return verification.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    VerificationCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'ID'
      }
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'verification',
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
        name: "UserID_idx",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
  }
}
