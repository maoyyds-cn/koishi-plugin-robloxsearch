'use strict';

module.exports = function create(deps) {
if (deps.config.useRiskControl) {
  deps.ctx.inject(["console"], _0x18f03f => {
    try {
      _0x18f03f.plugin(deps.RobloxAuditProvider);
    } catch (_0x574c82) {
      if (deps.config.deBug) {
        console.log("[roblox-audit console] 注册失败", _0x574c82);
      }
    }
  });
}
if (deps.config.useAnnouncement) {
  deps.ctx.inject(["console"], _0x2bbb75 => {
    try {
      _0x2bbb75.plugin(deps.RobloxAnnouncementProvider);
    } catch (_0x272bfd) {
      if (deps.config.deBug) {
        console.log("[roblox-announcement console] 注册失败", _0x272bfd);
      }
    }
  });
}
return {  };
};
