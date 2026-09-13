'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/解除风控限制 <userId>").alias("给予解封").action(async ({
  session: _0x28e9f2
}, _0x42b149) => {
  if (await deps.legacyBan.verify(_0x28e9f2)) {
    return;
  }
  if (!(await deps.requirePerm(_0x28e9f2, "admin.general", "解除风控限制", "目标：" + (_0x42b149 || "未提供")))) {
    return;
  }
  if (!_0x42b149 || !_0x42b149.trim()) {
    await deps.Chat.send(_0x28e9f2, "<@" + _0x28e9f2.userId + "> 请输入对应的解除风控限制目标的 userId");
    return;
  }
  await deps.legacyBan.lostBan(_0x28e9f2, _0x42b149);
  await deps.logOp(_0x28e9f2, "解除风控限制", "目标：" + _0x42b149);
});
return {  };
};
