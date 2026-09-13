'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/游戏ID搜索 <placeId:number>").userFields(["id"]).action(async ({
  session: _0x3b96df
}, _0x38a96c) => {
  if (await deps.legacyBan.verify(_0x3b96df)) {
    return;
  }
  if (deps.queryLock.isUse(_0x3b96df)) {
    return deps.throttleHint(_0x3b96df);
  }
  const _0x29ebc = await deps.queryFlow.begin(_0x3b96df, {
    scope: "query",
    targetType: "game",
    targetId: "" + _0x38a96c,
    queryText: "" + _0x38a96c
  });
  if (!_0x29ebc.ok) {
    return;
  }
  await deps.gameQuery.getGameByPlaceId("" + _0x38a96c, _0x3b96df);
});
return {  };
};
