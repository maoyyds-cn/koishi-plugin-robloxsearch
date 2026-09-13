'use strict';

module.exports = function create(deps) {
async function runServerSearch(_0x21e4a2, _0x523355, _0x2ccf70) {
  if (!Number.isSafeInteger(_0x523355) || _0x523355 <= 0) {
    await deps.sendWithAt(_0x21e4a2, "Place ID 必须是正整数。");
    return;
  }
  if (_0x2ccf70.minPlaying !== undefined && _0x2ccf70.maxPlaying !== undefined && _0x2ccf70.minPlaying > _0x2ccf70.maxPlaying) {
    await deps.sendWithAt(_0x21e4a2, "最少人数不能大于最多人数。");
    return;
  }
  const _0x5215fb = await deps.queryFlow.begin(_0x21e4a2, {
    scope: "query",
    targetType: "game",
    targetId: String(_0x523355),
    queryText: String(_0x523355)
  });
  if (!_0x5215fb.ok) {
    return;
  }
  deps.queryLock.startUse(_0x21e4a2);
  try {
    const _0x447798 = Math.max(1, Math.min(10, Math.trunc(_0x2ccf70.limit || 5)));
    const _0x2ab6d2 = await deps.getSearchPage(deps.serverSearchPath(_0x523355, {
      ..._0x2ccf70,
      limit: _0x447798
    }), deps.isGameServerDto);
    if (!_0x2ab6d2.data.length) {
      await deps.sendWithAt(_0x21e4a2, "未找到符合条件的公开服务器。");
      return;
    }
    const _0x59c2ac = deps.createSearchSession(_0x21e4a2, "server", _0x2ab6d2, _0x447798, String(_0x523355));
    await deps.sendServerPage(_0x21e4a2, _0x2ab6d2, _0x59c2ac?.token, 1, _0x447798);
  } catch (_0x353c06) {
    await deps.queryFlow.cancel(_0x21e4a2, _0x5215fb.charge);
    const _0x1ab0d1 = deps.searchFailureMessage(_0x353c06, "服务器搜索失败，本次不计费，请稍后重试。");
    await deps.sendWithAt(_0x21e4a2, _0x1ab0d1);
  } finally {
    deps.queryLock.clearUse(_0x21e4a2);
  }
}
return { get runServerSearch() { return runServerSearch; } };
};
