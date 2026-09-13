'use strict';

module.exports = function create(deps) {
deps.ctx.on("guild-member-added", async _0xmember => {
  console.log("[welcome] event fired", _0xmember?.platform, _0xmember?.userId, typeof _0xmember);
  try {
    const _0xsession = _0xmember?.session || _0xmember;
    if (!_0xsession) {
      console.log("[welcome] no session, abort");
      return;
    }
    const _0xplatform = _0xsession.platform;
    console.log("[welcome] platform:", _0xplatform, "useWelcome:", !!deps.config.useWelcome);
    if (!deps.config.useWelcome || _0xplatform !== "qq") {
      return;
    }
    const _0xatId = _0xsession.userId || _0xsession?.event?.member?.user?.id || _0xsession?.event?.user?.id;
    console.log("[welcome] event keys:", Object.keys(_0xsession?.event || {}));
    console.log("[welcome] event.guild:", _0xsession?.event?.guild?.id, "event.channel:", _0xsession?.event?.channel?.id, "event.member.user:", _0xsession?.event?.member?.user?.id, "event.user:", _0xsession?.event?.user?.id);
    console.log("[welcome] atId:", _0xatId);
    const _0xmdText = "## 🎉 欢迎 <qqbot-at-user id=\"" + _0xatId + "\"/> 入群！\n\n> 欢迎加入Roblox群聊！\n\n### 📌 新人必读\n- 请先查看群公告，了解基本规则\n- 禁止广告、色情、刷屏、引战\n- 有问题直接 @群主 或 @管理员\n\n---\n\n<qqbot-cmd-input text=\"/菜单\" show=\"点我查看所有功能\"/>";
    const _0xplain = "欢迎 <at id=\"" + _0xatId + "\"/> 入群！\n\n新人必读\n- 请先查看群公告，了解基本规则\n- 禁止广告、色情、刷屏、引战\n- 有问题直接 @群主 或 @管理员\n\n回复 /菜单 查看所有功能";
    const _0xkb = deps.keyboard([deps.callbackButton("点我查看所有功能", "菜单", 4, {
      type: 2
    }), deps.callbackButton("开发中", "开发中", 0, {
      type: 2
    })], [deps.linkButton("前往使用", "https://qm.qq.com/q/SmxHyMFH0s", 4), deps.callbackButton("开发中", "开发中", 0, {
      type: 2
    })]);
    const _0xtargetId = _0xsession.channelId || _0xsession.guildId || _0xsession?.event?.channel?.id || _0xsession?.event?.guild?.id;
    console.log("[welcome] targetId:", _0xtargetId, "session.channelId:", _0xsession.channelId, "session.guildId:", _0xsession.guildId);
    if (!_0xtargetId) {
      console.log("[welcome] no targetId, abort");
      return;
    }
    console.log("[welcome] member keys:", Object.keys(_0xmember || {}));
    console.log("[welcome] member nick:", _0xmember?.nick || _0xmember?.nickname || _0xmember?.name || "none");
    let _0xnick = _0xsession?.event?.member?.nick || _0xsession?.event?.member?.name || _0xsession?.event?.user?.name || _0xmember?.nick || _0xmember?.nickname || _0xmember?.name || "";
    if (!_0xnick) {
      try {
        const _0xuinfo = await _0xsession.bot.getGuildMember(_0xtargetId, _0xatId);
        _0xnick = _0xuinfo?.nick || _0xuinfo?.name || "";
      } catch (_0xe) {}
    }
    if (!_0xnick) {
      _0xnick = (_0xatId || "新人").substring ? (_0xatId || "新人").substring(0, 8) : "新人";
    }
    const _0xwelcomeText = "欢迎 " + _0xnick + " 入群！\n\n新人必读\n- 请先查看群公告，了解基本规则\n- 禁止广告、色情、刷屏、引战\n- 有问题直接 @群主 或 @管理员\n\n回复 /菜单 查看所有功能";
    try {
      await _0xsession.bot.sendMessage(_0xtargetId, _0xwelcomeText);
      console.log("[welcome] sent OK, nick:", _0xnick);
    } catch (_0xsendErr) {
      console.log("[welcome] bot.sendMessage failed:", _0xsendErr?.message || String(_0xsendErr));
    }
  } catch (_0xerr) {
    console.log("[welcome] error", _0xerr);
  }
});
return {  };
};
