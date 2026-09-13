'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/违规添加 <targetId> <targetType> [name] [reason:text]").action(async ({
  session: _0x1772f9
}, _0x84308a, _0x4b56eb, _0x4fd024, _0x534705) => {
  if (!(await deps.requirePerm(_0x1772f9, "admin.general", "违规添加", "目标：" + (_0x84308a || "未提供") + "(" + (_0x4b56eb || "?") + ")"))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x1772f9, "<@" + _0x1772f9.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x84308a || !["user", "group", "game"].includes(_0x4b56eb)) {
    await deps.Chat.send(_0x1772f9, "<@" + _0x1772f9.userId + "> 用法：/违规添加 <目标ID> <user|group|game> [名称] [原因]");
    return;
  }
  const _0x117f17 = await deps.riskAdmin.addTarget(_0x84308a, _0x4b56eb, _0x4fd024, _0x534705);
  await deps.logOp(_0x1772f9, "违规添加", "目标：" + _0x84308a + "(" + _0x4b56eb + ")，原因：" + (_0x534705 || "无") + "，结果：" + _0x117f17.split("\n")[0]);
  await deps.Chat.send(_0x1772f9, deps.avatarAt(_0x1772f9.userId) + " ✅**执行成功！**\n" + _0x117f17, _0x117f17, deps.kb.adminPanel());
});
return {  };
};
