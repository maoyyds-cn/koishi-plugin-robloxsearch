'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/增减经验 <userId> <delta:number>").action(async ({
  session: _0x4f6e24
}, _0x198a5d, _0x1b0568) => {
  if (!(await deps.requirePerm(_0x4f6e24, "points.grant", "增减经验", "目标：" + (_0x198a5d || "未提供") + "，变动：" + (_0x1b0568 ?? "未提供")))) {
    return;
  }
  if (!_0x198a5d || _0x1b0568 == null || isNaN(_0x1b0568)) {
    await deps.Chat.send(_0x4f6e24, "<@" + _0x4f6e24.userId + "> 用法：<qqbot-cmd-input text=\"/增减经验\" show=\"/增减经验\"/> <用户ID> <数量，负数为扣>", undefined, deps.kb.adminPanel());
    return;
  }
  const _0x5e91da = await deps.pointsAdmin.changeExp(_0x198a5d, Math.floor(_0x1b0568));
  await deps.logOp(_0x4f6e24, "增减经验", "目标：" + _0x198a5d + "，变动：" + Math.floor(_0x1b0568) + "，结果：" + _0x5e91da.split("\n")[0]);
  await deps.Chat.send(_0x4f6e24, deps.avatarAt(_0x4f6e24.userId) + " ✅**执行成功！**\n- " + _0x5e91da.split("\n").join("\n- "), _0x5e91da, deps.kb.adminPanel());
});
return {  };
};
