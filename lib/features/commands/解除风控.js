'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/解除风控 <userId>").action(async ({
  session: _0x14797a
}, _0x2570cf) => {
  if (!(await deps.requirePerm(_0x14797a, "admin.general", "解除风控", "目标：" + (_0x2570cf || "未提供")))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x14797a, "<@" + _0x14797a.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x2570cf) {
    await deps.Chat.send(_0x14797a, "<@" + _0x14797a.userId + "> 用法：/解除风控 <用户ID>");
    return;
  }
  const _0x46038a = await deps.riskAdmin.clear(_0x2570cf);
  await deps.logOp(_0x14797a, "解除风控", "目标：" + _0x2570cf + "，结果：" + _0x46038a.split("\n")[0]);
  await deps.sendWithAt(_0x14797a, _0x46038a);
});
return {  };
};
