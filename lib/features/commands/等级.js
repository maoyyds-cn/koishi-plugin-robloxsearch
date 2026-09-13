'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/等级").userFields(["id"]).action(async ({
  session: _0x3b7cff
}) => {
  if (await deps.legacyBan.verify(_0x3b7cff)) {
    return;
  }
  if (!(await deps._0x3e2295(_0x3b7cff))) {
    return;
  }
  const _0x226739 = await deps.pointsStore.ensure(_0x3b7cff.userId);
  const _0x523077 = deps.PRIVILEGE_TABLE.map(_0x478669 => {
    const _0x322756 = _0x478669.level >= 7 ? "1250/级" : String(deps.expToNext(_0x478669.level));
    const _0x201359 = _0x478669.dailyQueryLimit === Infinity ? "无限" : _0x478669.dailyQueryLimit;
    const _0x268e35 = _0x478669.freeQuota === Infinity ? "无限" : _0x478669.freeQuota;
    const _0x11b91f = _0x478669.cooldownDiscount ? Math.round(_0x478669.cooldownDiscount * 100) + "%" : "0%";
    return "| " + _0x478669.level + " | " + _0x478669.name + " | " + (_0x478669.badge || "—") + " | " + _0x322756 + " | " + _0x201359 + " | " + _0x478669.queryCost + " R点 | " + _0x268e35 + " | " + _0x11b91f + " |";
  }).join("\n");
  await deps.Chat.send(_0x3b7cff, deps.avatarAt(_0x3b7cff.userId) + " \n当前：" + deps.getLevelLabel(_0x226739.level) + "（本级 " + _0x226739.expIntoLevel + " 经验）\n\n| 等级 | 名称 | 徽章 | 升级所需经验 | 每日查询上限 | 单次消耗 | 免积分额度 | 冷却减免 |\n|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n" + _0x523077 + "\n> 预计每日 +10 经验（签到5 + 查询5）。", "当前：" + deps.getLevelLabel(_0x226739.level) + "（本级 " + _0x226739.expIntoLevel + " 经验）\n━━━━━━━━━━━━━━\n" + deps.describeLevels() + "\n━━━━━━━━━━━━━━\n理想每日 +10 经验（签到5 + 查询5）。", deps.kb.pointsPanel());
});
return {  };
};
