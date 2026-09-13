'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/关闭翻译").action(async ({
  session: _0x32b8f6
}) => {
  if (await deps.legacyBan.verify(_0x32b8f6)) {
    return;
  }
  await deps.userLocal.openOrCloseTranslate(_0x32b8f6, false);
});
return {  };
};
