'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/限量品搜索 [keyword:text]").userFields(["id"]).action(async ({
  session
}, keyword) => {
  if (await deps.legacyBan.verify(session)) {
    return;
  }
  if (deps.queryLock.isUse(session)) {
    return deps.throttleHint(session);
  }
  await deps.runCatalogSearch(session, keyword, {
    limited: "true",
    showMarket: true
  });
});
return {  };
};