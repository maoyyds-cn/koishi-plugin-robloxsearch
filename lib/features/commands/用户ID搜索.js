'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/用户ID搜索 <userId:number>").userFields(["id"]).action(async ({
  session: _0x1c461a
}, _0xb1510b) => {
  if (await deps.legacyBan.verify(_0x1c461a)) {
    return;
  }
  if (deps.queryLock.isUse(_0x1c461a)) {
    return deps.throttleHint(_0x1c461a);
  }
  const _0x107e9b = await deps.queryFlow.begin(_0x1c461a, {
    scope: "user_query",
    targetType: "user",
    targetId: "" + _0xb1510b,
    queryText: "" + _0xb1510b
  });
  if (!_0x107e9b.ok) {
    return;
  }
  await deps.userQuery.getUserDetailByUserId("" + _0xb1510b, _0x1c461a);
});
return {  };
};
