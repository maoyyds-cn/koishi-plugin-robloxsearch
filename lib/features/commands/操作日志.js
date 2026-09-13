'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/操作日志 [count:number]").action(async ({
  session: _0x250cb1
}, _0x4388ce) => {
  if (!(await deps.requirePerm(_0x250cb1, "admin.general", "操作日志"))) {
    return;
  }
  const _0x3da860 = Math.min(Math.max(Math.floor(_0x4388ce || 10), 1), 30);
  const _0x902d71 = await deps.OpLog.list(_0x3da860);
  if (!_0x902d71.length) {
    await deps.sendWithAt(_0x250cb1, "暂无操作日志。");
    return;
  }
  const _0x5205d2 = {
    success: "成功",
    denied: "拒绝",
    failed: "失败"
  };
  const _0x24e938 = _0x902d71.map(_0xf6dec8 => {
    const _0x371a90 = new Date(_0xf6dec8.createdAt).toLocaleString();
    const _0x4778f3 = deps.roleLabelOf(_0xf6dec8.operatorRole);
    return _0x371a90 + "\u3000[" + (_0x5205d2[_0xf6dec8.result] || _0xf6dec8.result) + "] " + _0xf6dec8.action + "\u3000操作人：" + _0xf6dec8.operatorId + "（" + _0x4778f3 + "）\n\u3000\u3000" + _0xf6dec8.detail;
  });
  const _0x2c668a = _0x902d71.map(_0x2faa12 => {
    const _0x12fbb3 = new Date(_0x2faa12.createdAt).toLocaleString();
    const _0x4e3125 = deps.roleLabelOf(_0x2faa12.operatorRole);
    return "| " + _0x12fbb3 + " | " + _0x2faa12.operatorId + " | " + _0x4e3125 + " | " + _0x2faa12.action + " | " + _0x2faa12.detail + " | " + (_0x5205d2[_0x2faa12.result] || _0x2faa12.result) + " |";
  });
  await deps.Chat.send(_0x250cb1, "**最近 " + _0x902d71.length + " 条操作日志：**\n\n| 时间 | 操作人 | 身份 | 操作 | 内容 | 结果 |\n|:---|:---|:---:|:---|:---|:---:|\n" + _0x2c668a.join("\n"), "最近 " + _0x902d71.length + " 条操作日志：\n" + _0x24e938.join("\n"));
});
return {  };
};
