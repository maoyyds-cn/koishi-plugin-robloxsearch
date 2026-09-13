'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/风控状态 <userId>").action(async ({
  session: _0x209a3a
}, _0x3a2376) => {
  if (!(await deps.requirePerm(_0x209a3a, "admin.general", "风控状态", "目标：" + (_0x3a2376 || "未提供")))) {
    return;
  }
  if (!deps.config.useRiskControl) {
    await deps.Chat.send(_0x209a3a, "<@" + _0x209a3a.userId + "> 风控系统未开启。");
    return;
  }
  if (!_0x3a2376) {
    await deps.Chat.send(_0x209a3a, "<@" + _0x209a3a.userId + "> 用法：/风控状态 <用户ID>");
    return;
  }
  const _0x4c5604 = deps.riskAdmin.status(_0x3a2376);
  const _0x3c65c1 = _0x4c5604.split("\n").map(_0x1bfb2f => "- " + _0x1bfb2f).join("\n");
  await deps.Chat.send(_0x209a3a, deps.avatarAt(_0x209a3a.userId) + "\n" + _0x3c65c1 + "\n> <qqbot-cmd-input text=\"请复制到微信打开 https://qm.qq.com/q/PyhpuiE1EG\" show=\"如果对处罚结果有异议请点我\"/>", _0x4c5604, deps.kb.appealLinks());
});
return {  };
};
