'use strict';

module.exports = function create(deps) {
if (deps.config.useAnnouncement) {
  deps.ctx.before("command/execute", _0x365a7b => {
    const _0x267ee3 = _0x365a7b.session;
    if (!_0x267ee3?.userId) {
      return;
    }
    setTimeout(() => {
      deps.deliverAnnouncements(_0x267ee3, deps.config).catch(_0x4b0a75 => {
        if (deps.config.deBug) {
          console.log("[announcement] 投放异常", _0x4b0a75);
        }
      });
    }, 1200);
  });
}
return {  };
};
