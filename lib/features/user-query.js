'use strict';

module.exports = function create(deps) {
const userQuery = {
  async getUserDetailByUsername(_0xf6b8d6, _0x2f37bb) {
    if (!_0xf6b8d6?.trim()) {
      await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> 请输入用户名", undefined, deps.kb.menuSearch());
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(_0xf6b8d6.trim())) {
      await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> 请输入正确的用户名。\n> 例如：/用户名搜索 roblox", undefined, deps.kb.menuSearch());
      return;
    }
    const _0x4479ff = deps.getPrivilege(7);
    try {
      await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> 稍等，正在通过用户名获取信息...");
      deps.queryLock.startUse(_0x2f37bb);
      let _0x1f96b2 = deps.requestCache.getUserCache(_0xf6b8d6.trim(), true);
      let _0x53b063 = null;
      if (!_0x1f96b2) {
        _0x1f96b2 = await deps.robloxApi.get("/query-username/" + encodeURIComponent(_0xf6b8d6.trim().toLowerCase()));
        if (!_0x1f96b2.data) {
          deps.queryLock.clearUse(_0x2f37bb);
          await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> **未找到该玩家**", undefined, deps.kb.menuSearch());
          return;
        }
        if (!deps.Roles.isAdmin(_0x2f37bb.userId)) {
          if (deps.config.deBug) {
            console.log(_0x1f96b2.data.userId);
          }
          if (deps.config.delGetUserIdList.includes("" + _0x1f96b2.data.userId)) {
            await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
            deps.queryLock.clearUse(_0x2f37bb);
            return;
          }
        }
        _0x53b063 = _0x1f96b2.data;
        const _0x168507 = deps.shouldBypassSearchAudit(_0x53b063);
        const _0x4cf66f = _0x53b063.displayName;
        _0x53b063.displayName &&= await deps.prepareSearchText(_0x53b063.displayName, _0x168507);
        const _0x3afc7d = _0x53b063.blurb;
        _0x53b063.blurb &&= await deps.prepareSearchText(_0x53b063.blurb, _0x168507);
        if (!_0x168507 && deps.config.useRiskControl && (deps.outputAudit.isFlagged(_0x53b063.displayName) || deps.outputAudit.isFlagged(_0x53b063.blurb))) {
          const _0x5c4616 = [];
          if (deps.outputAudit.isFlagged(_0x53b063.displayName)) {
            _0x5c4616.push("显示名：" + _0x4cf66f);
          }
          if (deps.outputAudit.isFlagged(_0x53b063.blurb)) {
            _0x5c4616.push("简介：" + _0x3afc7d);
          }
          await deps.queryFlow.sensitive(_0x2f37bb, {
            targetId: "" + _0x53b063.userId,
            targetType: "user",
            targetName: _0x53b063.username,
            summary: _0x5c4616.join("\n") || _0x53b063.username,
            reason: "用户资料含敏感内容"
          });
        }
        deps.requestCache.addUserCache(_0x53b063);
      } else {
        if (deps.config.deBug) {
          console.log(_0x1f96b2.data.username + "用户存在缓存数据，使用缓存数据进行...");
        }
        _0x53b063 = _0x1f96b2.data;
      }
      const _0x40b234 = await deps.prepareUserImages(_0x53b063, _0x2f37bb, _0x4479ff);
      const _0x31d649 = deps.renderUserDetail(_0x40b234, _0x2f37bb, _0x4479ff);
      if (deps.config.deBug) {
        console.log(_0x31d649);
      }
      deps.queryLock.clearUse(_0x2f37bb);
      await deps.Chat.send(_0x2f37bb, _0x31d649, undefined, deps.kb.menuSearch());
    } catch (_0x2c0f80) {
      if (deps.config.deBug) {
        console.log(_0x2c0f80);
      }
      deps.queryLock.clearUse(_0x2f37bb);
      await deps.Chat.send(_0x2f37bb, "<@" + _0x2f37bb.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getUserAvatarByName(_0x507ba4, _0x438d5a, _0x9b36f1) {
    try {
      deps.queryLock.startUse(_0x438d5a);
      const _0x4681a9 = await deps.robloxApi.get("/get-user-avatar/" + encodeURIComponent(_0x507ba4));
      if (!deps.Roles.isAdmin(_0x438d5a.userId)) {
        if (deps.config.delGetUserIdList.includes("" + _0x4681a9.id)) {
          await deps.Chat.send(_0x438d5a, "<@" + _0x438d5a.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
          deps.queryLock.clearUse(_0x438d5a);
          return;
        }
      }
      if (_0x9b36f1) {
        _0x9b36f1(_0x4681a9);
      }
      return _0x4681a9?.data[0]?.imageUrl || "";
    } catch (_0x728969) {
      return "";
    }
  },
  async getUserDetailByUserId(_0xa2221c, _0x582099, _0x5d279a) {
    if (!("" + _0xa2221c)?.trim()) {
      await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> 请输入用户Id", undefined, deps.kb.menuSearch());
      return;
    }
    if (!/^\d{1,17}$/.test(_0xa2221c)) {
      await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> 请输入正确的用户Id。\n> 例如： /用户ID搜索 10032", undefined, deps.kb.menuSearch());
      return;
    }
    const _0x2602ad = deps.getPrivilege(7);
    if (!deps.Roles.isAdmin(_0x582099.userId)) {
      if (deps.config.delGetUserIdList.includes(_0xa2221c)) {
        await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
        deps.queryLock.clearUse(_0x582099);
        return;
      }
    }
    try {
      await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> 稍等，正在通过用户ID获取信息...");
      deps.queryLock.startUse(_0x582099);
      let _0x3957ae = deps.requestCache.getUserCache(_0xa2221c, false);
      let _0xd694e4 = null;
      if (!_0x3957ae) {
        _0x3957ae = await deps.robloxApi.get("/query-userid/" + encodeURIComponent(_0xa2221c));
        if (!_0x3957ae.data) {
          deps.queryLock.clearUse(_0x582099);
          await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> **未找到该玩家**", undefined, deps.kb.menuSearch());
          return;
        }
        _0xd694e4 = _0x3957ae.data;
        const _0x36d015 = deps.shouldBypassSearchAudit(_0xd694e4);
        const _0x407014 = _0xd694e4.displayName;
        _0xd694e4.displayName &&= await deps.prepareSearchText(_0xd694e4.displayName, _0x36d015);
        const _0x130fdc = _0xd694e4.blurb;
        _0xd694e4.blurb &&= await deps.prepareSearchText(_0xd694e4.blurb, _0x36d015);
        if (!_0x36d015 && deps.config.useRiskControl && (deps.outputAudit.isFlagged(_0xd694e4.displayName) || deps.outputAudit.isFlagged(_0xd694e4.blurb))) {
          const _0x5e8578 = [];
          if (deps.outputAudit.isFlagged(_0xd694e4.displayName)) {
            _0x5e8578.push("显示名：" + _0x407014);
          }
          if (deps.outputAudit.isFlagged(_0xd694e4.blurb)) {
            _0x5e8578.push("简介：" + _0x130fdc);
          }
          await deps.queryFlow.sensitive(_0x582099, {
            targetId: "" + _0xd694e4.userId,
            targetType: "user",
            targetName: _0xd694e4.username,
            summary: _0x5e8578.join("\n") || _0xd694e4.username,
            reason: "用户资料含敏感内容"
          });
        }
        deps.requestCache.addUserCache(_0xd694e4);
      } else {
        if (deps.config.deBug) {
          console.log(_0x3957ae.data.username + "用户存在缓存数据，使用缓存数据进行...");
        }
        _0xd694e4 = _0x3957ae.data;
      }
      _0x5d279a?.(_0xd694e4);
      const _0x57dd1f = await deps.prepareUserImages(_0xd694e4, _0x582099, _0x2602ad);
      const _0x37d03e = deps.renderUserDetail(_0x57dd1f, _0x582099, _0x2602ad);
      if (deps.config.deBug) {
        console.log(_0x37d03e);
      }
      deps.queryLock.clearUse(_0x582099);
      await deps.Chat.send(_0x582099, _0x37d03e, undefined, deps.kb.menuSearch());
    } catch (_0x27d4e9) {
      if (deps.config.deBug) {
        console.log(_0x27d4e9);
      }
      deps.queryLock.clearUse(_0x582099);
      await deps.Chat.send(_0x582099, "<@" + _0x582099.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getUsernameHistoryByUsername(_0x2f11ad, _0x3ad8b7) {
    if (!_0x2f11ad?.trim()) {
      await deps.Chat.send(_0x3ad8b7, "<@" + _0x3ad8b7.userId + "> 请输入用户名\n> 例如：/查询用户曾用名 roblox");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(_0x2f11ad.trim())) {
      await deps.Chat.send(_0x3ad8b7, "<@" + _0x3ad8b7.userId + "> 请输入正确的用户名。\n> 例如：/查询用户曾用名 roblox");
      return;
    }
    try {
      await deps.Chat.send(_0x3ad8b7, "<@" + _0x3ad8b7.userId + "> 稍等，正在通过用户名获取用户历史昵称信息...");
      deps.queryLock.startUse(_0x3ad8b7);
      const _0x2dfb73 = await deps.robloxApi.get("/query-past-names/" + encodeURIComponent(_0x2f11ad));
      if (!_0x2dfb73.data) {
        deps.queryLock.clearUse(_0x3ad8b7);
        await deps.Chat.send(_0x3ad8b7, "<@" + _0x3ad8b7.userId + "> 未找到该用户，查询失败");
        return;
      }
      deps.queryLock.clearUse(_0x3ad8b7);
      const _0x4c361f = _0x2dfb73.data?.length ? "<@" + _0x3ad8b7.userId + "> **该用户曾经的曾用名为**：\n" + _0x2dfb73.data.map(_0x31e483 => "- " + _0x31e483).join("\n") : "<@" + _0x3ad8b7.userId + "> 该玩家未有任何曾用名。";
      await deps.Chat.send(_0x3ad8b7, _0x4c361f);
    } catch (_0x3048f9) {
      deps.queryLock.clearUse(_0x3ad8b7);
      await deps.Chat.send(_0x3ad8b7, "<@" + _0x3ad8b7.userId + "> 请求失败，请稍后重试...");
    }
  }
};
return { get userQuery() { return userQuery; } };
};
