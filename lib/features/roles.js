'use strict';

module.exports = function create(deps) {
var ROLE_LABEL = {
  developer: "开发者",
  admin: "管理员",
  assistAdmin: "协助管理员",
  sponsor: "赞助用户",
  user: "普通用户"
};
function roleLabelOf(_0x81a3fb) {
  return ROLE_LABEL[_0x81a3fb] || _0x81a3fb;
}
var ROLE_PERMISSIONS = {
  developer: ["points.grant", "role.manage", "admin.general", "audit.resolve", "risk.adjust"],
  admin: ["admin.general", "audit.resolve", "risk.adjust"],
  assistAdmin: ["audit.resolve", "risk.adjust"],
  sponsor: [],
  user: []
};
var Roles = {
  sources: null,
  init(_0x1d75ba) {
    this.sources = _0x1d75ba;
  },
  resolve(_0x4fcc72) {
    const _0x17dff9 = this.sources;
    if (!_0x17dff9 || !_0x4fcc72) {
      return "user";
    }
    if (_0x17dff9.developerList().includes(_0x4fcc72)) {
      return "developer";
    }
    if (_0x17dff9.adminList().includes(_0x4fcc72) || _0x17dff9.runtimeAdminList().includes(_0x4fcc72)) {
      return "admin";
    }
    if (_0x17dff9.assistAdminList().includes(_0x4fcc72)) {
      return "assistAdmin";
    }
    if (_0x17dff9.sponsorList().includes(_0x4fcc72)) {
      return "sponsor";
    }
    return "user";
  },
  label(_0x335ca2) {
    return ROLE_LABEL[this.resolve(_0x335ca2)];
  },
  has(_0x5b50f9, _0xd392d) {
    return ROLE_PERMISSIONS[this.resolve(_0x5b50f9)].includes(_0xd392d);
  },
  isAdmin(_0x4a70d3) {
    const _0x397cdb = this.resolve(_0x4a70d3);
    return _0x397cdb === "developer" || _0x397cdb === "admin";
  },
  isStaff(_0x1253ed) {
    const _0x2db11c = this.resolve(_0x1253ed);
    return _0x2db11c === "developer" || _0x2db11c === "admin" || _0x2db11c === "assistAdmin";
  }
};
return { get ROLE_LABEL() { return ROLE_LABEL; }, set ROLE_LABEL(value) { ROLE_LABEL = value; },
get roleLabelOf() { return roleLabelOf; },
get ROLE_PERMISSIONS() { return ROLE_PERMISSIONS; }, set ROLE_PERMISSIONS(value) { ROLE_PERMISSIONS = value; },
get Roles() { return Roles; }, set Roles(value) { Roles = value; } };
};
