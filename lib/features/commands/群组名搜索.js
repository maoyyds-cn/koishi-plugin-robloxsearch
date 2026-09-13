'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/群组名搜索 <groupName:text>").userFields(["id"]).action(async ({
  session: _0x4605f4
}, _0x2b0ca5) => {
  if (await deps.legacyBan.verify(_0x4605f4)) {
    return;
  }
  if (deps.queryLock.isUse(_0x4605f4)) {
    return deps.throttleHint(_0x4605f4);
  }
  const _0x478032 = await deps.queryFlow.begin(_0x4605f4, {
    scope: "query",
    targetType: "group",
    queryText: _0x2b0ca5
  });
  if (!_0x478032.ok) {
    return;
  }
  await deps.groupQuery.getGroupDetailByGroupName(_0x2b0ca5, _0x4605f4);
});
return {  };
};
