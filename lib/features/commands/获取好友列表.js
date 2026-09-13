'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/获取好友列表 <userId:number>").userFields(["id"]).action(async ({
  session: _0x552837
}, _0x3f7a0c) => {
  if (await deps.legacyBan.verify(_0x552837)) {
    return;
  }
  if (deps.queryLock.isUse(_0x552837)) {
    return deps.throttleHint(_0x552837);
  }
  const _0x26cefd = await deps.queryFlow.begin(_0x552837, {
    scope: "query",
    targetType: "user",
    targetId: "" + _0x3f7a0c,
    queryText: "" + _0x3f7a0c
  });
  if (!_0x26cefd.ok) {
    return;
  }
  await deps.relationsQuery.getFriendInfo("" + _0x3f7a0c, _0x552837);
});
return {  };
};
