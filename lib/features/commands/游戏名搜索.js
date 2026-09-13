'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/游戏名搜索 <keyword:text>").userFields(["id"]).action(async ({
  session: _0x2382a1
}, _0x3d1f0a) => {
  if (await deps.legacyBan.verify(_0x2382a1)) {
    return;
  }
  if (deps.queryLock.isUse(_0x2382a1)) {
    return deps.throttleHint(_0x2382a1);
  }
  const _0x398883 = await deps.queryFlow.begin(_0x2382a1, {
    scope: "query",
    targetType: "game",
    queryText: _0x3d1f0a
  });
  if (!_0x398883.ok) {
    return;
  }
  await deps.gameQuery.getGameByKeyword(_0x3d1f0a, _0x2382a1);
});
return {  };
};
