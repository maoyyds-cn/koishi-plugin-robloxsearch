'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/用户名搜索 <username>").userFields(["id"]).action(async ({
  session: _0x42ada9
}, _0x4ed4de) => {
  if (await deps.legacyBan.verify(_0x42ada9)) {
    return;
  }
  if (deps.queryLock.isUse(_0x42ada9)) {
    return deps.throttleHint(_0x42ada9);
  }
  const _0x1651ea = await deps.queryFlow.begin(_0x42ada9, {
    scope: "user_query",
    targetType: "user",
    queryText: _0x4ed4de
  });
  if (!_0x1651ea.ok) {
    return;
  }
  await deps.userQuery.getUserDetailByUsername(_0x4ed4de, _0x42ada9);
});
return {  };
};
