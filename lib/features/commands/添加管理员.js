'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/添加管理员 <userId>").action(async ({
  session: _0x1d89d1
}, _0x1814e2) => {
  if (await deps.legacyBan.verify(_0x1d89d1)) {
    return;
  }
  if (!(await deps.requirePerm(_0x1d89d1, "role.manage", "添加管理员", "目标：" + (_0x1814e2 || "未提供")))) {
    return;
  }
  if (!_0x1814e2 || !_0x1814e2.trim()) {
    await deps.Chat.send(_0x1d89d1, "<@" + _0x1d89d1.userId + "> 请输入对应的管理员 userId");
    return;
  }
  await deps.legacyBan.giveAdmin(_0x1d89d1, _0x1814e2);
  await deps.logOp(_0x1d89d1, "添加管理员（权限变更）", "授予 " + _0x1814e2 + " 管理员身份");
  await deps.Chat.send(_0x1d89d1, "<@" + _0x1d89d1.userId + "> **添加成功...**", "添加成功...");
});
return {  };
};
