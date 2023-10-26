"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.verification = exports.users = exports.tags = exports.schedules = exports.recordings = exports.groups = void 0;
const groups_1 = require("./groups");
Object.defineProperty(exports, "groups", { enumerable: true, get: function () { return groups_1.groups; } });
const recordings_1 = require("./recordings");
Object.defineProperty(exports, "recordings", { enumerable: true, get: function () { return recordings_1.recordings; } });
const schedules_1 = require("./schedules");
Object.defineProperty(exports, "schedules", { enumerable: true, get: function () { return schedules_1.schedules; } });
const tags_1 = require("./tags");
Object.defineProperty(exports, "tags", { enumerable: true, get: function () { return tags_1.tags; } });
const users_1 = require("./users");
Object.defineProperty(exports, "users", { enumerable: true, get: function () { return users_1.users; } });
const verification_1 = require("./verification");
Object.defineProperty(exports, "verification", { enumerable: true, get: function () { return verification_1.verification; } });
function initModels(sequelize) {
    const groups = groups_1.groups.initModel(sequelize);
    const recordings = recordings_1.recordings.initModel(sequelize);
    const schedules = schedules_1.schedules.initModel(sequelize);
    const tags = tags_1.tags.initModel(sequelize);
    const users = users_1.users.initModel(sequelize);
    const verification = verification_1.verification.initModel(sequelize);
    recordings.belongsTo(groups, { as: "Group", foreignKey: "GroupID" });
    groups.hasMany(recordings, { as: "recordings", foreignKey: "GroupID" });
    schedules.belongsTo(groups, { as: "Group", foreignKey: "GroupID" });
    groups.hasMany(schedules, { as: "schedules", foreignKey: "GroupID" });
    groups.belongsTo(users, { as: "GroupLeader", foreignKey: "GroupLeaderID" });
    users.hasMany(groups, { as: "groups", foreignKey: "GroupLeaderID" });
    verification.belongsTo(users, { as: "User", foreignKey: "UserID" });
    users.hasMany(verification, { as: "verifications", foreignKey: "UserID" });
    return {
        groups: groups,
        recordings: recordings,
        schedules: schedules,
        tags: tags,
        users: users,
        verification: verification,
    };
}
exports.initModels = initModels;
