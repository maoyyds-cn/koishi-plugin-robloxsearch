'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/绑定统计").action(async ({
  session: _0x317a21
}) => {
  if (await deps.legacyBan.verify(_0x317a21)) {
    return;
  }
  await deps.userLocal.bindStatistics(_0x317a21);
});
return {  };
};
