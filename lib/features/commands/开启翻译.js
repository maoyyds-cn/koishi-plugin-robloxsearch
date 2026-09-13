'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/开启翻译").action(async ({
  session: _0x194546
}) => {
  if (await deps.legacyBan.verify(_0x194546)) {
    return;
  }
  await deps.userLocal.openOrCloseTranslate(_0x194546, true);
});
return {  };
};
