'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/欢迎测试").action(async ({
  session: _0xwelcomeTestSession
}) => {
  const _0xuserId = _0xwelcomeTestSession.userId;
  const _0xauthor = _0xwelcomeTestSession.author || {};
  const _0xeventUser = _0xwelcomeTestSession.event?.user || {};
  const _0xeventMember = _0xwelcomeTestSession.event?.member || {};
  const _0xnick = _0xwelcomeTestSession.username || _0xauthor.name || _0xauthor.nick || _0xauthor.username || _0xeventMember.nick || _0xeventUser.name || _0xuserId;
  const _0xmdText = "## 🎉 欢迎 <qqbot-at-user id=\"" + _0xuserId + "\"/> 入群！\n\n> 欢迎加入Roblox群聊！\n\n### 📌 新人必读\n- 请先查看群公告，了解基本规则\n- 禁止广告、色情、刷屏、引战\n- 有问题直接 @群主 或 @管理员\n\n---\n\n<qqbot-cmd-input text=\"/菜单\" show=\"点我查看所有功能\"/>";
  const _0xplain = "欢迎 " + _0xnick + " 入群！\n\n新人必读\n- 请先查看群公告，了解基本规则\n- 禁止广告、色情、刷屏、引战\n- 有问题直接 @群主 或 @管理员\n\n回复 /菜单 查看所有功能";
  const _0xkb = deps.keyboard([deps.callbackButton("点我查看所有功能", "菜单", 4, {
    type: 2
  }), deps.callbackButton("开发中", "开发中", 0, {
    type: 2
  })], [deps.linkButton("前往使用", "https://qm.qq.com/q/SmxHyMFH0s", 4), deps.callbackButton("开发中", "开发中", 0, {
    type: 2
  })]);
  await deps.Chat.send(_0xwelcomeTestSession, _0xmdText, _0xplain, _0xkb);
  return "";
});
return {  };
};