'use strict';

module.exports = function create(deps) {
const groupQuery = {
  async getGroupAvatarByName(_0x3882e7, _0x15b802, _0x59dfd1) {
    try {
      deps.queryLock.startUse(_0x15b802);
      const _0x4d1737 = await deps.robloxApi.get("/get-group-icon/" + encodeURIComponent(_0x3882e7));
      if (_0x59dfd1) {
        _0x59dfd1(_0x4d1737);
      }
      return _0x4d1737?.data?.thumbnailUrl || "";
    } catch (_0x4e1cbc) {
      return "";
    }
  },
  async getGroupDetailByGroupName(_0x3e20c7, _0x24db27) {
    if (!_0x3e20c7?.trim()) {
      await deps.Chat.send(_0x24db27, "<@" + _0x24db27.userId + "> 请输入群组名", undefined, deps.kb.searchNav());
      return;
    }
    if (!/^[\u4e00-\u9fa5A-Za-z0-9\s]{1,30}$/.test(_0x3e20c7.trim())) {
      await deps.Chat.send(_0x24db27, "<@" + _0x24db27.userId + "> 请输入正确的群组名。\n> 例如：/群组名搜索 robloxroom", undefined, deps.kb.searchNav());
      return;
    }
    const _0x5c1256 = deps.getPrivilege(7);
    try {
      await deps.Chat.send(_0x24db27, "<@" + _0x24db27.userId + "> 稍等，正在通过群组名获取信息...");
      deps.queryLock.startUse(_0x24db27);
      const _0xcbc52e = await deps.robloxApi.get("/query-group/" + encodeURIComponent(_0x3e20c7));
      if (!_0xcbc52e.data) {
        deps.queryLock.clearUse(_0x24db27);
        await deps.Chat.send(_0x24db27, "<@" + _0x24db27.userId + "> 未找到该群组", undefined, deps.kb.searchNav());
        return;
      }
      const _0x2a94ca = _0xcbc52e.data;
      const _0x2d4869 = deps.shouldBypassSearchAudit(_0x2a94ca);
      _0x2a94ca.avatar = _0x5c1256.showGroupIcon ? await groupQuery.getGroupAvatarByName(_0x3e20c7, _0x24db27) : "";
      if (deps.config.useMd && _0x5c1256.showGroupIcon) {
        const _0x48d0b5 = {
          session: _0x24db27,
          targetId: "" + _0x2a94ca.id,
          targetType: "group",
          targetName: _0x2a94ca.name,
          reason: "群组图标命中敏感内容"
        };
        _0x2a94ca.avatar = (await deps.prepareSearchImage(_0x2a94ca.avatar, _0x2d4869, _0x48d0b5)) || "https://smmcat.cn/wp-content/uploads/2026/04/null.png";
      }
      _0x2a94ca.name &&= await deps.prepareSearchText(_0x2a94ca.name, _0x2d4869);
      _0x2a94ca.description &&= await deps.prepareSearchText(_0x2a94ca.description, _0x2d4869);
      if (deps.config.useTranslate && _0x2a94ca.description && deps.userLocal.isTranslate(_0x24db27.userId)) {
        _0x2a94ca.description = await deps.media.getTranslateData(_0x2a94ca.description);
      }
      if (_0x2a94ca.shout) {
        _0x2a94ca.shout.body = await deps.prepareSearchText(_0x2a94ca.shout.body, _0x2d4869);
      }
      const _0x3cc79a = _0x2a94ca.shout ? _0x2a94ca.shout.poster.username + "说：" + (_0x2a94ca.shout.body.length > 30 ? _0x2a94ca.shout.body.slice(0, 30) + "..." : _0x2a94ca.shout.body) : "无";
      if (deps.config.deBug) {
        console.log(_0x2a94ca);
      }
      if (deps.config.useMd) {
        const _0x39f652 = _0x5c1256.showGroupIcon ? "![test #96px #96px](" + _0x2a94ca.avatar + ")" : "";
        const _0x28b4e3 = deps.withDisplayUnlockHint("\n<@" + _0x24db27.userId + ">\n## 👥 " + _0x2a94ca.name + " " + (_0x5c1256.showGroupIcon && _0x2a94ca.hasVerifiedBadge ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)" : "") + "\n\n" + _0x39f652 + "\n\n> 👥 成员 " + _0x2a94ca.memberCount + "　|　🚪 公开加入 " + (_0x2a94ca.publicEntryAllowed ? "✅" : "❌") + "\n\n---\n\n### 🔍 社区信息\n- **社区 ID：** <qqbot-cmd-input text=\"" + _0x2a94ca.id + "\" show=\"" + _0x2a94ca.id + "\"/>\n- **所有者：** <qqbot-cmd-input text=\"" + _0x2a94ca.owner.username + "\" show=\"" + _0x2a94ca.owner.username + "\"/>\n- **创建时间：** " + (_0x2a94ca.shout?.created ? deps.media.formatDate(_0x2a94ca.shout.created) : "未知") + "\n- **更新时间：** " + (_0x2a94ca.shout?.updated ? deps.media.formatDate(_0x2a94ca.shout.updated) : "未知") + "\n\n### 📝 社区简介\n```text\n" + (_0x2a94ca.description ? _0x2a94ca.description : "无描述") + "\n```\n\n---\n<qqbot-cmd-input text=\"/群组名搜索 \" show=\"搜索群组\"/>\n", !_0x5c1256.showGroupIcon);
        if (deps.config.deBug) {
          console.log(_0x28b4e3);
        }
        deps.queryLock.clearUse(_0x24db27);
        await deps.Chat.send(_0x24db27, _0x28b4e3, undefined, deps.kb.searchNav());
      } else {
        const _0xe1c141 = deps.withDisplayUnlockHint((_0x5c1256.showGroupIcon && _0x2a94ca.avatar ? deps.import_koishi2.h.image(_0x2a94ca.avatar) : "") + "获取到该群组信息：\n[群组ID] " + _0x2a94ca.id + "\n[群组名] " + _0x2a94ca.name + "\n[群组主人] " + _0x2a94ca.owner.username + "\n[最新公告] " + deps.media.delStrUrl(_0x3cc79a) + "\n[创建时间] " + (_0x2a94ca.shout?.created ? deps.media.formatDate(_0x2a94ca.shout.created) : "未知") + "\n[更新时间] " + (_0x2a94ca.shout?.updated ? deps.media.formatDate(_0x2a94ca.shout.updated) : "未知") + "\n[成员数量] " + _0x2a94ca.memberCount + "位\n[允许公众进入] " + (_0x2a94ca.publicEntryAllowed ? "是" : "否") + "\n[已验证徽章] " + (_0x2a94ca.hasVerifiedBadge ? "是" : "否") + "\n[群组描述] " + (_0x2a94ca.description ? _0x2a94ca.description.length > 50 ? _0x2a94ca.description.slice(0, 50) + "..." : _0x2a94ca.description : "无描述"), !_0x5c1256.showGroupIcon);
        if (deps.config.deBug) {
          console.log(_0xe1c141);
        }
        deps.queryLock.clearUse(_0x24db27);
        await deps.Chat.send(_0x24db27, _0xe1c141);
      }
    } catch (_0x4db154) {
      deps.queryLock.clearUse(_0x24db27);
      await deps.Chat.send(_0x24db27, "<@" + _0x24db27.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getGroupDetailByGroupId(_0xb3c13c, _0x5ad50e) {
    if (!_0xb3c13c?.trim()) {
      await deps.Chat.send(_0x5ad50e, "<@" + _0x5ad50e.userId + "> 请输入群组ID", undefined, deps.kb.searchNav());
      return;
    }
    if (!/^[0-9]+$/.test(_0xb3c13c)) {
      await deps.Chat.send(_0x5ad50e, "<@" + _0x5ad50e.userId + "> 请输入正确的群组ID。\n> 例如：/群组ID搜索 10032", undefined, deps.kb.searchNav());
      return;
    }
    const _0x1584c0 = deps.getPrivilege(7);
    try {
      await deps.Chat.send(_0x5ad50e, "<@" + _0x5ad50e.userId + "> 稍等，正在通过群组ID获取信息...");
      deps.queryLock.startUse(_0x5ad50e);
      const _0x3b1fee = await deps.robloxApi.get("/query-groupid/" + encodeURIComponent(_0xb3c13c));
      if (!_0x3b1fee.data) {
        deps.queryLock.clearUse(_0x5ad50e);
        await deps.Chat.send(_0x5ad50e, "<@" + _0x5ad50e.userId + "> 未找到该群组", undefined, deps.kb.searchNav());
        return;
      }
      const _0x5bd708 = _0x3b1fee.data;
      const _0x1e3b32 = deps.shouldBypassSearchAudit(_0x5bd708);
      _0x5bd708.avatar = _0x1584c0.showGroupIcon ? await groupQuery.getGroupAvatarByName(_0x5bd708.name, _0x5ad50e) : "";
      if (deps.config.useMd && _0x1584c0.showGroupIcon) {
        const _0x570a02 = {
          session: _0x5ad50e,
          targetId: "" + _0x5bd708.id,
          targetType: "group",
          targetName: _0x5bd708.name,
          reason: "群组图标命中敏感内容"
        };
        _0x5bd708.avatar = (await deps.prepareSearchImage(_0x5bd708.avatar, _0x1e3b32, _0x570a02)) || "https://smmcat.cn/wp-content/uploads/2026/04/null.png";
      }
      _0x5bd708.name &&= await deps.prepareSearchText(_0x5bd708.name, _0x1e3b32);
      _0x5bd708.description &&= await deps.prepareSearchText(_0x5bd708.description, _0x1e3b32);
      if (deps.config.useTranslate && _0x5bd708.description && deps.userLocal.isTranslate(_0x5ad50e.userId)) {
        _0x5bd708.description = await deps.media.getTranslateData(_0x5bd708.description);
      }
      if (_0x5bd708.shout) {
        _0x5bd708.shout.body = await deps.prepareSearchText(_0x5bd708.shout.body, _0x1e3b32);
      }
      const _0x272533 = _0x5bd708.shout ? _0x5bd708.shout.poster.username + "说：" + (_0x5bd708.shout.body.length > 30 ? _0x5bd708.shout.body.slice(0, 30) + "..." : _0x5bd708.shout.body) : "无";
      if (deps.config.deBug) {
        console.log(_0x5bd708);
      }
      if (deps.config.useMd) {
        const _0x15135e = _0x1584c0.showGroupIcon ? "![test #96px #96px](" + _0x5bd708.avatar + ")" : "";
        const _0x396109 = deps.withDisplayUnlockHint("\n<@" + _0x5ad50e.userId + ">\n## 👥 " + _0x5bd708.name + " " + (_0x1584c0.showGroupIcon && _0x5bd708.hasVerifiedBadge ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)" : "") + "\n\n" + _0x15135e + "\n\n> 👥 成员 " + _0x5bd708.memberCount + "　|　🚪 公开加入 " + (_0x5bd708.publicEntryAllowed ? "✅" : "❌") + "\n\n---\n\n### 🔍 社区信息\n- **社区 ID：** <qqbot-cmd-input text=\"" + _0x5bd708.id + "\" show=\"" + _0x5bd708.id + "\"/>\n- **所有者：** <qqbot-cmd-input text=\"" + _0x5bd708.owner.username + "\" show=\"" + _0x5bd708.owner.username + "\"/>\n- **创建时间：** " + (_0x5bd708.shout?.created ? deps.media.formatDate(_0x5bd708.shout.created) : "未知") + "\n- **更新时间：** " + (_0x5bd708.shout?.updated ? deps.media.formatDate(_0x5bd708.shout.updated) : "未知") + "\n\n### 📝 社区简介\n```text\n" + (_0x5bd708.description || "无描述") + "\n```\n\n---\n<qqbot-cmd-input text=\"/群组ID搜索 \" show=\"搜索群组\"/>\n", !_0x1584c0.showGroupIcon);
        deps.queryLock.clearUse(_0x5ad50e);
        await deps.Chat.send(_0x5ad50e, _0x396109, undefined, deps.kb.searchNav());
        return;
      }
      const _0x20f69f = deps.withDisplayUnlockHint((_0x1584c0.showGroupIcon && _0x5bd708.avatar ? deps.import_koishi2.h.image(_0x5bd708.avatar) : "") + "获取到该群组信息：\n[群组ID] " + _0x5bd708.id + "\n[群组名] " + _0x5bd708.name + "\n[群组主人] " + _0x5bd708.owner.username + "\n[最新公告] " + deps.media.delStrUrl(_0x272533) + "\n[创建时间] " + (_0x5bd708.shout?.created ? deps.media.formatDate(_0x5bd708.shout.created) : "未知") + "\n[更新时间] " + (_0x5bd708.shout?.updated ? deps.media.formatDate(_0x5bd708.shout.updated) : "未知") + "\n[成员数量] " + _0x5bd708.memberCount + "位\n[允许公众进入] " + (_0x5bd708.publicEntryAllowed ? "是" : "否") + "\n[已验证徽章] " + (_0x5bd708.hasVerifiedBadge ? "是" : "否") + "\n[群组描述] " + (_0x5bd708.description ? _0x5bd708.description.length > 50 ? _0x5bd708.description.slice(0, 50) + "..." : _0x5bd708.description : "无描述"), !_0x1584c0.showGroupIcon);
      if (deps.config.deBug) {
        console.log(_0x20f69f);
      }
      deps.queryLock.clearUse(_0x5ad50e);
      await deps.Chat.send(_0x5ad50e, _0x20f69f, undefined, deps.kb.menuSearch());
    } catch (_0x1dd243) {
      deps.queryLock.clearUse(_0x5ad50e);
      await deps.Chat.send(_0x5ad50e, "<@" + _0x5ad50e.userId + "> 请求失败，请稍后重试...");
    }
  }
};
return { get groupQuery() { return groupQuery; } };
};
