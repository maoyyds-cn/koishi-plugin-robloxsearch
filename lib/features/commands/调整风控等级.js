'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/调整风控等级 <userId> <level> [days:number]").action(async ({
  session: _0x1c8dc3
}, _0x141569, _0x43dc35, _0x23e907) => {
  if (!(await deps.requirePerm(_0x1c8dc3, "risk.adjust", "调整风控等级", "目标：" + (_0x141569 || "未提供") + "，等级：" + (_0x43dc35 || "未提供")))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x1c8dc3, "<@" + _0x1c8dc3.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x141569 || !_0x43dc35) {
    await deps.Chat.send(_0x1c8dc3, "<@" + _0x1c8dc3.userId + "> 用法：/调整风控等级 <用户ID> <L0|L1|L2|L3|L4> [天数]");
    return;
  }
  const _0x3574b7 = await deps.riskAdmin.setLevel(_0x141569, _0x43dc35, _0x23e907);
  if (_0x3574b7.startsWith("等级无效")) {
    await deps.logOp(_0x1c8dc3, "调整风控等级", "目标：" + _0x141569 + "，等级：" + _0x43dc35 + "，结果：" + _0x3574b7, "failed");
    await deps.Chat.send(_0x1c8dc3, "<@" + _0x1c8dc3.userId + "> " + _0x3574b7);
  } else {
    await deps.logOp(_0x1c8dc3, "调整风控等级", "目标：" + _0x141569 + "，等级：" + _0x43dc35 + (_0x23e907 ? "，天数：" + _0x23e907 : "") + "，结果：" + _0x3574b7.split("\n")[0]);
    await deps.Chat.send(_0x1c8dc3, deps.avatarAt(_0x1c8dc3.userId) + " ✅**执行成功！**\n" + _0x3574b7, _0x3574b7, deps.kb.adminPanel());
  }
});
return {  };
};
