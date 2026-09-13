'use strict';

module.exports = function create(deps) {
var RobloxAnnouncementProvider = class extends deps.import_console2.DataService {
  static {}
  static inject = ["console"];
  constructor(_0x302866) {
    super(_0x302866, "roblox-announcement");
    deps.addRobloxConsoleEntry(_0x302866);
    deps.announcementStore.onChange = () => this.refresh();
    _0x302866.console.addListener("roblox-announcement/save", async _0x37407e => {
      const _0x3cbe71 = await deps.announcementStore.save(_0x37407e);
      this.refresh();
      return _0x3cbe71;
    });
    _0x302866.console.addListener("roblox-announcement/publish", async _0x3dcc9b => {
      const _0x27dae5 = await deps.announcementStore.publish(_0x3dcc9b);
      this.refresh();
      return _0x27dae5;
    });
    _0x302866.console.addListener("roblox-announcement/expire", async _0x6a724c => {
      const _0x56e372 = await deps.announcementStore.expire(_0x6a724c);
      this.refresh();
      return _0x56e372;
    });
    _0x302866.console.addListener("roblox-announcement/delete", async _0x48f125 => {
      const _0x33149a = await deps.announcementStore.remove(_0x48f125);
      this.refresh();
      return _0x33149a;
    });
    _0x302866.console.addListener("roblox-announcement/audience", async _0x489601 => {
      return deps.announcementStore.audiencePreview(Array.isArray(_0x489601) ? _0x489601 : [0]);
    });
    _0x302866.console.addListener("roblox-announcement/refresh", () => this.refresh());
  }
  async get() {
    return {
      list: deps.announcementStore.all(),
      stats: deps.announcementStore.deliveryStats()
    };
  }
};
return { get RobloxAnnouncementProvider() { return RobloxAnnouncementProvider; }, set RobloxAnnouncementProvider(value) { RobloxAnnouncementProvider = value; } };
};
