'use strict';

module.exports = function create(deps) {
var riskStore = {
  ctx: null,
  config: null,
  states: {},
  async init(_0x3d922d, _0x427622) {
    this.ctx = _0x3d922d;
    this.config = _0x427622;
    this.states = {};
    if (!_0x427622.useDatabase) {
      const _0x4875c0 = deps.import_path3.default.join(_0x3d922d.localstorage.basePath, _0x427622.basePath, "riskState");
      if (!deps.import_fs3.default.existsSync(_0x4875c0)) {
        deps.import_fs3.default.mkdirSync(_0x4875c0, {
          recursive: true
        });
      }
      const _0x2d340 = await deps.import_promises3.default.readdir(_0x4875c0);
      await Promise.all(_0x2d340.map(_0x437efb => (async () => {
        try {
          const _0x480b09 = await _0x3d922d.localstorage.getItem(_0x427622.basePath + "/riskState/" + _0x437efb);
          if (_0x480b09) {
            this.states[_0x437efb] = this.normalize(JSON.parse(_0x480b09), _0x437efb);
          }
        } catch {}
      })()));
      console.log("roblox风控 用户状态加载完成：" + Object.keys(this.states).length + " 位");
    } else {
      _0x3d922d.database.extend("smm_roblox_risk_state", {
        userId: "string",
        activeRestrictions: "json",
        violationCounts: "json",
        observation: "json",
        history: "json"
      }, {
        primary: "userId",
        autoInc: false
      });
      const _0x49ee45 = await _0x3d922d.database.get("smm_roblox_risk_state", {});
      _0x49ee45.forEach(_0x22a39d => {
        this.states[_0x22a39d.userId] = this.normalize(_0x22a39d, _0x22a39d.userId);
      });
      console.log("roblox风控 从数据库加载用户状态：" + _0x49ee45.length + " 位");
    }
  },
  newState(_0x4e4762) {
    return {
      userId: _0x4e4762,
      activeRestrictions: [],
      violationCounts: {
        SENSITIVE_QUERY: {
          total: 0,
          lastAt: 0,
          windowStart: 0
        },
        BLACKLIST_HIT: {
          total: 0,
          lastAt: 0,
          windowStart: 0
        },
        MALICIOUS_PROBE: {
          total: 0,
          lastAt: 0,
          windowStart: 0
        },
        EVADE_AUDIT: {
          total: 0,
          lastAt: 0,
          windowStart: 0
        }
      },
      observation: null,
      history: []
    };
  },
  normalize(_0x36e6a, _0x565c3a) {
    const _0x35ce54 = this.newState(_0x565c3a);
    return {
      ..._0x35ce54,
      ..._0x36e6a,
      userId: _0x565c3a,
      activeRestrictions: _0x36e6a?.activeRestrictions || [],
      violationCounts: {
        ..._0x35ce54.violationCounts,
        ...(_0x36e6a?.violationCounts || {})
      },
      history: _0x36e6a?.history || [],
      observation: _0x36e6a?.observation || null
    };
  },
  get(_0x4c3a6b) {
    return this.states[_0x4c3a6b];
  },
  ensure(_0x2195a1) {
    if (!this.states[_0x2195a1]) {
      this.states[_0x2195a1] = this.newState(_0x2195a1);
    }
    return this.states[_0x2195a1];
  },
  cleanExpired(_0x3d6662) {
    const _0x361b92 = Date.now();
    const _0x50df04 = _0x3d6662.activeRestrictions.length;
    _0x3d6662.activeRestrictions = _0x3d6662.activeRestrictions.filter(_0x423d14 => _0x423d14.expiresAt > _0x361b92);
    return _0x3d6662.activeRestrictions.length !== _0x50df04;
  },
  getEffectiveLevel(_0x515dd5) {
    const _0x399f8e = this.states[_0x515dd5];
    if (!_0x399f8e) {
      return "L0";
    }
    this.cleanExpired(_0x399f8e);
    const _0x354fe8 = deps.mergeRestrictions(_0x399f8e.activeRestrictions);
    if (_0x354fe8) {
      return _0x354fe8.level;
    } else {
      return "L0";
    }
  },
  getExpiresAt(_0x2e4098) {
    const _0x53f4ea = this.states[_0x2e4098];
    if (!_0x53f4ea) {
      return 0;
    }
    const _0x5268a4 = deps.mergeRestrictions(_0x53f4ea.activeRestrictions);
    if (_0x5268a4) {
      return _0x5268a4.expiresAt;
    } else {
      return 0;
    }
  },
  isInObservation(_0x5cbf15) {
    const _0xd1066 = Date.now();
    if (_0x5cbf15.activeRestrictions.some(_0x2f47cd => _0x2f47cd.expiresAt > _0xd1066)) {
      return false;
    }
    let _0x3ffa20 = 0;
    for (const _0x2974f2 of _0x5cbf15.history) {
      _0x3ffa20 = Math.max(_0x3ffa20, _0x2974f2.createdAt);
    }
    const _0x58a7c7 = [..._0x5cbf15.activeRestrictions];
    let _0x24487e = 0;
    for (const _0x20c6c3 of _0x58a7c7) {
      _0x24487e = Math.max(_0x24487e, _0x20c6c3.expiresAt);
    }
    const _0x46e95b = Math.max(_0x24487e, _0x5cbf15.observation?.until ? _0x5cbf15.observation.until - deps.OBSERVATION_PERIOD : 0);
    return _0x46e95b > 0 && _0xd1066 < _0x46e95b + deps.OBSERVATION_PERIOD;
  },
  activeCount(_0x4e72fa, _0x525637, _0x4772d6) {
    const _0x5dccc6 = _0x4e72fa.violationCounts[_0x525637];
    if (!_0x4772d6) {
      return _0x5dccc6.total + 1;
    }
    const _0x397fab = Date.now();
    const _0x29d013 = _0x4e72fa.history.filter(_0x193f39 => _0x193f39.type === _0x525637 && _0x397fab - _0x193f39.createdAt <= _0x4772d6).length;
    return _0x29d013 + 1;
  },
  genId() {
    return Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  },
  async recordViolation(_0x2bfd07, _0x1a3420, _0x118d90, _0x21d835 = {}) {
    const _0x40143a = this.ensure(_0x1a3420);
    this.cleanExpired(_0x40143a);
    const _0x524a4c = deps.getGradient(_0x118d90, 1);
    const _0x432de7 = this.activeCount(_0x40143a, _0x118d90, _0x524a4c.window);
    let _0x473e58 = deps.getGradient(_0x118d90, _0x432de7);
    let _0x71b7a7 = _0x473e58.level;
    let _0x35530a = _0x473e58.duration;
    if (this.isInObservation(_0x40143a)) {
      _0x71b7a7 = deps.bumpLevel(_0x71b7a7);
      _0x35530a = Math.max(_0x35530a, deps.LEVEL_DEFAULT_DURATION[_0x71b7a7]);
    }
    const _0x4cbd23 = deps.pointsStore.get(_0x1a3420)?.level ?? 0;
    _0x35530a = deps.applyLevelCooldownDiscount(_0x71b7a7, _0x35530a, _0x4cbd23);
    const _0x56a27f = _0x40143a.violationCounts[_0x118d90];
    _0x56a27f.total += 1;
    _0x56a27f.lastAt = Date.now();
    if (!_0x56a27f.windowStart) {
      _0x56a27f.windowStart = Date.now();
    }
    const _0x300c84 = {
      id: this.genId(),
      userId: _0x1a3420,
      type: _0x118d90,
      level: _0x71b7a7,
      reason: _0x21d835.reason || _0x118d90,
      targetName: _0x21d835.targetName,
      targetType: _0x21d835.targetType,
      operatorRole: "system",
      auditSource: _0x21d835.auditSource,
      createdAt: Date.now()
    };
    _0x40143a.history.push(_0x300c84);
    if (_0x40143a.history.length > 500) {
      _0x40143a.history.splice(0, _0x40143a.history.length - 500);
    }
    const _0x46e0f9 = Date.now();
    const _0x14fa12 = {
      id: this.genId(),
      type: _0x118d90,
      level: _0x71b7a7,
      startedAt: _0x46e0f9,
      duration: _0x35530a,
      expiresAt: _0x46e0f9 + _0x35530a,
      sourceViolationId: _0x300c84.id
    };
    _0x40143a.activeRestrictions.push(_0x14fa12);
    const _0x472845 = deps.mergeRestrictions(_0x40143a.activeRestrictions);
    const _0x4d8605 = _0x472845 ? _0x472845.level : _0x71b7a7;
    const _0x5166b3 = _0x472845 ? _0x472845.expiresAt : _0x14fa12.expiresAt;
    _0x40143a.observation = {
      inObservation: false,
      until: _0x5166b3 + deps.OBSERVATION_PERIOD
    };
    await this.save(_0x1a3420);
    await this.deductOnViolation(_0x2bfd07, _0x1a3420, _0x118d90);
    const _0x120d54 = _0x35530a >= deps.MAX_DURATION;
    const _0x363c58 = Math.round(_0x35530a / deps.DAY2);
    return {
      level: _0x4d8605,
      expiresAt: _0x5166b3,
      durationDays: _0x363c58,
      isMaxLimit: _0x120d54,
      message: deps.avatarAt(_0x1a3420) + " " + this.restrictionMessage(_0x4d8605, _0x363c58, _0x120d54, _0x118d90)
    };
  },
  async deductOnViolation(_0x206a72, _0x54bf74, _0x44fc92) {
    const _0x4723db = deps.VIOLATION_DEDUCT[_0x44fc92];
    if (!_0x4723db) {
      return;
    }
    const _0x401a0b = await deps.pointsStore.ensure(_0x54bf74);
    if (_0x206a72) {
      await deps.pointsStore.changePoints(_0x206a72, -_0x4723db.points, "violation", _0x44fc92);
    } else {
      await deps.pointsStore.changePointsByUserId(_0x54bf74, -_0x4723db.points, "violation", _0x44fc92);
    }
    deps.deductExp(_0x401a0b, _0x4723db.exp);
    await deps.pointsStore.recordExp(_0x401a0b, -_0x4723db.exp, "violation", _0x44fc92);
    await deps.pointsStore.save(_0x54bf74);
  },
  restrictionMessage(_0x183399, _0x661749, _0x2b4f03, _0x34f063) {
    const _0x587511 = _0x34f063 ? "（" + this.typeName(_0x34f063) + "）" : "";
    if (_0x183399 === "L0") {
      return "";
    }
    const _0x3683f3 = _0x2b4f03 ? "10 年（上限）" : _0x661749 + " 天";
    const _0x2c5fdd = {
      L0: "",
      L1: "已进入冷却：禁用「用户查询」，其余查询消耗×2，签到收益减半",
      L2: "已限制使用：禁用所有查询与签到功能",
      L3: "已严格限制：所有功能暂停使用",
      L4: "已触发异常行为限制使用：所有功能暂停"
    };
    return "⚠️ 检测到异常行为" + _0x587511 + "\n" + _0x2c5fdd[_0x183399] + "\n> 风控限制时长：**" + _0x3683f3 + "**\n> 期满后可申请恢复。请规范使用以免加重限制。\n> <qqbot-cmd-input text=\"请复制到微信打开 https://qm.qq.com/q/PyhpuiE1EG\" show=\"如果对处罚结果有异议请点我\"/>";
  },
  typeName(_0x1ddbaa) {
    return {
      SENSITIVE_QUERY: "敏感内容查询",
      BLACKLIST_HIT: "查询违规目标",
      MALICIOUS_PROBE: "恶意探测",
      EVADE_AUDIT: "逃避审核"
    }[_0x1ddbaa];
  },
  async adminSetLevel(_0x45ab11, _0x2904bd, _0x3ed44f) {
    const _0x3dbe8b = this.ensure(_0x45ab11);
    if (_0x2904bd === "L0") {
      _0x3dbe8b.activeRestrictions = [];
      _0x3dbe8b.observation = null;
      await this.save(_0x45ab11);
      return "已清除 " + _0x45ab11 + " 的所有风控限制（L0 正常）。";
    }
    const _0x152a57 = (_0x3ed44f ?? deps.LEVEL_DEFAULT_DURATION[_0x2904bd] / deps.DAY2) * deps.DAY2;
    const _0x12faa9 = Date.now();
    _0x3dbe8b.activeRestrictions.push({
      id: this.genId(),
      type: "SENSITIVE_QUERY",
      level: _0x2904bd,
      startedAt: _0x12faa9,
      duration: _0x152a57,
      expiresAt: _0x12faa9 + _0x152a57,
      sourceViolationId: "admin"
    });
    _0x3dbe8b.history.push({
      id: this.genId(),
      userId: _0x45ab11,
      type: "SENSITIVE_QUERY",
      level: _0x2904bd,
      reason: "管理员手动调整",
      operatorRole: "admin",
      createdAt: _0x12faa9
    });
    await this.save(_0x45ab11);
    return "已将 " + _0x45ab11 + " 风控等级调整为 " + _0x2904bd + "，时长 " + Math.round(_0x152a57 / deps.DAY2) + " 天。";
  },
  async adminClear(_0x47ba78) {
    const _0x51e572 = this.get(_0x47ba78);
    if (!_0x51e572 || !_0x51e572.activeRestrictions.length) {
      return _0x47ba78 + " 当前无生效的风控限制。";
    }
    _0x51e572.activeRestrictions = [];
    _0x51e572.observation = null;
    await this.save(_0x47ba78);
    return "已解除 " + _0x47ba78 + " 的全部风控限制。";
  },
  async save(_0xd0430d) {
    const _0x6e12b6 = this.states[_0xd0430d];
    if (!_0x6e12b6 || !this.ctx || !this.config) {
      return;
    }
    if (!this.config.useDatabase) {
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/riskState/" + _0xd0430d, JSON.stringify(_0x6e12b6));
    } else {
      const [_0x362fb1] = await this.ctx.database.get("smm_roblox_risk_state", {
        userId: _0xd0430d
      });
      if (_0x362fb1) {
        const {
          userId: _0x513c47,
          ..._0xca0022
        } = _0x6e12b6;
        await this.ctx.database.set("smm_roblox_risk_state", {
          userId: _0xd0430d
        }, _0xca0022);
      } else {
        await this.ctx.database.create("smm_roblox_risk_state", _0x6e12b6);
      }
    }
  }
};
return { get riskStore() { return riskStore; }, set riskStore(value) { riskStore = value; } };
};
