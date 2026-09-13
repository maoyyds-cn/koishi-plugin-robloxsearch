'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/群组ID搜索 <groupid>").userFields(["id"]).action(async ({
  session: _0x27eec5
}, _0xf4bd68) => {
  if (await deps.legacyBan.verify(_0x27eec5)) {
    return;
  }
  if (deps.queryLock.isUse(_0x27eec5)) {
    return deps.throttleHint(_0x27eec5);
  }
  const _0x3dd30d = await deps.queryFlow.begin(_0x27eec5, {
    scope: "query",
    targetType: "group",
    targetId: "" + _0xf4bd68,
    queryText: "" + _0xf4bd68
  });
  if (!_0x3dd30d.ok) {
    return;
  }
  await deps.groupQuery.getGroupDetailByGroupId(_0xf4bd68, _0x27eec5);
});
return {  };
};
