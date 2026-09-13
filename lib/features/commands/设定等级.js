'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/设定等级 <userId> <level:number>").action(async ({
  session: _0x280b4f
}, _0x18e11c, _0x216afb) => {
  if (!(await deps.requirePerm(_0x280b4f, "admin.general", "设定等级", "目标：" + (_0x18e11c || "未提供") + "，等级：" + (_0x216afb ?? "未提供")))) {
    return;
  }
  if (!_0x18e11c || _0x216afb == null || isNaN(_0x216afb)) {
    await deps.Chat.send(_0x280b4f, "<@" + _0x280b4f.userId + "> 用法：<qqbot-cmd-input text=\"/设定等级\" show=\"/设定等级\"/> <用户ID> <等级>（本级经验归零）", undefined, deps.kb.adminPanel());
    return;
  }
  const _0x100cd2 = await deps.pointsAdmin.setLevel(_0x18e11c, Math.floor(_0x216afb));
  await deps.logOp(_0x280b4f, "设定等级", "目标：" + _0x18e11c + "，等级：" + Math.floor(_0x216afb) + "，结果：" + _0x100cd2.split("\n")[0]);
  await deps.Chat.send(_0x280b4f, deps.avatarAt(_0x280b4f.userId) + " ✅**执行成功！**\n- " + _0x100cd2.split("\n").join("\n- "), _0x100cd2, deps.kb.adminPanel());
});
return {  };
};
