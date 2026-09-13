'use strict';

module.exports = function create(deps) {
var APPEAL_LINK = "> <qqbot-cmd-input text=\"请复制到微信打开 https://qm.qq.com/q/PyhpuiE1EG\" show=\"如果对处罚结果有异议请点我\"/>";
var identityCheck = {
  isExempt(_0x1fda2d, _0x5055c3) {
    return _0x5055c3.includes(_0x1fda2d.userId);
  },
  checkIdentity(_0x5a9d61, _0x20ef71, _0xb62aab = []) {
    if (this.isExempt(_0x5a9d61, _0xb62aab)) {
      return {
        allowed: true,
        level: "L0",
        costMultiplier: 1,
        signinMultiplier: 1
      };
    }
    const _0x1d24bc = deps.riskStore.getEffectiveLevel(_0x5a9d61.userId);
    const _0x570170 = deps.riskStore.getExpiresAt(_0x5a9d61.userId);
    const _0x1cd172 = _0x570170 ? "\n限制至：" + new Date(_0x570170).toLocaleString() : "";
    const _0x4e5434 = "<@" + _0x5a9d61.userId + "> ";
    switch (_0x1d24bc) {
      case "L0":
        return {
          allowed: true,
          level: _0x1d24bc,
          costMultiplier: 1,
          signinMultiplier: 1
        };
      case "L1":
        if (_0x20ef71 === "user_query") {
          return {
            allowed: false,
            level: _0x1d24bc,
            costMultiplier: 2,
            signinMultiplier: 0.5,
            message: _0x4e5434 + "冷却中：「用户查询」暂不可用。\n其余查询可继续（消耗×2），签到收益减半。" + _0x1cd172 + "\n" + APPEAL_LINK
          };
        }
        return {
          allowed: true,
          level: _0x1d24bc,
          costMultiplier: 2,
          signinMultiplier: 0.5
        };
      case "L2":
        return {
          allowed: false,
          level: _0x1d24bc,
          costMultiplier: 1,
          signinMultiplier: 1,
          message: _0x4e5434 + "使用受限：当前禁用所有查询与签到功能。" + _0x1cd172 + "\n" + APPEAL_LINK
        };
      case "L3":
      case "L4":
        return {
          allowed: false,
          level: _0x1d24bc,
          costMultiplier: 1,
          signinMultiplier: 1,
          message: _0x4e5434 + "检测到异常行为，已限制使用：所有功能暂停。" + _0x1cd172 + "\n期满后可申请恢复。\n" + APPEAL_LINK
        };
    }
  }
};
return { get APPEAL_LINK() { return APPEAL_LINK; }, set APPEAL_LINK(value) { APPEAL_LINK = value; },
get identityCheck() { return identityCheck; }, set identityCheck(value) { identityCheck = value; } };
};
