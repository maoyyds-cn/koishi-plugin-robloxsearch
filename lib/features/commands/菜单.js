'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/菜单").action(async ({
  session: _0xmenuSession
}) => {
  console.log("[menu] action called, platform:", _0xmenuSession.platform, "useMd:", deps.config.useMd, "msgId:", _0xmenuSession.messageId || "(none)", "guildId:", _0xmenuSession.guildId || "(none)");
  const _0xmdEnabled = deps.config.useMd;
  const _0xplain = "【RobloxSearch 服务中心】\n\n[玩家查询] 用户名搜索 / 用户ID搜索\n[游戏查询] 游戏名搜索 / 游戏ID搜索\n[群组查询] 群组名搜索 / 群组ID搜索\n[关系链] 获取好友列表 / 获取关注列表 / 获取粉丝列表\n\n其他功能：\n· ROBLOX社群列表\n· 签到 / 流水 / 等级 / 积分\n· 我的信息 / 随机音乐\n\n更多功能持续更新中…";
  if (!_0xmdEnabled || _0xmenuSession.platform !== "qq") {
    await _0xmenuSession.send(_0xplain);
    return "";
  }
  const _0xmdText = "## 🎮 RobloxSearch 服务中心\n\n> 免费 Roblox 查询机器人 · 覆盖玩家 / 游戏 / 群组 / 社群\n\n---\n\n### 🔎 玩家查询\n<qqbot-cmd-input text=\"用户名搜索 \" show=\"按用户名查询玩家\"/>\n<qqbot-cmd-input text=\"用户ID搜索 \" show=\"按 ID 查询玩家\"/>\n\n### 🎮 游戏查询\n<qqbot-cmd-input text=\"游戏名搜索 \" show=\"按名称查询游戏\"/>\n<qqbot-cmd-input text=\"游戏ID搜索 \" show=\"按 ID 查询游戏\"/>\n\n### 👥 群组查询\n<qqbot-cmd-input text=\"群组名搜索 \" show=\"按名称查询群组\"/>\n<qqbot-cmd-input text=\"群组ID搜索 \" show=\"按 ID 查询群组\"/>\n\n### 🔗 关系链查询\n<qqbot-cmd-input text=\"获取好友列表 \" show=\"好友列表\"/>\n<qqbot-cmd-input text=\"获取关注列表 \" show=\"关注列表\"/>\n<qqbot-cmd-input text=\"获取粉丝列表 \" show=\"粉丝列表\"/>\n\n### 🧰 其他功能\n<qqbot-cmd-input text=\"ROBLOX社群列表\" show=\"ROBLOX 社群列表\"/>\n<qqbot-cmd-input text=\"签到\" show=\"每日签到\"/> | <qqbot-cmd-input text=\"流水\" show=\"积分流水\"/> | <qqbot-cmd-input text=\"等级\" show=\"我的等级\"/>\n<qqbot-cmd-input text=\"积分\" show=\"我的积分\"/> | <qqbot-cmd-input text=\"我的信息\" show=\"我的信息\"/> | <qqbot-cmd-input text=\"随机音乐\" show=\"随机音乐\"/>\n\n> 💡 点击蓝字快速填充指令 · 更多功能持续更新中…";
  const _0xkb = deps.keyboard(deps.searchRow());
  await deps.Chat.send(_0xmenuSession, _0xmdText, _0xplain, _0xkb);
  return "";
});
return {  };
};
