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
  await deps.Chat.send(_0xedda2e, "<@" + _0xedda2e.userId + "> 兑换成功：消耗 " + _0x145055.cost + " R点 → +" + Math.floor(_0x2bda93) + " 经验\n> 当前：" + deps.getLevelLabel(_0x3bdcbf.level) + "（本级 " + _0x3bdcbf.expIntoLevel + " 经验）", "兑换成功：消耗 " + _0x145055.cost + " R点 → +" + Math.floor(_0x2bda93) + " 经验\n当前：" + deps.getLevelLabel(_0x3bdcbf.level) + "（本级 " + _0x3bdcbf.expIntoLevel + " 经验）", deps.kb.pointsPanelExchange());
  if (_0x145055.leveledUp.length) {
    await deps.points.onLevelUp(_0xedda2e, _0x145055.leveledUp);
  }
});
return {  };
};
