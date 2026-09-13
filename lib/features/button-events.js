'use strict';

module.exports = function create(deps) {
deps.ctx.on("interaction/button", async _0x436474 => {
  if (_0x436474.platform !== "qq") {
    return;
  }
  const _0x13d5ba = _0x436474.event?.button;
  const _0x25ac66 = _0x13d5ba?.data ?? _0x13d5ba?.id;
  if (!_0x25ac66) {
    return;
  }
  const _0x16ad4c = _0x436474.event?._data?.d?.id;
  const _0xeventId = _0x436474.event?._data?.id;
  if (_0x16ad4c) {
    _0x436474.eventId = _0xeventId || _0x16ad4c;
    console.log("[button] interaction id:", _0x16ad4c, "event id:", _0xeventId);
    if (_0x436474.bot.internal?.acknowledgeInteraction) {
      Promise.resolve(_0x436474.bot.internal.acknowledgeInteraction(_0x16ad4c, { code: 0 })).catch(() => {});
    }
  }
  console.log("[button] click:", _0x25ac66);
  if (_0x25ac66 && _0x25ac66.indexOf("投诉社群") === 0) {
    try {
      await _0x436474.send("投诉社群请填写以下表单：\nhttps://docs.qq.com/form/page/DYUR5VkVwdUp4eVdh");
    } catch (_0xe) {
      console.log("[button] send failed:", _0xe && _0xe.message);
    }
    return;
  }
  const _0x1006e4 = {
    菜单: "菜单",
    签到: "签到",
    流水: "流水",
    随机top音乐id: "随机TOP音乐ID",
    社群推荐: "社群推荐",
    报名推荐社群: "报名推荐社群"
  };
  const _0x1eaf00 = _0x1006e4[_0x25ac66];
  if (_0x1eaf00) {
    const _0xraw = _0x436474.event?._data;
    const _0xrawD = _0xraw?.d;
    const _0xmsgId = _0x436474.messageId || _0xraw?.msgid || _0xraw?.msg_id || _0xraw?.data?.message_id || _0xrawD?.context?.message_id || _0xrawD?.data?.message_id || _0xrawD?.message_id || _0xrawD?.message?.id || deps.Chat.messageIdTemp && deps.Chat.messageIdTemp[_0x436474.userId] || "";
    if (_0xmsgId) {
      _0x436474.messageId = _0xmsgId;
    }
    if (_0xrawD && _0xrawD.group_openid) {
      if (!_0x436474.guildId) {
        _0x436474.guildId = _0xrawD.group_openid;
      }
      if (!_0x436474.channelId) {
        _0x436474.channelId = _0xrawD.group_openid;
      }
    }
    console.log("[button] execute:", _0x1eaf00, "msgId:", _0xmsgId || "(none)", "channelId:", _0x436474.channelId || "(none)", "guildId:", _0x436474.guildId || "(none)", "_dKeys:", _0xrawD ? Object.keys(_0xrawD).join(",") : "(none)", "_dDump:", _0xrawD ? JSON.stringify(_0xrawD).substring(0, 500) : "(none)");
    try {
      if (typeof _0x436474.execute === "function") {
        await _0x436474.execute(_0x1eaf00);
        console.log("[button] execute done:", _0x1eaf00);
      } else {
        console.log("[button] no execute method");
        await _0x436474.send("请直接发送指令：" + _0x1eaf00);
      }
    } catch (_0xexecErr) {
      console.log("[button] execute failed:", _0x25ac66, _0xexecErr && _0xexecErr.message);
      try {
        await _0x436474.send("指令执行失败，请直接发送：" + _0x1eaf00);
      } catch (_0xse) {
        console.log("[button] send failed:", _0xse && _0xse.message);
        try {
          const _0xch = _0x436474.channelId || _0x436474.event?.channel?.id;
          if (_0xch) {
            await _0x436474.bot.sendMessage(_0xch, "指令执行失败，请直接发送：" + _0x1eaf00);
          }
        } catch (_0xfe) {
          console.log("[button] all failed:", _0xfe && _0xfe.message);
        }
      }
    }
  } else {
    console.log("[button] no mapping:", _0x25ac66);
  }
});
return {  };
};
