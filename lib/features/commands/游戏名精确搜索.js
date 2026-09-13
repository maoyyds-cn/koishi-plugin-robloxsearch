'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/游戏名精确搜索 <keyword:text>").userFields(["id"]).action(async ({
  session: _0x58d1fb
}, _0x1c4c8c) => {
  if (await deps.legacyBan.verify(_0x58d1fb)) {
    return;
  }
  if (deps.queryLock.isUse(_0x58d1fb)) {
    return deps.throttleHint(_0x58d1fb);
  }
  const _0x298beb = await deps.queryFlow.begin(_0x58d1fb, {
    scope: "query",
    targetType: "game",
    queryText: _0x1c4c8c
  });
  if (!_0x298beb.ok) {
    return;
  }
  return await deps.gameQuery.getGameByKeyword(_0x1c4c8c, _0x58d1fb, true);
});
return {  };
};
