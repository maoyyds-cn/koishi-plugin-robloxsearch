'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/审核列表").action(async ({
  session: _0x512b5f
}) => {
  if (!(await deps.requirePerm(_0x512b5f, "audit.resolve", "审核列表"))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x512b5f, "<@" + _0x512b5f.userId + "> 风控系统未开启。");
    return;
  }
  const _0x521509 = deps.riskControl.pendingAudits();
  if (!_0x521509.length) {
    await deps.sendWithAt(_0x512b5f, "当前没有待审记录。");
    return;
  }
  const _0x32cb1f = _0x521509.slice(0, 20);
  const _0x215102 = _0x32cb1f.map((_0x56a087, _0x375707) => _0x375707 + 1 + ". [" + _0x56a087.id + "]\n   用户名：" + (_0x56a087.targetName || "—") + "（ID:" + (_0x56a087.robloxUserId || _0x56a087.targetId || "—") + "）\n   简介：" + String(_0x56a087.summary || "—").slice(0, 60) + "\n   触发：" + (_0x56a087.reporterName || _0x56a087.reporterId) + "\u3000" + new Date(_0x56a087.createdAt).toLocaleString());
  const _0x371f79 = _0x32cb1f.map((_0x166405, _0x22d541) => {
    const _0x18aa80 = (_0x166405.targetName || "—") + "（ID:" + (_0x166405.robloxUserId || _0x166405.targetId || "—") + "）";
    const _0x23b881 = "<qqbot-cmd-input text=\"/审核处理 " + _0x166405.id + " 违规\" show=\"违规\"/>";
    const _0x3d2deb = "<qqbot-cmd-input text=\"/审核处理 " + _0x166405.id + " 不违规\" show=\"不违规\"/>";
    return ["" + (_0x22d541 + 1), deps._0x37bc0d(_0x166405.id), deps._0x37bc0d(_0x18aa80), deps._0x37bc0d(_0x166405.summary), deps._0x37bc0d(_0x166405.reporterName || _0x166405.reporterId), deps._0x37bc0d(new Date(_0x166405.createdAt).toLocaleString()), _0x23b881 + " / " + _0x3d2deb].join(" | ");
  });
  await deps.Chat.send(_0x512b5f, "**待审 " + _0x521509.length + " 条：**\n\n| # | 审核ID | 目标用户 | 简介 | 触发者 | 触发时间 | 审核 |\n| --- | --- | --- | --- | --- | --- | --- |\n" + _0x371f79.map(_0xe1b762 => "| " + _0xe1b762 + " |").join("\n"), "待审 " + _0x521509.length + " 条：\n" + _0x215102.join("\n") + "\n\n用 /审核处理 <ID> <违规|不违规> 裁决", deps.kb.auditList(_0x521509.map(_0x585386 => _0x585386.id)));
});
return {  };
};
