'use strict';

module.exports = function create(deps) {
let activeContext = null;
deps.ctx.on("ready", async () => {
  deps.Roles.init({
    developerList: () => deps.config.developerList,
    adminList: () => deps.config.adminList,
    assistAdminList: () => [...new Set([...deps.config.assistAdminList, ...deps.config.riskAdminList])],
    sponsorList: () => deps.config.sponsorList,
    runtimeAdminList: () => deps.legacyBan.adminList
  });
  deps.OpLog.init(deps.ctx, deps.config);
  deps.legacyBan.init();
  deps.userLocal.init(deps.ctx, deps.config);
  deps.GiftCode.init(deps.ctx, deps.config);
  deps.MusicCtx.init(deps.ctx, deps.config, _0xd7606f => deps.media.imageHosting(_0xd7606f));
  deps.Chat.init(deps.config, deps.ctx);
  if (deps.config.useExpSystem) {
    await deps.points.init(deps.ctx, deps.config);
  }
  if (deps.config.useRiskControl) {
    await deps.riskControl.init(deps.ctx, deps.config);
  }
  if (deps.config.useAnnouncement) {
    await deps.announcementStore.init(deps.ctx, deps.config);
  }
  await deps.seenGuildStore.init(deps.ctx, deps.config);
  activeContext = deps.ctx;
});
return { get activeContext() { return activeContext; }, set activeContext(value) { activeContext = value; } };
};
