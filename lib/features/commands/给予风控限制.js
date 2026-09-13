'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/给予风控限制 <userId>").alias("给予封禁").action(async ({
  session: _0x1b3437
}, _0x259541) => {
  if (await deps.legacyBan.verify(_0x1b3437)) {
    return;
  }
  if (!(await deps.requirePerm(_0x1b3437, "admin.general", "给予风控限制", "目标：" + (_0x259541 || "未提供")))) {
    return;
  }
  if (!_0x259541 || !_0x259541.trim()) {
    await deps.Chat.send(_0x1b3437, "<@" + _0x1b3437.userId + "> 请输入对应的风控限制目标的 userId");
    return;
  }
  await deps.legacyBan.giveBan(_0x1b3437, _0x259541);
  await deps.logOp(_0x1b3437, "给予风控限制", "目标：" + _0x259541);
});
return {  };
};
