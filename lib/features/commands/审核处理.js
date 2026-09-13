'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/审核处理 <id> <verdict>").action(async ({
  session: _0x292963
}, _0x470ff6, _0x4bf850) => {
  if (!(await deps.requirePerm(_0x292963, "audit.resolve", "审核处理", "审核ID：" + (_0x470ff6 || "未提供") + "，裁决：" + (_0x4bf850 || "未提供")))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x292963, "<@" + _0x292963.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x470ff6 || !_0x4bf850) {
    await deps.Chat.send(_0x292963, "<@" + _0x292963.userId + "> 用法：/审核处理 <审核ID> <违规|不违规>");
    return;
  }
  const _0x3fd18e = _0x4bf850 === "违规" || _0x4bf850 === "violation" ? "violation" : _0x4bf850 === "不违规" || _0x4bf850 === "ok" ? "ok" : null;
  if (!_0x3fd18e) {
    await deps.Chat.send(_0x292963, "<@" + _0x292963.userId + "> 裁决参数须为「违规」或「不违规」");
    return;
  }
  const _0x4ec83c = await deps.riskControl.resolveAudit(_0x470ff6, _0x3fd18e, "命令:" + _0x292963.userId);
  await deps.logOp(_0x292963, "审核处理", "审核ID：" + _0x470ff6 + "，裁决：" + _0x4bf850 + "，结果：" + _0x4ec83c.message.split("\n")[0]);
  await deps.sendWithAt(_0x292963, _0x4ec83c.message);
});
return {  };
};
