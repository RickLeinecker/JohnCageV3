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

  return {
    Admin: Admin,
    Groups: Groups,
    Recordings: Recordings,
    Tags: Tags,
    Users: Users,
  };
}
