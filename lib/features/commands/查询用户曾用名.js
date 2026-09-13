'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/查询用户曾用名 <username>").userFields(["id"]).action(async ({
  session: _0x5023df
}, _0xddbf95) => {
  if (await deps.legacyBan.verify(_0x5023df)) {
    return;
  }
  if (deps.queryLock.isUse(_0x5023df)) {
    return deps.throttleHint(_0x5023df);
  }
  const _0x5c38f0 = await deps.queryFlow.begin(_0x5023df, {
    scope: "user_query",
    targetType: "user",
    queryText: _0xddbf95
  });
  if (!_0x5c38f0.ok) {
    return;
  }
  await deps.userQuery.getUsernameHistoryByUsername(_0xddbf95, _0x5023df);
});
return {  };
};
