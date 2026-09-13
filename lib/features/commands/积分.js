'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/积分").userFields(["id"]).action(async ({
  session: _0x297148
}) => {
  if (await deps.legacyBan.verify(_0x297148)) {
    return;
  }
  if (!(await deps._0x3e2295(_0x297148))) {
    return;
  }
  const _0xf1f0c9 = await deps.pointsStore.syncBalance(_0x297148);
  const _0x47482d = deps.getPrivilege(_0xf1f0c9.level);
  const _0x26b90d = _0xf1f0c9.level >= 7 ? 1250 : deps.expToNext(_0xf1f0c9.level);
  const _0x381d71 = deps.getDailyQueryState(_0x297148.userId);
  const _0x13913f = _0x47482d.dailyQueryLimit === Infinity ? "无限" : _0x47482d.dailyQueryLimit;
  const _0x2092e6 = _0x47482d.freeQuota === Infinity ? "无限" : _0x47482d.freeQuota;
  let _0x466358 = "";
  if (deps.config.useRiskControl) {
    const _0x48654b = deps.riskControl.level(_0x297148.userId);
    if (_0x48654b !== "L0") {
      _0x466358 = "\n风控状态：" + _0x48654b + "（不影响等级与经验）";
    }
  }
  const _0x48a8b1 = _0x381d71 ? _0x47482d.freeQuota === Infinity ? "无限" : Math.max(0, _0x47482d.freeQuota - _0x381d71.freeUsed) : _0x2092e6;
  await deps.Chat.send(_0x297148, "![img #23px #23px](https://q.qlogo.cn/qqapp/102801826/" + _0x297148.userId + "/100) <@" + _0x297148.userId + "> \n- R点余额：**" + _0xf1f0c9.currentPoints + "** 点\n- 当前等级：**" + deps.getLevelLabel(_0xf1f0c9.level) + "**\n- 经验进度：**" + _0xf1f0c9.expIntoLevel + " / " + _0x26b90d + "**\n- 今日查询：" + (_0x381d71 ? _0x381d71.todayCount : 0) + " / " + _0x13913f + "\u3000\n- 免积分查询次数剩余 " + _0x48a8b1 + "\n- 单次消耗：" + _0x47482d.queryCost + " R点" + _0x466358 + "\n\n---\n\n> 提示：R点为消耗货币，经验值决定用户等级，两者独立。\n> <qqbot-cmd-input text=\"/签到\" show=\"/签到\"/> 领R点+经验\n> <qqbot-cmd-input text=\"/兑换经验\" show=\"/兑换经验\"/> 数量 (将R点兑换为经验值)\n> <qqbot-cmd-input text=\"/等级\" show=\"/等级\"/> 查看等级进度", "🪙 R点余额：" + _0xf1f0c9.currentPoints + " 点\n🎖 当前等级：" + deps.getLevelLabel(_0xf1f0c9.level) + "\n📈 经验进度：" + _0xf1f0c9.expIntoLevel + " / " + _0x26b90d + "\n📊 今日查询：" + (_0x381d71 ? _0x381d71.todayCount : 0) + " / " + _0x13913f + "\u3000免积分剩 " + _0x48a8b1 + "\n💸 单次消耗：" + _0x47482d.queryCost + " R点" + _0x466358 + "\n━━━━━━━━━━━━━━\n提示：R点为消耗券，经验值决定等级，两者独立。\n/签到 领R点+经验\u3000/兑换经验 <数量>\u3000/等级 看进度", deps.kb.pointsPanel());
});
return {  };
};
