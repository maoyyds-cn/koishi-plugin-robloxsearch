'use strict';

module.exports = function create(deps) {
async function runSearchPage(_0x3196cd, _0x2a2536, _0x406f1e, _0x2c56ed) {
  if (!_0x2a2536?.trim()) {
    await deps.sendWithAt(_0x3196cd, "请输入分页令牌。");
    return;
  }
  const _0x424dda = deps.searchSessions.get(_0x2a2536.trim(), _0x3196cd.userId, _0x406f1e);
  if (!_0x424dda) {
    await deps.sendWithAt(_0x3196cd, "分页令牌无效或已过期，请重新搜索。");
    return;
  }
  const _0x24befb = _0x2c56ed === "next" ? _0x424dda.nextCursor : _0x424dda.previousCursor;
  if (!_0x24befb) {
    await deps.sendWithAt(_0x3196cd, _0x2c56ed === "next" ? "已是最后一页。" : "已是第一页。");
    return;
  }
  if (deps.config.useRiskControl) {
    const _0xda8453 = await deps.riskControl.guardQuery(_0x3196cd, {
      scope: "query"
    });
    if (!_0xda8453.allowed) {
      if (_0xda8453.message) {
        await deps.Chat.send(_0x3196cd, _0xda8453.message, _0xda8453.message);
      }
      return;
    }
  }
  deps.queryLock.startUse(_0x3196cd);
  try {
    if (_0x406f1e === "server") {
      const _0x4ed5ae = Number(_0x424dda.resourceId);
      if (!Number.isSafeInteger(_0x4ed5ae) || _0x4ed5ae <= 0) {
        await deps.sendWithAt(_0x3196cd, "服务器分页令牌无效，请重新搜索。");
        return;
      }
      const _0xaee016 = await deps.getSearchPage(deps.pageSearchPath("/search-game-servers/" + _0x4ed5ae, _0x24befb), deps.isGameServerDto);
      const _0x59a200 = _0x2c56ed === "next" ? _0x424dda.page + 1 : Math.max(1, _0x424dda.page - 1);
      deps.searchSessions.update(_0x424dda, {
        nextCursor: _0xaee016.nextPageCursor,
        previousCursor: _0xaee016.previousPageCursor,
        page: _0x59a200,
        total: _0xaee016.matchedCount,
        pageSize: _0x424dda.pageSize
      });
      await deps.sendServerPage(_0x3196cd, _0xaee016, _0x424dda.token, _0x59a200, _0x424dda.pageSize);
      return;
    }
    const _0x248413 = await deps.getSearchPage(deps.pageSearchPath("/search-catalog", _0x24befb), deps.isCatalogItemDto);
    const _0x5e20d9 = _0x2c56ed === "next" ? _0x424dda.page + 1 : Math.max(1, _0x424dda.page - 1);
    deps.searchSessions.update(_0x424dda, {
      nextCursor: _0x248413.nextPageCursor,
      previousCursor: _0x248413.previousPageCursor,
      page: _0x5e20d9,
      total: _0x248413.matchedCount,
      pageSize: _0x424dda.pageSize
    });
    await deps.sendCatalogPage(_0x3196cd, _0x248413, _0x424dda.token, _0x5e20d9, _0x424dda.pageSize, deps.parseCatalogSessionMeta(_0x424dda.resourceId));
  } catch (_0x2a659a) {
    const _0x2ed7c2 = deps.searchFailureMessage(_0x2a659a, "分页请求失败，请重新执行搜索。");
    await deps.sendWithAt(_0x3196cd, _0x2ed7c2);
  } finally {
    deps.queryLock.clearUse(_0x3196cd);
  }
}
return { get runSearchPage() { return runSearchPage; } };
};
