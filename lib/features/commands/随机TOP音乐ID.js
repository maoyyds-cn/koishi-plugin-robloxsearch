'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/随机TOP音乐ID").action(async ({
  session: _0x497e73
}) => {
  if (await deps.legacyBan.verify(_0x497e73)) {
    return;
  }
  await deps.MusicCtx.getRandomMsuicInfo(_0x497e73);
});
return {  };
};
