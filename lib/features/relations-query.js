'use strict';

module.exports = function create(deps) {
const relationsQuery = {
  async getFriendInfo(_0x232ca0, _0x5b2369) {
    if (!("" + _0x232ca0)?.trim()) {
      await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 请输入用户Id");
      return;
    }
    if (!/^\d{1,17}$/.test(_0x232ca0)) {
      await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 请输入正确的用户Id。\n> 例如： /获取好友列表 10032");
      return;
    }
    if (!deps.Roles.isAdmin(_0x5b2369.userId)) {
      if (deps.config.delGetUserIdList.includes(_0x232ca0)) {
        await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
        deps.queryLock.clearUse(_0x5b2369);
        return;
      }
    }
    try {
      await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 稍等，正在通过用户ID获取好友列表...");
      deps.queryLock.startUse(_0x5b2369);
      const _0x415c4c = await deps.robloxApi.get("/get-user-friend/" + encodeURIComponent(_0x232ca0));
      const _0x4c8731 = _0x415c4c.data;
      if (!_0x4c8731?.length) {
        await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 该用户目前没有任何好友...");
        deps.queryLock.clearUse(_0x5b2369);
        return;
      }
      let _0x329974 = _0x4c8731.length;
      let _0x22e9e2 = 10;
      let _0x333f60 = 0;
      let _0x1bad3e = Math.ceil(_0x329974 / _0x22e9e2);
      const _0x3164ae = () => {
        const _0x55290d = _0x4c8731.slice(_0x333f60 * _0x22e9e2, _0x333f60 * _0x22e9e2 + _0x22e9e2).filter(_0x2c5066 => _0x2c5066);
        return "👥 好友列表（最多展示 200 条）\n\n" + _0x55290d.map(_0x292050 => {
          return "· " + _0x292050.name + "（ID：" + _0x292050.id + "）";
        }).join("\n") + "\n\n第 " + (_0x333f60 + 1) + " / " + _0x1bad3e + " 页\n(20s) 发送「上一页 / 下一页」翻页";
      };
      await deps.Chat.send(_0x5b2369, _0x3164ae(), undefined, deps.kb.pagination());
      while (true) {
        const _0x330642 = await _0x5b2369.prompt(20000);
        if (_0x330642 == undefined) {
          await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 等待超时，已结束好友列表查询...");
          break;
        }
        if (_0x330642.trim() == "/上一页" || _0x330642.trim() == "上一页") {
          if (_0x333f60 > 0) {
            _0x333f60--;
            await deps.Chat.send(_0x5b2369, _0x3164ae(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 无法继续上一页了！");
          }
          continue;
        }
        if (_0x330642.trim() == "/下一页" || _0x330642.trim() == "下一页") {
          if (_0x333f60 < _0x1bad3e) {
            _0x333f60++;
            await deps.Chat.send(_0x5b2369, _0x3164ae(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 无法继续下一页了！");
          }
          continue;
        }
        await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 无效指令，操作已结束");
        break;
      }
      deps.queryLock.clearUse(_0x5b2369);
    } catch (_0xe352c) {
      if (deps.config.deBug) {
        console.log(_0xe352c);
      }
      deps.queryLock.clearUse(_0x5b2369);
      await deps.Chat.send(_0x5b2369, "<@" + _0x5b2369.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getFollowersInfo(_0x1b2cca, _0x8452c2) {
    if (!("" + _0x1b2cca)?.trim()) {
      await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 请输入用户Id");
      return;
    }
    if (!/^\d{1,17}$/.test(_0x1b2cca)) {
      await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 请输入正确的用户Id。\n> 例如： /获取粉丝列表 10032");
      return;
    }
    if (!deps.Roles.isAdmin(_0x8452c2.userId)) {
      if (deps.config.delGetUserIdList.includes(_0x1b2cca)) {
        await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
        deps.queryLock.clearUse(_0x8452c2);
        return;
      }
    }
    try {
      await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 稍等，正在通过用户ID获取粉丝列表...");
      deps.queryLock.startUse(_0x8452c2);
      const _0x4c5fa5 = await deps.robloxApi.get("/get-user-followers/" + encodeURIComponent(_0x1b2cca));
      const _0x3050db = _0x4c5fa5.data;
      if (!_0x3050db?.length) {
        await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 该用户目前没有任何粉丝...");
        deps.queryLock.clearUse(_0x8452c2);
        return;
      }
      let _0x26a22a = _0x3050db.length;
      let _0x515a40 = 10;
      let _0x2b2479 = 0;
      let _0x3f1dce = Math.ceil(_0x26a22a / _0x515a40);
      const _0x4aa668 = () => {
        const _0x1c46ef = _0x3050db.slice(_0x2b2479 * _0x515a40, _0x2b2479 * _0x515a40 + _0x515a40).filter(_0x514a68 => _0x514a68);
        return "👥 粉丝列表（最多展示 100 条）\n\n" + _0x1c46ef.map(_0x332ad4 => {
          return "· ID：" + _0x332ad4.id;
        }).join("\n") + "\n\n第 " + (_0x2b2479 + 1) + " / " + _0x3f1dce + " 页\n(20s) 发送「上一页 / 下一页」翻页";
      };
      await deps.Chat.send(_0x8452c2, _0x4aa668(), undefined, deps.kb.pagination());
      while (true) {
        const _0x482f51 = await _0x8452c2.prompt(20000);
        if (_0x482f51 == undefined) {
          await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 等待超时，已结束粉丝列表查询...");
          break;
        }
        if (_0x482f51.trim() == "/上一页" || _0x482f51.trim() == "上一页") {
          if (_0x2b2479 > 0) {
            _0x2b2479--;
            await deps.Chat.send(_0x8452c2, _0x4aa668(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 无法继续上一页了！");
          }
          continue;
        }
        if (_0x482f51.trim() == "/下一页" || _0x482f51.trim() == "下一页") {
          if (_0x2b2479 < _0x3f1dce) {
            _0x2b2479++;
            await deps.Chat.send(_0x8452c2, _0x4aa668(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 无法继续下一页了！");
          }
          continue;
        }
        await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 无效指令，操作已结束");
        break;
      }
      deps.queryLock.clearUse(_0x8452c2);
    } catch (_0xb6b0e7) {
      if (deps.config.deBug) {
        console.log(_0xb6b0e7);
      }
      deps.queryLock.clearUse(_0x8452c2);
      await deps.Chat.send(_0x8452c2, "<@" + _0x8452c2.userId + "> 请求失败，请稍后重试...");
    }
  },
  async getFollowingsInfo(_0x2b6c13, _0x445ce2) {
    if (!("" + _0x2b6c13)?.trim()) {
      await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 请输入用户Id");
      return;
    }
    if (!/^\d{1,17}$/.test(_0x2b6c13)) {
      await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 请输入正确的用户Id。\n> 例如： /获取关注列表 10032");
      return;
    }
    if (!deps.Roles.isAdmin(_0x445ce2.userId)) {
      if (deps.config.delGetUserIdList.includes(_0x2b6c13)) {
        await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 抱歉，您搜索的目标用户已被**屏蔽搜索**");
        deps.queryLock.clearUse(_0x445ce2);
        return;
      }
    }
    try {
      await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 稍等，正在通过用户ID获取关注列表...");
      deps.queryLock.startUse(_0x445ce2);
      const _0x162b52 = await deps.robloxApi.get("/get-user-followings/" + encodeURIComponent(_0x2b6c13));
      const _0x548596 = _0x162b52.data;
      if (!_0x548596?.length) {
        await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 该用户目前没有关注任何人...");
        deps.queryLock.clearUse(_0x445ce2);
        return;
      }
      let _0x104ea0 = _0x548596.length;
      let _0x44826d = 10;
      let _0x5e799c = 0;
      let _0x4b8e82 = Math.ceil(_0x104ea0 / _0x44826d);
      const _0x2fd23b = () => {
        const _0x127d0b = _0x548596.slice(_0x5e799c * _0x44826d, _0x5e799c * _0x44826d + _0x44826d).filter(_0x365fcb => _0x365fcb);
        return "👥 关注列表（最多展示 100 条）\n\n" + _0x127d0b.map(_0x43a483 => {
          return "· ID：" + _0x43a483.id;
        }).join("\n") + "\n\n第 " + (_0x5e799c + 1) + " / " + _0x4b8e82 + " 页\n(20s) 发送「上一页 / 下一页」翻页";
      };
      await deps.Chat.send(_0x445ce2, _0x2fd23b(), undefined, deps.kb.pagination());
      while (true) {
        const _0xe0c345 = await _0x445ce2.prompt(20000);
        if (_0xe0c345 == undefined) {
          await deps.Chat.send(_0x445ce2, "等待超时，已结束关注列表查询...");
          break;
        }
        if (_0xe0c345.trim() == "/上一页" || _0xe0c345.trim() == "上一页") {
          if (_0x5e799c > 0) {
            _0x5e799c--;
            await deps.Chat.send(_0x445ce2, _0x2fd23b(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 无法继续上一页了！");
          }
          continue;
        }
        if (_0xe0c345.trim() == "/下一页" || _0xe0c345.trim() == "下一页") {
          if (_0x5e799c < _0x4b8e82) {
            _0x5e799c++;
            await deps.Chat.send(_0x445ce2, _0x2fd23b(), undefined, deps.kb.pagination());
          } else {
            await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 无法继续下一页了！");
          }
          continue;
        }
        await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 无效指令，操作已结束");
        break;
      }
      deps.queryLock.clearUse(_0x445ce2);
    } catch (_0x48561b) {
      if (deps.config.deBug) {
        console.log(_0x48561b);
      }
      deps.queryLock.clearUse(_0x445ce2);
      await deps.Chat.send(_0x445ce2, "<@" + _0x445ce2.userId + "> 请求失败，请稍后重试...");
    }
  }
};
return { get relationsQuery() { return relationsQuery; } };
};
