'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/删除管理员 <userId>").action(async ({
  session: _0x5fdd75
}, _0xa9b17e) => {
  if (await deps.legacyBan.verify(_0x5fdd75)) {
    return;
  }
  if (!(await deps.requirePerm(_0x5fdd75, "role.manage", "删除管理员", "目标：" + (_0xa9b17e || "未提供")))) {
    return;
  }
  if (!_0xa9b17e || !_0xa9b17e.trim()) {
    await deps.Chat.send(_0x5fdd75, "<@" + _0x5fdd75.userId + "> 请输入对应的管理员 userId");
    return;
  }
  deps.legacyBan.lostAdmin(_0x5fdd75, _0xa9b17e);
  await deps.logOp(_0x5fdd75, "删除管理员（权限变更）", "撤销 " + _0xa9b17e + " 管理员身份");
  await deps.Chat.send(_0x5fdd75, "<@" + _0x5fdd75.userId + "> **删除成功...**", "删除成功...");
});
return {  };
};
