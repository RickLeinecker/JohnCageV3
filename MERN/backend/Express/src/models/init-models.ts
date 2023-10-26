import type { Sequelize } from "sequelize";
import { groups as _groups } from "./groups";
import type { groupsAttributes, groupsCreationAttributes } from "./groups";
import { recordings as _recordings } from "./recordings";
import type { recordingsAttributes, recordingsCreationAttributes } from "./recordings";
import { schedules as _schedules } from "./schedules";
import type { schedulesAttributes, schedulesCreationAttributes } from "./schedules";
import { tags as _tags } from "./tags";
import type { tagsAttributes, tagsCreationAttributes } from "./tags";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";
import { verification as _verification } from "./verification";
import type { verificationAttributes, verificationCreationAttributes } from "./verification";

export {
  _groups as groups,
  _recordings as recordings,
  _schedules as schedules,
  _tags as tags,
  _users as users,
  _verification as verification,
};

export type {
  groupsAttributes,
  groupsCreationAttributes,
  recordingsAttributes,
  recordingsCreationAttributes,
  schedulesAttributes,
  schedulesCreationAttributes,
  tagsAttributes,
  tagsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
  verificationAttributes,
  verificationCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const groups = _groups.initModel(sequelize);
  const recordings = _recordings.initModel(sequelize);
  const schedules = _schedules.initModel(sequelize);
  const tags = _tags.initModel(sequelize);
  const users = _users.initModel(sequelize);
  const verification = _verification.initModel(sequelize);

  recordings.belongsTo(groups, { as: "Group", foreignKey: "GroupID"});
  groups.hasMany(recordings, { as: "recordings", foreignKey: "GroupID"});
  schedules.belongsTo(groups, { as: "Group", foreignKey: "GroupID"});
  groups.hasMany(schedules, { as: "schedules", foreignKey: "GroupID"});
  groups.belongsTo(users, { as: "GroupLeader", foreignKey: "GroupLeaderID"});
  users.hasMany(groups, { as: "groups", foreignKey: "GroupLeaderID"});
  verification.belongsTo(users, { as: "User", foreignKey: "UserID"});
  users.hasMany(verification, { as: "verifications", foreignKey: "UserID"});

  return {
    groups: groups,
    recordings: recordings,
    schedules: schedules,
    tags: tags,
    users: users,
    verification: verification,
  };
}
