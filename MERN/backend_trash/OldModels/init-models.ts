import type { Sequelize } from "sequelize";
import { Admin as _Admin } from "./Admin";
import type { AdminAttributes, AdminCreationAttributes } from "./Admin";
import { Groups as _Groups } from "./Groups";
import type { GroupsAttributes, GroupsCreationAttributes } from "./Groups";
import { Recordings as _Recordings } from "./Recordings";
import type { RecordingsAttributes, RecordingsCreationAttributes } from "./Recordings";
import { Tags as _Tags } from "./Tags";
import type { TagsAttributes, TagsCreationAttributes } from "./Tags";
import { Users as _Users } from "./Users";
import type { UsersAttributes, UsersCreationAttributes } from "./Users";

export {
  _Admin as Admin,
  _Groups as Groups,
  _Recordings as Recordings,
  _Tags as Tags,
  _Users as Users,
};

export type {
  AdminAttributes,
  AdminCreationAttributes,
  GroupsAttributes,
  GroupsCreationAttributes,
  RecordingsAttributes,
  RecordingsCreationAttributes,
  TagsAttributes,
  TagsCreationAttributes,
  UsersAttributes,
  UsersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Admin = _Admin.initModel(sequelize);
  const Groups = _Groups.initModel(sequelize);
  const Recordings = _Recordings.initModel(sequelize);
  const Tags = _Tags.initModel(sequelize);
  const Users = _Users.initModel(sequelize);

  Recordings.belongsTo(Groups, { as: "Group", foreignKey: "GroupID"});
  Groups.hasMany(Recordings, { as: "Recordings", foreignKey: "GroupID"});
  Admin.belongsTo(Recordings, { as: "Recording", foreignKey: "RecordingID"});
  Recordings.hasMany(Admin, { as: "Admins", foreignKey: "RecordingID"});
  Admin.belongsTo(Users, { as: "Reporter", foreignKey: "ReporterID"});
  Users.hasMany(Admin, { as: "Admins", foreignKey: "ReporterID"});
  Admin.belongsTo(Users, { as: "ReporterName_User", foreignKey: "ReporterName"});
  Users.hasMany(Admin, { as: "ReporterName_Admins", foreignKey: "ReporterName"});
  Groups.belongsTo(Users, { as: "GroupLeader", foreignKey: "GroupLeaderID"});
  Users.hasMany(Groups, { as: "Groups", foreignKey: "GroupLeaderID"});
  Groups.belongsTo(Users, { as: "User1", foreignKey: "User1ID"});
  Users.hasMany(Groups, { as: "User1_Groups", foreignKey: "User1ID"});
  Groups.belongsTo(Users, { as: "User2", foreignKey: "User2ID"});
  Users.hasMany(Groups, { as: "User2_Groups", foreignKey: "User2ID"});
  Groups.belongsTo(Users, { as: "User3", foreignKey: "User3ID"});
  Users.hasMany(Groups, { as: "User3_Groups", foreignKey: "User3ID"});
  Groups.belongsTo(Users, { as: "User4", foreignKey: "User4ID"});
  Users.hasMany(Groups, { as: "User4_Groups", foreignKey: "User4ID"});

  return {
    Admin: Admin,
    Groups: Groups,
    Recordings: Recordings,
    Tags: Tags,
    Users: Users,
  };
}
