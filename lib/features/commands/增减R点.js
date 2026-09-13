'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/增减R点 <userId> <delta:number>").action(async ({
  session: _0x4c9e4a
}, _0x476e62, _0x2b1885) => {
  if (!(await deps.requirePerm(_0x4c9e4a, "points.grant", "增减R点", "目标：" + (_0x476e62 || "未提供") + "，变动：" + (_0x2b1885 ?? "未提供")))) {
    return;
  }
  if (!_0x476e62 || _0x2b1885 == null || isNaN(_0x2b1885)) {
    await deps.Chat.send(_0x4c9e4a, "<@" + _0x4c9e4a.userId + "> 用法：<qqbot-cmd-input text=\"/增减R点\" show=\"/增减R点\"/> <用户ID> <数量，负数为扣>", undefined, deps.kb.adminPanel());
    return;
  }
  const _0x2b2e28 = await deps.pointsAdmin.changePoint(_0x476e62, Math.floor(_0x2b1885));
  await deps.logOp(_0x4c9e4a, "增减R点", "目标：" + _0x476e62 + "，变动：" + Math.floor(_0x2b1885) + "，结果：" + _0x2b2e28.split("\n")[0]);
  await deps.Chat.send(_0x4c9e4a, deps.avatarAt(_0x4c9e4a.userId) + " ✅**执行成功！**\n- " + _0x2b2e28.split("\n").join("\n- "), _0x2b2e28, deps.kb.adminPanel());
});
return {  };
};
