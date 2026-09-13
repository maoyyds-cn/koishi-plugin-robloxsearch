'use strict';

module.exports = function create(deps) {
var UPDATE_INTERVAL = 300000;
var seenGuildStore = {
  ctx: null,
  config: null,
  cache: {},
  async init(_0x50ec9f, _0x11007d) {
    this.ctx = _0x50ec9f;
    this.config = _0x11007d;
    this.cache = {};
    if (_0x11007d.useDatabase) {
      _0x50ec9f.database.extend("smm_roblox_seen_guild", {
        guildId: "string",
        platform: "string",
        firstSeenAt: "unsigned",
        lastSeenAt: "unsigned"
      }, {
        primary: "guildId",
        autoInc: false
      });
      try {
        for (const _0x4b12c5 of await _0x50ec9f.database.get("smm_roblox_seen_guild", {})) {
          this.cache[_0x4b12c5.guildId] = _0x4b12c5;
        }
      } catch (_0x5584a5) {
        if (_0x11007d.deBug) {
          console.log("[seenGuild] 数据库加载失败", _0x5584a5);
        }
      }
    } else {
      try {
        const _0x1dcf01 = await _0x50ec9f.localstorage.getItem(_0x11007d.basePath + "/seenGuilds");
        this.cache = _0x1dcf01 ? JSON.parse(_0x1dcf01) : {};
      } catch {
        this.cache = {};
      }
    }
    _0x50ec9f.on("message", _0x18be1e => {
      this.record(_0x18be1e).catch(_0xf63893 => {
        if (_0x11007d.deBug) {
          console.log("[seenGuild] 登记失败", _0xf63893);
        }
      });
    });
  },
  async record(_0x30aa7f) {
    const _0x154681 = _0x30aa7f.guildId;
    if (!_0x154681) {
      return;
    }
    const _0x41f78a = Date.now();
    const _0x2c6412 = this.cache[_0x154681];
    if (_0x2c6412 && _0x41f78a - _0x2c6412.lastSeenAt < UPDATE_INTERVAL) {
      return;
    }
    const _0x2c297d = _0x2c6412 ? {
      ..._0x2c6412,
      lastSeenAt: _0x41f78a
    } : {
      guildId: _0x154681,
      platform: _0x30aa7f.platform,
      firstSeenAt: _0x41f78a,
      lastSeenAt: _0x41f78a
    };
    this.cache[_0x154681] = _0x2c297d;
    if (this.config.useDatabase) {
      await this.ctx.database.upsert("smm_roblox_seen_guild", [_0x2c297d]);
    } else {
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/seenGuilds", JSON.stringify(this.cache));
    }
  },
  list() {
    return Object.values(this.cache);
  }
};
return { get UPDATE_INTERVAL() { return UPDATE_INTERVAL; }, set UPDATE_INTERVAL(value) { UPDATE_INTERVAL = value; },
get seenGuildStore() { return seenGuildStore; }, set seenGuildStore(value) { seenGuildStore = value; } };
};
