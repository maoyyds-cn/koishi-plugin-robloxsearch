'use strict';

module.exports = function create(deps) {
var DAY = 86400000;
function calculateDailySignIn(_0x1c49e2, _0x5d887d) {
  const _0xbf01ff = _0x1c49e2 ? 15 : 10;
  let _0x31a1e0 = 0;
  if (_0x5d887d >= 7) {
    _0x31a1e0 = 15;
  } else if (_0x5d887d >= 2) {
    _0x31a1e0 = (_0x5d887d - 1) * 2;
  }
  return _0xbf01ff + _0x31a1e0;
}
async function guardSignin(session, config) {
  if (config?.useSignin) return true;
  await deps.Chat.send(session, "签到目前暂时未开放...");
  return false;
}
async function doSignIn(_0x47cb6c, _0x1b9e87 = {}) {
  if (!(await guardSignin(_0x47cb6c, deps.pointsStore.config))) return;
  const _0x22d5fc = _0x1b9e87.multiplier ?? 1;
  const _0x4bdfd6 = _0x1b9e87.signinExp ?? 5;
  const _0x38bb89 = await deps.pointsStore.syncBalance(_0x47cb6c);
  const _0x34c194 = new Date();
  const _0x1e4c35 = _0x34c194.toLocaleDateString();
  const _0xf144c3 = _0x38bb89.signIn.lastSignInAt ? new Date(_0x38bb89.signIn.lastSignInAt).toLocaleDateString() : "";
  if (_0x1e4c35 === _0xf144c3) {
    await deps.Chat.send(_0x47cb6c, "<@" + _0x47cb6c.userId + "> 你已经签到过了，请明日再来", "你已经签到过了，请明日再来");
    return;
  }
  const _0x5119c1 = new Date(Date.now() - DAY).toLocaleDateString();
  const _0x519b00 = _0xf144c3 === _0x5119c1 ? _0x38bb89.signIn.consecutiveDays + 1 : 1;
  const _0x5e553c = [0, 6].includes(_0x34c194.getDay());
  const _0x29d35c = calculateDailySignIn(_0x5e553c, _0x519b00);
  const _0x5688be = Math.round(_0x29d35c * _0x22d5fc);
  const _0x53f435 = Math.round(_0x4bdfd6 * _0x22d5fc);
  _0x38bb89.signIn.lastSignInAt = Date.now();
  _0x38bb89.signIn.consecutiveDays = _0x519b00;
  _0x38bb89.signIn.totalSignIns += 1;
  await deps.pointsStore.changePoints(_0x47cb6c, _0x5688be, "signin", "连续" + _0x519b00 + "天");
  const {
    leveledUp: _0xba392f
  } = deps.applyExp(_0x38bb89, _0x53f435);
  await deps.pointsStore.recordExp(_0x38bb89, _0x53f435, "signin");
  await deps.pointsStore.save(_0x47cb6c.userId);
  const _0x46cfe6 = _0x5e553c ? "周末快乐！" : "";
  const _0x3b93e1 = _0x22d5fc < 1 ? "（风控冷却中，收益已减半）" : "";
  await deps.Chat.send(_0x47cb6c, deps.avatarAt(_0x47cb6c.userId) + "\n" + _0x46cfe6 + "每日签到成功\n+**" + _0x5688be + "** R点\n+**" + _0x53f435 + "** 经验\n> 您已连续签到 " + _0x519b00 + " 天 " + _0x3b93e1 + "\n> 当前等级：" + deps.getLevelLabel(_0x38bb89.level) + "（" + _0x38bb89.expIntoLevel + " 经验）", _0x46cfe6 + "每日签到成功" + _0x3b93e1 + "\n+" + _0x5688be + " R点（连续 " + _0x519b00 + " 天）\n+" + _0x53f435 + " 经验\u3000当前：" + deps.getLevelLabel(_0x38bb89.level) + "（" + _0x38bb89.expIntoLevel + " 经验）", deps.kb.pointsPanel());
  if (_0xba392f.length && _0x1b9e87.onLevelUp) {
    await _0x1b9e87.onLevelUp(_0xba392f);
  }
}
return { get DAY() { return DAY; }, set DAY(value) { DAY = value; },
get calculateDailySignIn() { return calculateDailySignIn; },
get guardSignin() { return guardSignin; },
get doSignIn() { return doSignIn; } };
};
