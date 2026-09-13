'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/给予长期风控 <userId>").alias("给予永封").action(async ({
  session: _0x5514c3
}, _0x1a4f6d) => {
  if (await deps.legacyBan.verify(_0x5514c3)) {
    return;
  }
  if (!(await deps.requirePerm(_0x5514c3, "admin.general", "给予长期风控", "目标：" + (_0x1a4f6d || "未提供")))) {
    return;
  }
  if (!_0x1a4f6d || !_0x1a4f6d.trim()) {
    await deps.Chat.send(_0x5514c3, "<@" + _0x5514c3.userId + "> 请输入对应的风控限制目标的 userId");
    return;
  }
  deps.legacyBan.giveBan(_0x5514c3, _0x1a4f6d, true);
  await deps.logOp(_0x5514c3, "给予长期风控", "目标：" + _0x1a4f6d);
});
return {  };
};
