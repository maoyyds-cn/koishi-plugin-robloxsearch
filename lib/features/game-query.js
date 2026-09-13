'use strict';

module.exports = function create(deps) {
const gameQuery = {
  async getGameByKeyword(_0x532817, _0x15b916, _0x265bdc = false) {
    if (!_0x532817?.trim()) {
      await deps.Chat.send(_0x15b916, "<@" + _0x15b916.userId + "> 请输入游戏关键字。\n> 例如：/游戏名搜索 galmake");
      return;
    }
    const _0x423d53 = deps.getPrivilege(7);
    try {
      await deps.Chat.send(_0x15b916, "<@" + _0x15b916.userId + "> 稍等，正在通过关键字查询对应游戏信息...");
      deps.queryLock.startUse(_0x15b916);
      const _0x318ab1 = await deps.robloxHttp.get("https://apis.rotunnel.com/search-api/omni-search?searchQuery=" + encodeURIComponent(_0x532817) + "&pageToken=&sessionId=e5875aa4-d7f6-42cc-8aa7-98564f4aedf2&pageType=all" + (_0x265bdc ? "&operator=true" : ""));
      if (!_0x318ab1.searchResults?.length) {
        deps.queryLock.clearUse(_0x15b916);
        await deps.Chat.send(_0x15b916, "<@" + _0x15b916.userId + "> 未找到对应游戏信息...", undefined, deps.kb.searchNav());
        return;
      }
      const _0xf32f12 = _0x318ab1.searchResults[0]?.contents[0];
      const _0x56e6c7 = deps.shouldBypassSearchAudit(_0xf32f12);
      if (_0x423d53.showGameCover && _0xf32f12.universeId) {
        const _0x55205f = await deps.robloxApi.get("/get-game-pic/" + _0xf32f12.universeId);
        if (_0x55205f.success) {
          if (deps.config.useMd) {
            const _0x1be076 = {
              session: _0x15b916,
              targetId: "" + _0xf32f12.universeId,
              targetType: "game",
              targetName: _0xf32f12.name,
              reason: "游戏封面命中敏感内容"
            };
            _0xf32f12.pic = await deps.prepareSearchImage(_0x55205f.data, _0x56e6c7, _0x1be076);
          } else {
            _0xf32f12.pic = _0x55205f.data;
          }
        }
      } else {
        _0xf32f12.pic = "";
      }
      _0xf32f12.description &&= await deps.prepareSearchText(_0xf32f12.description, _0x56e6c7);
      if (deps.config.useTranslate && _0xf32f12.description && deps.userLocal.isTranslate(_0x15b916.userId)) {
        _0xf32f12.description = await deps.media.getTranslateData(_0xf32f12.description);
      }
      if (deps.config.useMd) {
        const _0x1df821 = _0x423d53.showGameCover && _0xf32f12.pic ? "![test #768px #432px](" + _0xf32f12.pic + ")" : "";
        const _0x188351 = deps.withDisplayUnlockHint("\n<@" + _0x15b916.userId + ">\n\n" + _0x1df821 + "\n\n## 🎮 " + _0xf32f12.name + "\n\n> 👥 当前玩家 `" + _0xf32f12.playerCount + "`　|　👍 " + _0xf32f12.totalUpVotes + "　|　👎 " + _0xf32f12.totalDownVotes + "\n\n---\n\n### 📝 游戏简介\n```html\n" + (_0xf32f12.description || "无") + "\n```\n\n### 🔍 详细信息\n- **游戏宇宙 ID：** <qqbot-cmd-input text=\"" + _0xf32f12.universeId + "\" show=\"" + _0xf32f12.universeId + "\"/>\n- **内容 ID：** <qqbot-cmd-input text=\"" + _0xf32f12.contentId + "\" show=\"" + _0xf32f12.contentId + "\"/>\n- **创建者 ID：** <qqbot-cmd-input text=\"" + _0xf32f12.creatorId + "\" show=\"" + _0xf32f12.creatorId + "\"/>\n- **根地点 ID：** <qqbot-cmd-input text=\"" + _0xf32f12.rootPlaceId + "\" show=\"" + _0xf32f12.rootPlaceId + "\"/>\n- **内容类型：** " + _0xf32f12.contentType + "\n- **年龄分级：** " + _0xf32f12.minimumAge + "+（Maturity: " + _0xf32f12.contentMaturity + "）\n- **内容状态：** 强调 " + (_0xf32f12.emphasis ? "✅" : "❌") + " · 赞助 " + (_0xf32f12.isSponsored ? "✅" : "❌") + " · 原生广告 " + (_0xf32f12.nativeAdData ? "✅" : "❌") + "\n\n---\n\n### 👤 创作者\n" + _0xf32f12.creatorName + " " + (_0x423d53.showGameCover && _0xf32f12.creatorHasVerifiedBadge ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)" : "") + "\n\n<qqbot-cmd-input text=\"/游戏名搜索 \" show=\"搜索游戏\"/>  " + (deps.config.globalAdv ? deps.config.globalAdv : "") + "\n           ", !_0x423d53.showGameCover);
        if (deps.config.deBug) {
          console.log(_0x188351);
        }
        deps.queryLock.clearUse(_0x15b916);
        await deps.Chat.send(_0x15b916, _0x188351, undefined, deps.kb.searchNav());
      } else {
        const _0x4b5c3f = Object.entries(_0xf32f12).filter(([_0x10be09]) => _0x10be09 !== "pic").map(([_0x584c5e, _0x235332]) => {
          const _0x230c4d = {
            universeId: "游戏宇宙 ID",
            name: "游戏名称",
            description: "游戏描述",
            playerCount: "当前玩家数量",
            totalUpVotes: "总点赞数",
            totalDownVotes: "总点踩数",
            emphasis: "是否强调显示",
            isSponsored: "是否为赞助内容",
            nativeAdData: "原生广告数据",
            creatorName: "创建者名称",
            creatorHasVerifiedBadge: "创建者是否有已验证徽章",
            creatorId: "创建者 ID",
            rootPlaceId: "根地点 ID",
            minimumAge: "最低年龄限制",
            ageRecommendationDisplayName: "年龄推荐显示名称",
            contentType: "内容类型",
            contentId: "内容 ID",
            defaultLayoutData: "默认布局数据"
          }[_0x584c5e] || _0x584c5e;
          return "[" + _0x230c4d + "] " + (_0x235332 ? typeof _0x235332 == "string" ? deps.media.delStrUrl(_0x235332) : _0x235332 : "无");
        }).join("\n");
        if (deps.config.deBug) {
          console.log(_0x4b5c3f);
        }
        deps.queryLock.clearUse(_0x15b916);
        await deps.Chat.send(_0x15b916, deps.withDisplayUnlockHint((_0x423d53.showGameCover && _0xf32f12.pic ? deps.import_koishi2.h.image(_0xf32f12.pic) : "") + "获取到如下信息：\n" + _0x4b5c3f, !_0x423d53.showGameCover));
      }
    } catch (_0x471320) {
      deps.queryLock.clearUse(_0x15b916);
      await deps.Chat.send(_0x15b916, "<@" + _0x15b916.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getGameByPlaceId(_0x191c06, _0x445465) {
    if (!_0x191c06?.trim()) {
      await deps.Chat.send(_0x445465, "<@" + _0x445465.userId + "> 请填写游戏ID\n> 例如：/游戏ID搜索 10032", undefined, deps.kb.searchNav());
      return;
    }
    if (!/^\d{1,20}$/.test(_0x191c06)) {
      await deps.Chat.send(_0x445465, "<@" + _0x445465.userId + "> 请输入正确的游戏ID。\n> 例如：/游戏ID搜索 10032", undefined, deps.kb.searchNav());
      return;
    }
    const _0x42e651 = deps.getPrivilege(7);
    try {
      await deps.Chat.send(_0x445465, "<@" + _0x445465.userId + "> 正在通过游戏ID搜索...");
      deps.queryLock.startUse(_0x445465);
      const _0x45aedf = await deps.robloxApi.get("/search-game/" + _0x191c06);
      if (!_0x45aedf.data) {
        deps.queryLock.clearUse(_0x445465);
        await deps.Chat.send(_0x445465, "<@" + _0x445465.userId + "> 无任何游戏内容", undefined, deps.kb.searchNav());
        return;
      }
      const _0x5be0d8 = _0x45aedf.data;
      const _0x7abd54 = deps.shouldBypassSearchAudit(_0x5be0d8);
      _0x5be0d8.description &&= await deps.prepareSearchText(_0x5be0d8.description, _0x7abd54);
      if (deps.config.useTranslate && _0x5be0d8.description && deps.userLocal.isTranslate(_0x445465.userId)) {
        _0x5be0d8.description = await deps.media.getTranslateData(_0x5be0d8.description);
      }
      if (deps.config.useMd) {
        let _0x20eff3 = "";
        if (_0x42e651.showGameCover && _0x45aedf.pic) {
          const _0x2c5ede = {
            session: _0x445465,
            targetId: "" + (_0x5be0d8.universeId ?? _0x191c06),
            targetType: "game",
            targetName: _0x5be0d8.name,
            reason: "游戏封面命中敏感内容"
          };
          _0x20eff3 = await deps.prepareSearchImage(_0x45aedf.pic, _0x7abd54, _0x2c5ede);
        }
        const _0x32bf39 = _0x42e651.showGameCover && _0x20eff3 ? "![test #768px #432px](" + _0x20eff3 + ")" : "";
        const _0x207c08 = deps.withDisplayUnlockHint("\n<@" + _0x445465.userId + ">\n\n" + _0x32bf39 + "\n\n## 🎮 " + _0x5be0d8.name + "\n\n> 👥 当前玩家 " + _0x5be0d8.playerCount + "　|　👍 " + _0x5be0d8.totalUpVotes + "　|　👎 " + _0x5be0d8.totalDownVotes + "\n\n---\n\n### 📝 游戏简介\n```html\n" + (_0x5be0d8.description || "无") + "\n```\n\n### 🔍 详细信息\n- **游戏宇宙 ID：** <qqbot-cmd-input text=\"" + _0x5be0d8.universeId + "\" show=\"" + _0x5be0d8.universeId + "\"/>\n- **根地点 ID：** <qqbot-cmd-input text=\"" + _0x5be0d8.rootPlaceId + "\" show=\"" + _0x5be0d8.rootPlaceId + "\"/>\n- **创建者 ID：** <qqbot-cmd-input text=\"" + _0x5be0d8.creatorId + "\" show=\"" + _0x5be0d8.creatorId + "\"/>\n- **总访问次数：** " + (_0x5be0d8.visits ?? "无") + "\n- **单服最大玩家：** " + (_0x5be0d8.maxPlayers ?? "无") + "\n- **收藏数量：** " + (_0x5be0d8.favoritedCount ?? "无") + "\n- **游戏类型：** " + (_0x5be0d8.genre || "无") + "\n- **创建时间：** " + (_0x5be0d8.created || "无") + "\n- **更新时间：** " + (_0x5be0d8.updated || "无") + "\n\n---\n\n### 👤 创作者\n" + _0x5be0d8.creatorName + " " + (_0x42e651.showGameCover && _0x5be0d8.creatorHasVerifiedBadge ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)" : "") + "\n\n<qqbot-cmd-input text=\"/游戏ID搜索 \" show=\"搜索游戏\"/>  " + (deps.config.globalAdv ? deps.config.globalAdv : "") + "\n          ", !_0x42e651.showGameCover);
        if (deps.config.deBug) {
          console.log(_0x207c08);
        }
        deps.queryLock.clearUse(_0x445465);
        await deps.Chat.send(_0x445465, _0x207c08, undefined, deps.kb.searchNav());
        return;
      }
      const _0xbfd5bb = Object.entries(_0x5be0d8).map(([_0x293938, _0x6a9e82]) => {
        const _0x239955 = {
          universeId: "游戏宇宙 ID",
          name: "游戏名称",
          description: "游戏描述",
          playerCount: "当前玩家数量",
          visits: "总访问次数",
          maxPlayers: "单服最大玩家数",
          totalUpVotes: "总点赞数",
          totalDownVotes: "总点踩数",
          favoritedCount: "收藏数量",
          creatorName: "创建者名称",
          creatorId: "创建者 ID",
          creatorType: "创建者类型",
          creatorHasVerifiedBadge: "创建者是否有已验证徽章",
          rootPlaceId: "根地点 ID",
          genre: "游戏类型",
          created: "创建时间",
          updated: "更新时间",
          canonicalUrlPath: "canonicalUrlPath"
        }[_0x293938] || _0x293938;
        return "[" + _0x239955 + "] " + (_0x6a9e82 ? typeof _0x6a9e82 == "string" ? deps.media.delStrUrl(_0x6a9e82) : _0x6a9e82 : "无");
      }).join("\n");
      deps.queryLock.clearUse(_0x445465);
      await deps.Chat.send(_0x445465, deps.withDisplayUnlockHint((_0x42e651.showGameCover && _0x45aedf.pic ? deps.import_koishi2.h.image(_0x45aedf.pic) : "") + "获取到如下信息：\n" + _0xbfd5bb, !_0x42e651.showGameCover));
    } catch (_0x3cb9bd) {
      deps.queryLock.clearUse(_0x445465);
      await deps.Chat.send(_0x445465, "<@" + _0x445465.userId + "> 请求失败，请稍后重试...");
    }
  }
};
return { get gameQuery() { return gameQuery; } };
};
