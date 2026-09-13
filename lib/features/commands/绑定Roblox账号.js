'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/绑定Roblox账号 <userId>").action(async ({
  session: _0x3cedfb
}, _0x31e0a0) => {
  if (!_0x31e0a0) {
    await deps.Chat.send(_0x3cedfb, "<@" + _0x3cedfb.userId + "> 请输入玩家ID。\n例如：/绑定Roblox账号 用户uid 进行后续绑定验证流程。\n> tip:如若不知道自己的Roblox账号id可以使用 /用户名搜索 来获取");
    return;
  }
  if (isNaN(Number(_0x31e0a0))) {
    await deps.Chat.send(_0x3cedfb, "<@" + _0x3cedfb.userId + "> 操作失败，只能输入 Roblox账号id，\n> tip:如若不知道自己的Roblox账号id可以使用 /用户名搜索 来获取");
    return;
  }
  await deps.userLocal.startBindOperate(_0x3cedfb, "" + Math.floor(Number(_0x31e0a0)));
});
return {  };
};
