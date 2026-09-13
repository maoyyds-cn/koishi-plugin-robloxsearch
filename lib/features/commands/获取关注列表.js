'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/获取关注列表 <userId:number>").userFields(["id"]).action(async ({
  session: _0xec776b
}, _0x26cc74) => {
  if (await deps.legacyBan.verify(_0xec776b)) {
    return;
  }
  if (deps.queryLock.isUse(_0xec776b)) {
    return deps.throttleHint(_0xec776b);
  }
  const _0x454e3e = await deps.queryFlow.begin(_0xec776b, {
    scope: "query",
    targetType: "user",
    targetId: "" + _0x26cc74,
    queryText: "" + _0x26cc74
  });
  if (!_0x454e3e.ok) {
    return;
  }
  await deps.relationsQuery.getFollowingsInfo("" + _0x26cc74, _0xec776b);
});
return {  };
};
