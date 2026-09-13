'use strict';

module.exports = function create(deps) {
var MEMORY_LIMIT = 300;
var OpLog = {
  ctx: null,
  config: null,
  memory: [],
  init(_0x412697, _0x2e98de) {
    this.ctx = _0x412697;
    this.config = _0x2e98de;
    if (_0x2e98de.useDatabase) {
      _0x412697.model.extend("smm_roblox_op_log", {
        id: "unsigned",
        operatorId: {
          type: "string",
          length: 255,
          nullable: false
        },
        operatorRole: {
          type: "string",
          length: 32,
          nullable: false
        },
        action: {
          type: "string",
          length: 255,
          nullable: false
        },
        detail: "text",
        result: {
          type: "string",
          length: 16,
          nullable: false
        },
        createdAt: "timestamp"
      }, {
        primary: "id",
        autoInc: true
      });
    }
  },
  async record(_0x56b320) {
    const _0x32bbdc = {
      ..._0x56b320,
      createdAt: new Date()
    };
    this.memory.push(_0x32bbdc);
    if (this.memory.length > MEMORY_LIMIT) {
      this.memory.shift();
    }
    if (this.config?.useDatabase && this.ctx) {
      try {
        await this.ctx.database.create("smm_roblox_op_log", _0x32bbdc);
      } catch (_0x140040) {
        if (this.config?.deBug) {
          console.log("[opLog] 写库失败", _0x140040);
        }
      }
    }
  },
  async list(_0x1f23bf = 10) {
    if (this.config?.useDatabase && this.ctx) {
      try {
        return await this.ctx.database.select("smm_roblox_op_log").orderBy("id", "desc").limit(_0x1f23bf).execute();
      } catch (_0x14ffc0) {
        if (this.config?.deBug) {
          console.log("[opLog] 查询失败，回退内存", _0x14ffc0);
        }
      }
    }
    return this.memory.slice(-_0x1f23bf).reverse();
  }
};
return { get MEMORY_LIMIT() { return MEMORY_LIMIT; }, set MEMORY_LIMIT(value) { MEMORY_LIMIT = value; },
get OpLog() { return OpLog; }, set OpLog(value) { OpLog = value; } };
};
