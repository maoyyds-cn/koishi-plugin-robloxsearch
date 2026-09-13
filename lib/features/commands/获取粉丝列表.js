'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/获取粉丝列表 <userId:number>").userFields(["id"]).action(async ({
  session: _0x3b924d
}, _0x5737a0) => {
  if (await deps.legacyBan.verify(_0x3b924d)) {
    return;
  }
  if (deps.queryLock.isUse(_0x3b924d)) {
    return deps.throttleHint(_0x3b924d);
  }
  const _0x3672d3 = await deps.queryFlow.begin(_0x3b924d, {
    scope: "query",
    targetType: "user",
    targetId: "" + _0x5737a0,
    queryText: "" + _0x5737a0
  });
  if (!_0x3672d3.ok) {
    return;
  }
  await deps.relationsQuery.getFollowersInfo("" + _0x5737a0, _0x3b924d);
});
return {  };
};
