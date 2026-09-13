'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/解除绑定").action(async ({
  session: _0x3a11ab
}) => {
  if (_0x3a11ab.guildId) {
    await deps.Chat.send(_0x3a11ab, "<@" + _0x3a11ab.userId + "> 请在私聊状态下执行此命令。\n> tip: 点击机器人头像，选择 \"发消息\" or \"添加使用\"。即可添加机器人为好友进行私聊对话", undefined, deps.kb.unbindLink());
    return;
  }
  await deps.userLocal.startRemoveBind(_0x3a11ab);
});
return {  };
};
