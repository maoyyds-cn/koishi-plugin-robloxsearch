'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/兑换经验 <exp:number>").userFields(["id"]).action(async ({
  session: _0xedda2e
}, _0x2bda93) => {
  if (await deps.legacyBan.verify(_0xedda2e)) {
    return;
  }
  if (!(await deps._0x3e2295(_0xedda2e))) {
    return;
  }
  const _0x145055 = await deps.buyExp(_0xedda2e, _0x2bda93);
  if (!_0x145055.ok) {
    await deps.sendWithAt(_0xedda2e, _0x145055.message);
    return;
  }
  const _0x3bdcbf = await deps.pointsStore.ensure(_0xedda2e.userId);
  // 命中每日上限时实际发放的经验可能少于请求数，按实际发放量提示
  const _0x5a1e37 = _0x145055.grantedExp ?? Math.floor(_0x2bda93);
  const _0x1f8c60 = _0x145055.trimmed ? "（已达今日兑换上限，仅发放 " + _0x5a1e37 + " 经验）" : "";
  await deps.Chat.send(_0xedda2e, "<@" + _0xedda2e.userId + "> 兑换成功：消耗 " + _0x145055.cost + " R点 → +" + _0x5a1e37 + " 经验" + _0x1f8c60 + "\n> 当前：" + deps.getLevelLabel(_0x3bdcbf.level) + "（本级 " + _0x3bdcbf.expIntoLevel + " 经验）", "兑换成功：消耗 " + _0x145055.cost + " R点 → +" + _0x5a1e37 + " 经验" + _0x1f8c60 + "\n当前：" + deps.getLevelLabel(_0x3bdcbf.level) + "（本级 " + _0x3bdcbf.expIntoLevel + " 经验）", deps.kb.pointsPanelExchange());
  if (_0x145055.leveledUp.length) {
    await deps.points.onLevelUp(_0xedda2e, _0x145055.leveledUp);
  }
});
return {  };
};
