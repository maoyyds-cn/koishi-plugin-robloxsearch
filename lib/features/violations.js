'use strict';

module.exports = function create(deps) {
function keyOf(_0x4d00bf, _0x25b7a2) {
  return _0x4d00bf + ":" + _0x25b7a2;
}
var violationLib = {
  ctx: null,
  config: null,
  lib: {},
  async init(_0x2c31e2, _0x863268) {
    this.ctx = _0x2c31e2;
    this.config = _0x863268;
    this.lib = {};
    if (!_0x863268.useDatabase) {
      const _0x29e43f = deps.import_path4.default.join(_0x2c31e2.localstorage.basePath, _0x863268.basePath);
      if (!deps.import_fs4.default.existsSync(_0x29e43f)) {
        deps.import_fs4.default.mkdirSync(_0x29e43f, {
          recursive: true
        });
      }
      try {
        const _0x3d0ed0 = await _0x2c31e2.localstorage.getItem(_0x863268.basePath + "/violationLib");
        if (_0x3d0ed0) {
          this.lib = JSON.parse(_0x3d0ed0);
        }
      } catch {}
    } else {
      _0x2c31e2.database.extend("smm_roblox_violation_lib", {
        targetName: "string",
        targetId: "string",
        targetType: "string",
        queryType: "string",
        violationReason: "string",
        severity: "string",
        sourceViolationId: "string",
        addedAt: "unsigned",
        addedBy: "string",
        hitCount: "unsigned",
        lastHitAt: "unsigned",
        expiresAt: "unsigned"
      }, {
        primary: ["targetType", "targetId"],
        autoInc: false
      });
      const _0x35c82c = await _0x2c31e2.database.get("smm_roblox_violation_lib", {});
      _0x35c82c.forEach(_0x3e3b88 => {
        this.lib[keyOf(_0x3e3b88.targetType, _0x3e3b88.targetId)] = _0x3e3b88;
      });
    }
    console.log("roblox风控 违规库加载完成：" + Object.keys(this.lib).length + " 条");
  },
  async lookup(_0x143a2a, _0x4bd8bc) {
    const _0x518945 = this.lib[keyOf(_0x4bd8bc, _0x143a2a)];
    if (!_0x518945) {
      return null;
    }
    if (_0x518945.expiresAt && _0x518945.expiresAt < Date.now()) {
      await this.remove(_0x143a2a, _0x4bd8bc);
      return null;
    }
    _0x518945.hitCount += 1;
    _0x518945.lastHitAt = Date.now();
    await this.persist(_0x518945);
    return _0x518945;
  },
  async add(_0x22a1f5) {
    const _0x5c163a = (this.config?.violationLibTTL ?? 365) * 24 * 60 * 60 * 1000;
    const _0x5cebd5 = Date.now();
    const _0x514479 = this.lib[keyOf(_0x22a1f5.targetType, _0x22a1f5.targetId)];
    const _0x396a55 = {
      targetName: _0x22a1f5.targetName || _0x514479?.targetName || _0x22a1f5.targetId,
      targetId: _0x22a1f5.targetId,
      targetType: _0x22a1f5.targetType,
      queryType: _0x22a1f5.queryType || _0x514479?.queryType || "",
      violationReason: _0x22a1f5.violationReason || _0x514479?.violationReason || "敏感内容",
      severity: _0x22a1f5.severity || _0x514479?.severity || "high",
      sourceViolationId: _0x22a1f5.sourceViolationId || _0x514479?.sourceViolationId || "",
      addedAt: _0x514479?.addedAt || _0x5cebd5,
      addedBy: _0x22a1f5.addedBy || _0x514479?.addedBy || "auto",
      hitCount: _0x514479?.hitCount || 0,
      lastHitAt: _0x514479?.lastHitAt || 0,
      expiresAt: _0x22a1f5.expiresAt || _0x5cebd5 + _0x5c163a
    };
    this.lib[keyOf(_0x396a55.targetType, _0x396a55.targetId)] = _0x396a55;
    await this.persist(_0x396a55);
    return _0x396a55;
  },
  async remove(_0x32fd83, _0x182eda) {
    const _0x2b4cce = keyOf(_0x182eda, _0x32fd83);
    if (!this.lib[_0x2b4cce]) {
      return false;
    }
    delete this.lib[_0x2b4cce];
    if (this.config?.useDatabase && this.ctx) {
      await this.ctx.database.remove("smm_roblox_violation_lib", {
        targetType: _0x182eda,
        targetId: _0x32fd83
      });
    } else {
      await this.persistAll();
    }
    return true;
  },
  async persist(_0x52aebf) {
    if (this.config?.useDatabase && this.ctx) {
      const [_0x49a823] = await this.ctx.database.get("smm_roblox_violation_lib", {
        targetType: _0x52aebf.targetType,
        targetId: _0x52aebf.targetId
      });
      if (_0x49a823) {
        const {
          targetType: _0x5e96cf,
          targetId: _0x691497,
          ..._0xfa650e
        } = _0x52aebf;
        await this.ctx.database.set("smm_roblox_violation_lib", {
          targetType: _0x52aebf.targetType,
          targetId: _0x52aebf.targetId
        }, _0xfa650e);
      } else {
        await this.ctx.database.create("smm_roblox_violation_lib", _0x52aebf);
      }
    } else {
      await this.persistAll();
    }
  },
  async persistAll() {
    if (this.ctx && this.config && !this.config.useDatabase) {
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/violationLib", JSON.stringify(this.lib));
    }
  },
  count() {
    return Object.keys(this.lib).length;
  }
};
return { get keyOf() { return keyOf; },
get violationLib() { return violationLib; }, set violationLib(value) { violationLib = value; } };
};
