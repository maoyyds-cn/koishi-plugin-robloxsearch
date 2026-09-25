'use strict';

module.exports = function create(deps) {
var qqAppid = "";
function resolveQQAppid(_0x1d0a53) {
  if (qqAppid) {
    return qqAppid;
  }
  const _0x2f0a = _0x1d0a53 && _0x1d0a53.bot && _0x1d0a53.bot.config && _0x1d0a53.bot.config.id;
  if (_0x2f0a) {
    qqAppid = _0x2f0a;
    return qqAppid;
  }
  const _0x5a1b = deps.ctx && deps.ctx.bots ? Object.values(deps.ctx.bots) : [];
  const _0x4c3d = _0x5a1b.find(_0x1b3 => _0x1b3 && _0x1b3.platform === "qq" && _0x1b3.config && _0x1b3.config.id);
  qqAppid = _0x4c3d ? _0x4c3d.config.id : "102801826";
  return qqAppid;
}
function avatarAt(_0x319b08) {
  return "![img #23px #23px](https://q.qlogo.cn/qqapp/" + resolveQQAppid() + "/" + _0x319b08 + "/100) <@" + _0x319b08 + ">";
}
var Chat = {
  config: {},
  ctx: {},
  chache: {},
  messageIdTemp: {},
  async init(_0x435790, _0x425d85) {
    Chat.config = _0x435790;
    Chat.ctx = _0x425d85;
    if (Chat.config.deBug) {
      console.log(Chat.chache);
    }
    _0x425d85.on("message", _0x5746e5 => {
      resolveQQAppid(_0x5746e5);
      if (!Chat.messageIdTemp[_0x5746e5.userId]) {
        Chat.messageIdTemp[_0x5746e5.userId] = {};
      }
      Chat.messageIdTemp[_0x5746e5.userId] = _0x5746e5.messageId;
      Chat.clearMessageIdTemp();
    }, true);
  },
  async send(_0x350dc7, _0x2e782e, _0xda47bf = _0x2e782e, _0x3a685b) {
    if (_0x350dc7.platform !== "qq") {
      await _0x350dc7.send(_0xda47bf);
      return {
        sent: true,
        mode: "text"
      };
    }
    if (Chat.config.useMd) {
      console.log("[Chat.send] msgId:", _0x350dc7.messageId || "(none)", "guildId:", _0x350dc7.guildId || "(none)", "channelId:", _0x350dc7.channelId || "(none)", "userId:", _0x350dc7.userId || "(none)");
      const _0xed0bd2 = _0x350dc7.eventId || _0x350dc7.messageId;
      const _0x54ae3b = _0x350dc7.userId;
      if (Chat.chache[_0xed0bd2] == undefined) {
        Chat.chache[_0xed0bd2] = 0;
      }
      const _0x2d987f = {
        ...(_0x350dc7.eventId ? {
          event_id: _0x350dc7.eventId
        } : {
          msg_id: _0x350dc7.messageId,
          msg_seq: ++Chat.chache[_0xed0bd2] == 1 ? 0 : Chat.chache[_0xed0bd2]
        }),
        msg_type: 2,
        markdown: {
          content: _0x2e782e
        },
        ...(_0x3a685b ? {
          keyboard: _0x3a685b
        } : {})
      };
      if (Chat.chache[_0xed0bd2] > 1) {
        if (Chat.config.deBug) {
          console.log("检测到MD连续发送，尝试递增 msg_seq 再进行再次发送；第" + (Chat.chache[_0xed0bd2] + 1) + "次。");
        }
        if (Chat.chache[_0xed0bd2] > 5) {
          if (Chat.messageIdTemp[_0x54ae3b] && _0x2d987f.msg_id != Chat.messageIdTemp[_0x54ae3b]) {
            if (Chat.config.deBug) {
              console.log("middleware 存在新 mse_id 数据，使用更新数据");
            }
            _0x2d987f.msg_id = Chat.messageIdTemp[_0x54ae3b];
            _0x2d987f.msg_seq = 0;
          } else {
            await _0x350dc7.send(_0xda47bf);
            Chat.clearChache();
            return {
              sent: true,
              mode: "text"
            };
          }
        }
      }
      try {
        if (_0x350dc7.guildId) {
          await _0x350dc7.bot.internal.sendMessage(_0x350dc7.channelId, _0x2d987f);
        } else {
          _0x2d987f.markdown.content = _0x2d987f.markdown.content = _0x2d987f.markdown.content.replace(/<qqbot-at-user[^>]*\/>/g, "");
          await _0x350dc7.bot.internal.sendPrivateMessage(_0x350dc7.userId, _0x2d987f);
        }
        Chat.clearChache();
        return {
          sent: true,
          mode: "markdown"
        };
      } catch (_0xmdErr) {
        console.log("[Chat.send] Markdown 发送失败，回退普通文本", _0xmdErr && _0xmdErr.message, "code:", _0xmdErr && _0xmdErr.code, "body:", _0xmdErr && (_0xmdErr.response?.data ?? _0xmdErr.body ?? _0xmdErr.data) ? JSON.stringify(_0xmdErr.response?.data ?? _0xmdErr.body ?? _0xmdErr.data) : "(none)");
        try {
          await _0x350dc7.send(_0xda47bf);
          Chat.clearChache();
          return {
            sent: true,
            mode: "text"
          };
        } catch {
          Chat.clearChache();
          throw new Error("消息发送失败");
        }
      }
    } else {
      await _0x350dc7.send(_0xda47bf);
      return {
        sent: true,
        mode: "text"
      };
    }
  },
  isUseMd(_0x131fb4) {
    if (_0x131fb4.platform !== "qq") {
      return false;
    }
    if (Chat.chache[_0x131fb4.messageId] == undefined) {
      return true;
    }
    return Chat.chache[_0x131fb4.messageId] <= 5;
  },
  clearChache() {
    const _0x427a28 = Object.keys(Chat.chache);
    if (_0x427a28.length >= 40) {
      delete Chat.chache[_0x427a28[0]];
    }
  },
  clearMessageIdTemp() {
    const _0x4397c5 = Object.keys(Chat.messageIdTemp);
    if (_0x4397c5.length > 150) {
      delete Chat.messageIdTemp[_0x4397c5[0]];
    }
  }
};
return { get avatarAt() { return avatarAt; },
get Chat() { return Chat; }, set Chat(value) { Chat = value; } };
};
