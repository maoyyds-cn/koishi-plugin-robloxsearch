'use strict';

module.exports = function create(deps) {
var ENTRY_FLAG = Symbol.for("smmcat-robloxservice/console-entry");
function addRobloxConsoleEntry(_0x2c7596) {
  const _0x2ef0af = _0x2c7596.console;
  if (!_0x2ef0af || _0x2ef0af[ENTRY_FLAG]) {
    return;
  }
  _0x2ef0af[ENTRY_FLAG] = true;
  _0x2c7596.on("dispose", () => {
    _0x2ef0af[ENTRY_FLAG] = false;
  });
  let _0x24b08c = (0, deps.import_path6.resolve)(deps.pluginRoot, "dist");
  if (!_0x24b08c.includes("node_modules")) {
    const _0x2c7c5c = (0, deps.import_path6.resolve)(_0x2c7596.baseDir || process.cwd(), "node_modules/koishi-plugin-smmcat-robloxservice/dist");
    if ((0, deps.import_fs6.existsSync)(_0x2c7c5c)) {
      _0x24b08c = _0x2c7c5c;
    }
  }
  _0x2c7596.console.addEntry({
    dev: (0, deps.import_path6.resolve)(deps.pluginRoot, "client/index.ts"),
    prod: _0x24b08c
  });
}
var RobloxAuditProvider = class extends deps.import_console.DataService {
  static {}
  static inject = ["console"];
  constructor(_0x4500c7) {
    super(_0x4500c7, "roblox-audit");
    addRobloxConsoleEntry(_0x4500c7);
    deps.auditQueue.onChange = () => this.refresh();
    _0x4500c7.console.addListener("roblox-audit/resolve", async (_0x3407fa, _0x390025) => {
      const _0x471642 = await deps.riskControl.resolveAudit(_0x3407fa, _0x390025, "控制台审核员");
      this.refresh();
      return {
        ok: _0x471642.ok,
        message: _0x471642.message
      };
    });
    _0x4500c7.console.addListener("roblox-audit/refresh", () => this.refresh());
  }
  async get() {
    return {
      pending: deps.auditQueue.pending(),
      log: deps.auditQueue.all(100)
    };
  }
};
return { get ENTRY_FLAG() { return ENTRY_FLAG; }, set ENTRY_FLAG(value) { ENTRY_FLAG = value; },
get addRobloxConsoleEntry() { return addRobloxConsoleEntry; },
get RobloxAuditProvider() { return RobloxAuditProvider; }, set RobloxAuditProvider(value) { RobloxAuditProvider = value; } };
};
