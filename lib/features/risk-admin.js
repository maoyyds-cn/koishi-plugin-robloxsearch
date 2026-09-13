'use strict';

module.exports = function create(deps) {
var VALID_LEVELS = ["L0", "L1", "L2", "L3", "L4"];
var riskAdmin = {
  async addTarget(_0xd44746, _0xb07805, _0x358005, _0x10b1d2) {
    if (!_0xd44746) {
      return "请提供目标 ID。";
    }
    const _0x1bd32b = await deps.violationLib.add({
      targetId: _0xd44746,
      targetType: _0xb07805,
      targetName: _0x358005,
      violationReason: _0x10b1d2 || "管理员手动加入",
      addedBy: "manual"
    });
    return "已加入违规库：[" + _0xb07805 + "] " + _0x1bd32b.targetName + "（" + _0xd44746 + "）\n原因：" + _0x1bd32b.violationReason;
  },
  async removeTarget(_0x59f870, _0x1a7b00) {
    const _0x408555 = await deps.violationLib.remove(_0x59f870, _0x1a7b00);
    if (_0x408555) {
      return "已从违规库移除：[" + _0x1a7b00 + "] " + _0x59f870;
    } else {
      return "违规库中未找到：[" + _0x1a7b00 + "] " + _0x59f870;
    }
  },
  async setLevel(_0x299640, _0x6a8ff0, _0xa4fefe) {
    const _0x4d9a80 = _0x6a8ff0?.toUpperCase();
    if (!VALID_LEVELS.includes(_0x4d9a80)) {
      return "等级无效，应为 " + VALID_LEVELS.join("/") + "。";
    }
    return deps.riskStore.adminSetLevel(_0x299640, _0x4d9a80, _0xa4fefe);
  },
  async clear(_0xeb208b) {
    return deps.riskStore.adminClear(_0xeb208b);
  },
  status(_0x3e518d) {
    const _0x4835f6 = deps.riskStore.getEffectiveLevel(_0x3e518d);
    const _0x21cd42 = deps.riskStore.get(_0x3e518d);
    if (!_0x21cd42) {
      return _0x3e518d + "：无风控记录（L0 正常）。";
    }
    const _0x44141b = deps.riskStore.getExpiresAt(_0x3e518d);
    const _0x49be90 = Object.entries(_0x21cd42.violationCounts).filter(([, _0x3f7baa]) => _0x3f7baa.total > 0).map(([_0x597e61, _0x43dfeb]) => deps.riskStore.typeName(_0x597e61) + "×" + _0x43dfeb.total).join("、") || "无";
    return "用户 " + _0x3e518d + " 风控状态\n当前等级：" + _0x4835f6 + "\n生效至：" + (_0x44141b ? new Date(_0x44141b).toLocaleString() : "—") + "\n历史违规：" + _0x49be90 + "\n活跃处罚数：" + _0x21cd42.activeRestrictions.length;
  }
};
return { get VALID_LEVELS() { return VALID_LEVELS; }, set VALID_LEVELS(value) { VALID_LEVELS = value; },
get riskAdmin() { return riskAdmin; }, set riskAdmin(value) { riskAdmin = value; } };
};
