import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface verificationAttributes {
  VerificationCode?: number;
  UserID?: number;
  DateCreated?: Date;
}

export type verificationId = verification["UserID"];
export type verificationOptionalAttributes = "VerificationCode" | "UserID" | "DateCreated";
export type verificationCreationAttributes = Optional<verificationAttributes, verificationOptionalAttributes>;

export class verification extends Model<verificationAttributes, verificationCreationAttributes> implements verificationAttributes {
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
