'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/违规移除 <targetId> <targetType>").action(async ({
  session: _0x7c2104
}, _0x59a07c, _0x25b02e) => {
  if (!(await deps.requirePerm(_0x7c2104, "admin.general", "违规移除", "目标：" + (_0x59a07c || "未提供") + "(" + (_0x25b02e || "?") + ")"))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x7c2104, "<@" + _0x7c2104.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x59a07c || !["user", "group", "game"].includes(_0x25b02e)) {
    await deps.Chat.send(_0x7c2104, "<@" + _0x7c2104.userId + "> 用法：/违规移除 <目标ID> <user|group|game>");
    return;
  }
  const _0x2f6502 = await deps.riskAdmin.removeTarget(_0x59a07c, _0x25b02e);
  await deps.logOp(_0x7c2104, "违规移除", "目标：" + _0x59a07c + "(" + _0x25b02e + ")，结果：" + _0x2f6502.split("\n")[0]);
  await deps.sendWithAt(_0x7c2104, _0x2f6502);
});
return {  };
};
