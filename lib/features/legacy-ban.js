'use strict';

module.exports = function create(deps) {
const legacyBan = {
  adminList: [],
  banList: {},
  banHistory: {},
  phaseDict: [86400, 259200, 604800, 2592000],
  async init() {
    const _0x2becd4 = JSON.parse((await deps.ctx.localstorage.getItem(deps.config.basePath + "/banList")) || "{}");
    const _0x23d6dd = JSON.parse((await deps.ctx.localstorage.getItem(deps.config.basePath + "/adminList")) || "[]");
    const _0x2b11e6 = JSON.parse((await deps.ctx.localstorage.getItem(deps.config.basePath + "/banHistoryList")) || "{}");
    legacyBan.adminList = Array.isArray(_0x23d6dd) ? _0x23d6dd : [];
    legacyBan.banList = _0x2becd4;
    legacyBan.banHistory = _0x2b11e6;
    console.log("黑名单配置项、管理员配置项加载完成：时效黑名单存在" + Object.keys(_0x2becd4).length + "位，子管理员" + legacyBan.adminList.length + "位");
  },
  async verify(_0x5ee437) {
    const _0x1c78ed = legacyBan.updateBanState();
    const _0x363d7c = _0x1c78ed.find(_0x246c3a => _0x246c3a.userId == _0x5ee437.userId);
    if (!_0x363d7c) {
      return false;
    }
    const _0x5e1959 = legacyBan.formatMsg(deps.config.banMsg, _0x363d7c);
    await deps.Chat.send(_0x5ee437, "![img #23px #23px](https://q.qlogo.cn/qqapp/102801826/" + _0x5ee437.userId + "/100) <@" + _0x5ee437.userId + "> \n" + _0x5e1959 + "\n>  如有疑问，[请前往官方频道](https://pd.qq.com/s/a76gdqe0j)联系客服", _0x5e1959, deps.kb.appealLinks());
    return true;
  },
  formatMsg(_0x1b5985, _0x1f7de3) {
    const _0x185ce5 = {
      banCreateTime: _0x1f7de3.createTime ? formatTimestampToDate(new Date(_0x1f7de3.createTime)) : "",
      banNeedTime: _0x1f7de3.phase !== -1 ? legacyBan.phaseDict[_0x1f7de3.phase] / 86400 + "天" : "长期（10年）"
    };
    return _0x1b5985.replace(/%(.*?)%/g, (_0x530e46, _0x58213f) => {
      if (_0x185ce5.hasOwnProperty(_0x58213f)) {
        return _0x185ce5[_0x58213f];
      } else {
        return _0x530e46;
      }
    });
  },
  async giveBan(_0x2b6131, _0x5a2e28, _0x329bdd) {
    if (deps.Roles.isStaff(_0x5a2e28)) {
      await deps.Chat.send(_0x2b6131, "<@" + _0x2b6131.userId + "> 你无法限制管理员", "你无法限制管理员");
      return;
    }
    if (!_0x329bdd) {
      if (legacyBan.banHistory[_0x5a2e28] == undefined) {
        legacyBan.banHistory[_0x5a2e28] = 0;
      } else if (legacyBan.banHistory[_0x5a2e28] < legacyBan.phaseDict.length - 1) {
        ++legacyBan.banHistory[_0x5a2e28];
      }
      this.banList[_0x5a2e28] = {
        createTime: +new Date(),
        phase: legacyBan.banHistory[_0x5a2e28]
      };
      if (deps.config.deBug) {
        console.log(legacyBan.banHistory);
      }
      if (_0x2b6131.userId == _0x5a2e28) {
        const _0x11c7aa = legacyBan.phaseDict[legacyBan.banList[_0x5a2e28].phase] / 86400;
        await deps.Chat.send(_0x2b6131, "<@" + _0x2b6131.userId + "> 检测到查询违规内容，系统已自动限制使用**" + _0x11c7aa + "天**\n> 如有疑问，[请前往官方频道](https://pd.qq.com/s/a76gdqe0j)联系客服", "检测到查询违规内容，系统已自动限制使用" + _0x11c7aa + "天\n如有疑问，请前往官方频道联系客服");
      } else {
        const _0x49b7fa = legacyBan.phaseDict[legacyBan.banList[_0x5a2e28].phase] / 86400;
        await deps.Chat.send(_0x2b6131, " **已执行风控限制策略，已风控限制" + _0x49b7fa + "天**\n> 执行管理员：<@" + _0x2b6131.userId + ">", "已执行风控限制策略，已风控限制" + _0x49b7fa + "天");
      }
      legacyBan.setBanUserStore();
    } else {
      if (deps.config.foreverBanList.includes(_0x5a2e28)) {
        await deps.Chat.send(_0x2b6131, "**该目标已经被长期限制，无需再次操作**\n> 执行管理员：<@" + _0x2b6131.userId + ">", "该目标已经被长期限制，无需再次操作");
        return;
      }
      deps.config.foreverBanList.push(_0x5a2e28);
      await deps.Chat.send(_0x2b6131, "**正在风控限制违禁目标，目标已加入长期风控名单**\n> 执行管理员：<@" + _0x2b6131.userId + ">", "正在风控限制违禁目标，目标已加入长期风控名单");
      deps.activeContext.scope.update(deps.ctx.config, true);
    }
  },
  async giveAdmin(_0x56c668, _0x3617be) {
    if (legacyBan.adminList.concat(deps.config.adminList).includes(_0x3617be)) {
      await deps.Chat.send(_0x56c668, "<@" + _0x56c668.userId + "> Ta 已经是管理员，无需再次给予", "Ta 已经是管理员，无需再次给予");
      return;
    }
    legacyBan.adminList.push(_0x3617be);
    legacyBan.setAdminUserStore();
    await deps.Chat.send(_0x56c668, "<@" + _0x56c668.userId + "> **给予成功**", "给予成功");
  },
  async lostAdmin(_0x3f2b55, _0x4015ed) {
    if (!legacyBan.adminList.includes(_0x4015ed)) {
      await deps.Chat.send(_0x3f2b55, "<@" + _0x3f2b55.userId + "> **Ta 不是子管理员，不能撤销**", "Ta 不是子管理员，不能撤销");
      return;
    }
    legacyBan.adminList = legacyBan.adminList.filter(_0x56bce3 => _0x56bce3 != _0x4015ed);
    legacyBan.setAdminUserStore();
    await deps.Chat.send(_0x3f2b55, "<@" + _0x3f2b55.userId + "> **撤销成功**", "撤销成功");
  },
  async lostBan(_0x2ee29e, _0x173bf4) {
    if (legacyBan.banList[_0x173bf4] == undefined && !deps.config.foreverBanList.includes(_0x173bf4)) {
      await deps.Chat.send(_0x2ee29e, "<@" + _0x2ee29e.userId + "> **目标不在风控名单中...**", "目标不在风控名单中...");
      return;
    } else {
      if (legacyBan.banList[_0x173bf4]) {
        delete legacyBan.banList[_0x173bf4];
        legacyBan.setBanUserStore();
        await deps.Chat.send(_0x2ee29e, "<@" + _0x2ee29e.userId + "> **操作完成，目标已从风控限制中解除**", "操作完成，目标已从风控限制中解除");
        return;
      }
      deps.config.foreverBanList = deps.config.foreverBanList.filter(_0x3ea9f6 => _0x3ea9f6 !== _0x173bf4);
      await deps.Chat.send(_0x2ee29e, "<@" + _0x2ee29e.userId + "> **操作完成，目标已从长期风控限制中移除**", "操作完成，目标已从长期风控限制中移除");
      deps.activeContext.scope.update(deps.ctx.config, true);
    }
  },
  updateBanState() {
    let _0x46b92b = false;
    const _0x1f159b = +new Date() / 1000;
    const _0x299445 = Object.keys(legacyBan.banList).map(_0x764fcd => {
      if (_0x1f159b - legacyBan.banList[_0x764fcd].createTime >= legacyBan.phaseDict[legacyBan.banList[_0x764fcd].phase]) {
        _0x46b92b = true;
        delete legacyBan.banList[_0x764fcd];
      }
      return {
        ...legacyBan.banList[_0x764fcd],
        userId: _0x764fcd
      };
    });
    if (_0x46b92b) {
      legacyBan.setBanUserStore();
    }
    return _0x299445.concat(deps.config.foreverBanList.map(_0x36d5db => ({
      userId: _0x36d5db,
      createTime: 0,
      phase: -1
    })));
  },
  async setBanUserStore() {
    await deps.queuedSetItem(deps.ctx, deps.config.basePath + "/banList", JSON.stringify(legacyBan.banList));
    await deps.queuedSetItem(deps.ctx, deps.config.basePath + "/banHistoryList", JSON.stringify(legacyBan.banHistory));
  },
  async setAdminUserStore() {
    await deps.queuedSetItem(deps.ctx, deps.config.basePath + "/adminList", JSON.stringify(legacyBan.adminList));
  }
};
function formatTimestampToDate(_0x4456a6) {
  const _0x262b5f = new Date(_0x4456a6);
  const _0x585edf = _0x262b5f.getFullYear();
  const _0x446518 = _0x262b5f.getMonth() + 1;
  const _0x552a2b = _0x262b5f.getDate();
  return _0x585edf + "/" + _0x446518 + "/" + _0x552a2b;
}
return { get legacyBan() { return legacyBan; },
get formatTimestampToDate() { return formatTimestampToDate; } };
};
