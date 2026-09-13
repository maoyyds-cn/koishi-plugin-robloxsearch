'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/流水 [ledger]").userFields(["id"]).action(async ({
  session: _0x196785
}, _0x93732d) => {
  if (await deps.legacyBan.verify(_0x196785)) {
    return;
  }
  if (!(await deps._0x3e2295(_0x196785))) {
    return;
  }
  const _0x16e85a = _0x93732d === "经验" || _0x93732d === "exp" ? "exp" : _0x93732d === "R点" || _0x93732d === "points" ? "points" : undefined;
  const _0x1dbe07 = await deps.transactionStore.list(_0x196785.userId, 10, _0x16e85a);
  if (!_0x1dbe07.length) {
    await deps.Chat.send(_0x196785, "暂无流水记录。");
    return;
  }
  const _0x243012 = _0x16e85a ? "（" + (_0x16e85a === "exp" ? "经验" : "R点") + "）" : "";
  const _0xb63b4b = _0x1dbe07.map(_0x1f93e3 => {
    const _0x163dac = new Date(_0x1f93e3.timestamp).toLocaleString();
    const _0x3f4ca6 = _0x1f93e3.ledger === "exp" ? "经验" : "R点";
    const _0x2b7f28 = _0x1f93e3.amount >= 0 ? "+" : "";
    const _0x74d7c7 = _0x1f93e3.remark ? "\u3000" + _0x1f93e3.remark : "";
    return _0x163dac + "\u3000" + (deps._0x2233fa[_0x1f93e3.source] || _0x1f93e3.source) + "\u3000" + _0x2b7f28 + _0x1f93e3.amount + _0x3f4ca6 + "（余 " + _0x1f93e3.balanceAfter + "）" + _0x74d7c7;
  });
  const _0x362230 = _0x1dbe07.map(_0x4f4a44 => {
    const _0x38e2e5 = new Date(_0x4f4a44.timestamp).toLocaleString();
    const _0x4c0fd9 = _0x4f4a44.ledger === "exp" ? "经验" : "R点";
    const _0x53d1db = _0x4f4a44.amount >= 0 ? "+" : "";
    return "| " + _0x38e2e5 + " | " + (deps._0x2233fa[_0x4f4a44.source] || _0x4f4a44.source) + " | " + _0x53d1db + _0x4f4a44.amount + _0x4c0fd9 + " | " + _0x4f4a44.balanceAfter + " | " + (_0x4f4a44.remark || "-") + " |";
  });
  await deps.Chat.send(_0x196785, "![img #23px #23px](https://q.qlogo.cn/qqapp/102801826/" + _0x196785.userId + "/100) <@" + _0x196785.userId + "> \n**最近 " + _0x1dbe07.length + " 条流水" + _0x243012 + "：**\n\n| 时间 | 来源 | 变动 | 余额 | 备注 |\n|:---|:---:|---:|---:|:---|\n" + _0x362230.join("\n"), "最近 " + _0x1dbe07.length + " 条流水" + _0x243012 + "：\n" + _0xb63b4b.join("\n"), deps.kb.pointsPanelSecondary());
});
return {  };
};
