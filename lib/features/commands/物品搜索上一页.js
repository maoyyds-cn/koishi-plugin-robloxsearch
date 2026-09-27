'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/物品搜索上一页 <token:text>").userFields(["id"]).action(async ({
  session
}, token) => {
  if (await deps.legacyBan.verify(session)) {
    return;
  }
  if (deps.queryLock.isUse(session)) {
    return deps.throttleHint(session);
  }
  await deps.runSearchPage(session, token, "catalog", "previous");
});
return {  };
};