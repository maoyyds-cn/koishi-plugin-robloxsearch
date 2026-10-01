'use strict';

module.exports = function create(deps) {
let activeContext = null;
// 逐个初始化并隔离失败：任一模块 init 抛错时，其余模块仍能完成初始化，
// 且日志能明确指出是哪个模块失败（否则表现为"加载成功但功能静默失效"）。
async function initStep(_0x4a1e2b, _0x2c3f45, _0x1d6f8a) {
  try {
    await _0x1d6f8a();
  } catch (_0x3e7b21) {
    _0x4a1e2b.ctx.logger?.error?.(`[robloxsearch] 模块 ${_0x2c3f45} 初始化失败：${_0x3e7b21?.message || _0x3e7b21}`);
    if (_0x4a1e2b.config.deBug) {
      _0x4a1e2b.ctx.logger?.error?.(`[robloxsearch] 堆栈：${_0x3e7b21?.stack || "无"}`);
    }
  }
}
deps.ctx.on("ready", async () => {
  await initStep(deps, "Roles", () => deps.Roles.init({
    developerList: () => deps.config.developerList,
    adminList: () => deps.config.adminList,
    assistAdminList: () => [...new Set([...deps.config.assistAdminList, ...deps.config.riskAdminList])],
    sponsorList: () => deps.config.sponsorList,
    runtimeAdminList: () => deps.legacyBan.adminList
  }));
  await initStep(deps, "OpLog", () => deps.OpLog.init(deps.ctx, deps.config));
  await initStep(deps, "legacyBan", () => deps.legacyBan.init());
  await initStep(deps, "userLocal", () => deps.userLocal.init(deps.ctx, deps.config));
  await initStep(deps, "GiftCode", () => deps.GiftCode.init(deps.ctx, deps.config));
  await initStep(deps, "MusicCtx", () => deps.MusicCtx.init(deps.ctx, deps.config, _0xd7606f => deps.media.imageHosting(_0xd7606f)));
  await initStep(deps, "Chat", () => deps.Chat.init(deps.config, deps.ctx));
  if (deps.config.useExpSystem) {
    await initStep(deps, "points", () => deps.points.init(deps.ctx, deps.config));
  }
  if (deps.config.useRiskControl) {
    await initStep(deps, "riskControl", () => deps.riskControl.init(deps.ctx, deps.config));
  }
  if (deps.config.useAnnouncement) {
    await initStep(deps, "announcementStore", () => deps.announcementStore.init(deps.ctx, deps.config));
  }
  await initStep(deps, "seenGuildStore", () => deps.seenGuildStore.init(deps.ctx, deps.config));
  // activeContext 供 legacyBan 在命令执行期刷新权限使用，
  // 即使部分模块初始化失败也必须赋值，否则相关命令会因 null 报错。
  activeContext = deps.ctx;
});
return { get activeContext() { return activeContext; }, set activeContext(value) { activeContext = value; } };
};
