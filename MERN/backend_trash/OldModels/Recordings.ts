// import * as Sequelize from 'sequelize';
// import { DataTypes, Model, Optional } from 'sequelize';
// import type { Groups, GroupsId } from './Groups';

// export interface RecordingsAttributes {
//   ID: number;
//   Title: string;
//   FilePath?: string;
//   GroupID?: number;
//   Tag1?: string;
//   Tag2?: string;
//   Tag3?: string;
//   PicturePath?: string;
//   FileName: string;
//   Description?: string;
//   Date?: string;
// }

// export type RecordingsPk = "ID";
// export type RecordingsId = Recordings[RecordingsPk];
// export type RecordingsOptionalAttributes = "ID" | "FilePath" | "GroupID" | "Tag1" | "Tag2" | "Tag3" | "PicturePath" | "Description" | "Date";
// export type RecordingsCreationAttributes = Optional<RecordingsAttributes, RecordingsOptionalAttributes>;

// export class Recordings extends Model<RecordingsAttributes, RecordingsCreationAttributes> implements RecordingsAttributes {
//   ID!: number;
//   Title!: string;
//   FilePath?: string;
//   GroupID?: number;
//   Tag1?: string;
//   Tag2?: string;
//   Tag3?: string;
//   PicturePath?: string;
//   FileName!: string;
//   Description?: string;
//   Date?: string;

//   // Recordings belongsTo Groups via GroupID
//   Group!: Groups;
//   getGroup!: Sequelize.BelongsToGetAssociationMixin<Groups>;
//   setGroup!: Sequelize.BelongsToSetAssociationMixin<Groups, GroupsId>;
//   createGroup!: Sequelize.BelongsToCreateAssociationMixin<Groups>;

//   static initModel(sequelize: Sequelize.Sequelize): typeof Recordings {
//     return Recordings.init({
//     ID: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     Title: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     FilePath: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//       unique: "FilePath_UNIQUE"
//     },
//     GroupID: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Groups',
//         key: 'GroupID'
//       }
//     },
//     Tag1: {
//       type: DataTypes.STRING(50),
//       allowNull: true
//     },
//     Tag2: {
//       type: DataTypes.STRING(50),
//       allowNull: true
//     },
//     Tag3: {
//       type: DataTypes.STRING(50),
//       allowNull: true
//     },
//     PicturePath: {
//       type: DataTypes.STRING(256),
//       allowNull: true
//     },
//     FileName: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//       unique: "FileName_UNIQUE"
//     },
//     Description: {
//       type: DataTypes.STRING(140),
//       allowNull: true
//     },
//     Date: {
//       type: DataTypes.STRING(140),
//       allowNull: true
//     }
//   }, {
//     sequelize,
//     tableName: 'Recordings',
//     timestamps: false,
//     indexes: [
//       {
//         name: "PRIMARY",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "ID" },
//         ]
//       },
//       {
//         name: "FileName_UNIQUE",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "FileName" },
//         ]
//       },
//       {
//         name: "FilePath_UNIQUE",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "FilePath" },
//         ]
//       },
//       {
//         name: "GroupID_idx",
//         using: "BTREE",
//         fields: [
//           { name: "GroupID" },
//         ]
//       },
//     ]
//   });
//   }
// }
