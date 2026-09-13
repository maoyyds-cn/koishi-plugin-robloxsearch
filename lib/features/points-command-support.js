'use strict';

module.exports = function create(deps) {
const _0x2f3ebb = _0x56bb2c => deps.Roles.isAdmin(_0x56bb2c.userId);
const _0x3e2295 = async _0x35fa76 => {
  if (!deps.config.useExpSystem) {
    await deps.Chat.send(_0x35fa76, "<@" + _0x35fa76.userId + "> [×] 积分/经验体系未开启。", "积分/经验体系未开启。");
    return false;
  }
  return true;
};
const _0x2233fa = {
  signin: "签到",
  query: "查询",
  buy_exp: "兑换经验",
  level_up: "升级奖励",
  violation: "违规扣除",
  admin_grant: "管理员增加",
  admin_deduct: "管理员扣除",
  admin_set_level: "设定等级",
  gift_code: "兑换码",
  activity: "活动"
};
return { get _0x2f3ebb() { return _0x2f3ebb; },
get _0x3e2295() { return _0x3e2295; },
get _0x2233fa() { return _0x2233fa; } };
};
