'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/签到").userFields(["id"]).action(async ({
  session: _0x3856d7
}) => {
  if (await deps.legacyBan.verify(_0x3856d7)) {
    return;
  }
  if (!(await deps.guardSignin(_0x3856d7, deps.config))) return;
  if (!deps.config.useExpSystem) {
    await deps.userLocal.startSignin(_0x3856d7);
    return;
  }
  let _0x46d411 = 1;
  if (deps.config.useRiskControl) {
    const _0x29dfd2 = await deps.riskControl.guardQuery(_0x3856d7, {
      scope: "signin"
    });
    if (!_0x29dfd2.allowed) {
      if (_0x29dfd2.message) {
        await deps.Chat.send(_0x3856d7, _0x29dfd2.message);
      }
      return;
    }
    _0x46d411 = _0x29dfd2.signinMultiplier;
  }
  await deps.doSignIn(_0x3856d7, {
    multiplier: _0x46d411,
    signinExp: deps.config.signinExp,
    onLevelUp: _0x267295 => deps.points.onLevelUp(_0x3856d7, _0x267295)
  });
});
return {  };
};
