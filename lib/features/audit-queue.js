'use strict';

module.exports = function create(deps) {
var MAX_LOG = 1000;
var auditQueue = {
  ctx: null,
  config: null,
  items: {},
  onChange: null,
  async init(_0x2ef2f4, _0xde13ef) {
    this.ctx = _0x2ef2f4;
    this.config = _0xde13ef;
    this.items = {};
    if (!_0xde13ef.useDatabase) {
      const _0x38105b = deps.import_path5.default.join(_0x2ef2f4.localstorage.basePath, _0xde13ef.basePath);
      if (!deps.import_fs5.default.existsSync(_0x38105b)) {
        deps.import_fs5.default.mkdirSync(_0x38105b, {
          recursive: true
        });
      }
      try {
        const _0x3b390d = await _0x2ef2f4.localstorage.getItem(_0xde13ef.basePath + "/auditQueue");
        if (_0x3b390d) {
          const _0x58527c = JSON.parse(_0x3b390d);
          _0x58527c.forEach(_0x3dd89b => {
            this.items[_0x3dd89b.id] = _0x3dd89b;
          });
        }
      } catch {}
    } else {
      _0x2ef2f4.database.extend("smm_roblox_audit_queue", {
        id: "string",
        status: "string",
        reporterId: "string",
        reporterName: "string",
        targetId: "string",
        targetType: "string",
        targetName: "string",
        robloxUserId: "string",
        violationType: "string",
        reason: "string",
        summary: "text",
        pic: "text",
        auditSource: "string",
        createdAt: "unsigned",
        verdict: "string",
        resolvedAt: "unsigned",
        resolvedBy: "string",
        appliedLevel: "string",
        appliedDays: "unsigned"
      }, {
        primary: "id",
        autoInc: false
      });
      const _0x2b02b9 = await _0x2ef2f4.database.get("smm_roblox_audit_queue", {});
      _0x2b02b9.forEach(_0x15cb8f => {
        this.items[_0x15cb8f.id] = _0x15cb8f;
      });
    }
    console.log("roblox风控 人工审核队列加载完成：待审 " + this.pending().length + " 条，历史 " + Object.keys(this.items).length + " 条");
  },
  genId() {
    return "A" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  },
  async enqueue(_0x2db470) {
    const _0x466c21 = {
      ..._0x2db470,
      id: this.genId(),
      status: "pending",
      createdAt: Date.now()
    };
    this.items[_0x466c21.id] = _0x466c21;
    await this.persist(_0x466c21);
    this.trim();
    this.notify();
    return _0x466c21;
  },
  async resolve(_0x33c917, _0x3d711e, _0x51da6f, _0x3e1f41) {
    const _0x451110 = this.items[_0x33c917];
    if (!_0x451110 || _0x451110.status !== "pending") {
      return null;
    }
    _0x451110.status = _0x3d711e === "violation" ? "approved" : "rejected";
    _0x451110.verdict = _0x3d711e;
    _0x451110.resolvedAt = Date.now();
    _0x451110.resolvedBy = _0x51da6f;
    if (_0x3e1f41) {
      _0x451110.appliedLevel = _0x3e1f41.level;
      _0x451110.appliedDays = _0x3e1f41.days;
    }
    await this.persist(_0x451110);
    this.notify();
    return _0x451110;
  },
  get(_0x11f74c) {
    return this.items[_0x11f74c];
  },
  pending() {
    return Object.values(this.items).filter(_0x4a13b2 => _0x4a13b2.status === "pending").sort((_0x3f4d4f, _0x16cd8e) => _0x16cd8e.createdAt - _0x3f4d4f.createdAt);
  },
  all(_0x14c71a = 200) {
    return Object.values(this.items).sort((_0x20c72c, _0x3ed502) => _0x3ed502.createdAt - _0x20c72c.createdAt).slice(0, _0x14c71a);
  },
  trim() {
    const _0x464b19 = Object.keys(this.items);
    if (_0x464b19.length <= MAX_LOG) {
      return;
    }
    const _0x19045c = Object.values(this.items).filter(_0xca67cf => _0xca67cf.status !== "pending").sort((_0x33c2d9, _0x216e73) => (_0x33c2d9.resolvedAt || _0x33c2d9.createdAt) - (_0x216e73.resolvedAt || _0x216e73.createdAt));
    let _0x111ee8 = _0x464b19.length - MAX_LOG;
    for (const _0x471707 of _0x19045c) {
      if (_0x111ee8-- <= 0) {
        break;
      }
      delete this.items[_0x471707.id];
      if (this.config?.useDatabase && this.ctx) {
        this.ctx.database.remove("smm_roblox_audit_queue", {
          id: _0x471707.id
        }).catch(() => {});
      }
    }
    if (!this.config?.useDatabase) {
      this.persistAll().catch(() => {});
    }
  },
  notify() {
    try {
      this.onChange?.();
    } catch {}
  },
  async persist(_0x4e4d4a) {
    if (this.config?.useDatabase && this.ctx) {
      const [_0x19e313] = await this.ctx.database.get("smm_roblox_audit_queue", {
        id: _0x4e4d4a.id
      });
      if (_0x19e313) {
        const {
          id: _0x6fadee,
          ..._0x4dba56
        } = _0x4e4d4a;
        await this.ctx.database.set("smm_roblox_audit_queue", {
          id: _0x4e4d4a.id
        }, _0x4dba56);
      } else {
        await this.ctx.database.create("smm_roblox_audit_queue", _0x4e4d4a);
      }
    } else {
      await this.persistAll();
    }
  },
  async persistAll() {
    if (this.ctx && this.config && !this.config.useDatabase) {
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/auditQueue", JSON.stringify(Object.values(this.items)));
    }
  }
};
return { get MAX_LOG() { return MAX_LOG; }, set MAX_LOG(value) { MAX_LOG = value; },
get auditQueue() { return auditQueue; }, set auditQueue(value) { auditQueue = value; } };
};
