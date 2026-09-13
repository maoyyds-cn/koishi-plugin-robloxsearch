'use strict';

module.exports = function create(deps) {
function today() {
  return new Date().toLocaleDateString();
}
var pointsStore = {
  ctx: null,
  config: null,
  basePath: "",
  userList: {},
  changeQueues: {},
  async init(_0x5d624e, _0x433b80) {
    this.ctx = _0x5d624e;
    this.config = _0x433b80;
    this.userList = {};
    if (!_0x433b80.useDatabase) {
      this.basePath = deps.import_path2.default.join(_0x5d624e.localstorage.basePath, _0x433b80.basePath, "pointsProfile");
      if (!deps.import_fs2.default.existsSync(this.basePath)) {
        deps.import_fs2.default.mkdirSync(this.basePath, {
          recursive: true
        });
      }
      const _0x4fd458 = await deps.import_promises2.default.readdir(this.basePath);
      const _0x43bd2d = {
        ok: 0,
        err: 0
      };
      await Promise.all(_0x4fd458.map(_0x237c22 => (async () => {
        try {
          const _0x25a637 = await _0x5d624e.localstorage.getItem(_0x433b80.basePath + "/pointsProfile/" + _0x237c22);
          if (_0x25a637) {
            this.userList[_0x237c22] = this.normalize(JSON.parse(_0x25a637), _0x237c22);
            _0x43bd2d.ok++;
          }
        } catch (_0x332980) {
          _0x43bd2d.err++;
        }
      })()));
      console.log("roblox积分体系 档案加载完成，成功" + _0x43bd2d.ok + "个，失败" + _0x43bd2d.err + "个");
    } else {
      _0x5d624e.database.extend("smm_roblox_points_profile", {
        userId: "string",
        currentPoints: "unsigned",
        level: "unsigned",
        expIntoLevel: "unsigned",
        totalExpEarned: "unsigned",
        totalEarned: "unsigned",
        totalSpent: "unsigned",
        totalDeducted: "unsigned",
        signIn: "json",
        queryStats: "json",
        createdAt: "unsigned",
        updatedAt: "unsigned"
      }, {
        primary: "userId",
        autoInc: false
      });
      const _0x2c66a9 = await _0x5d624e.database.get("smm_roblox_points_profile", {});
      _0x2c66a9.forEach(_0x5a379e => {
        this.userList[_0x5a379e.userId] = this.normalize(_0x5a379e, _0x5a379e.userId);
      });
      console.log("roblox积分体系 从数据库加载档案完成，成功" + _0x2c66a9.length + "个");
    }
  },
  newProfile(_0x4da929) {
    const _0x481a8e = Date.now();
    return {
      userId: _0x4da929,
      currentPoints: 0,
      level: 0,
      expIntoLevel: 0,
      totalExpEarned: 0,
      totalEarned: 0,
      totalSpent: 0,
      totalDeducted: 0,
      signIn: {
        lastSignInAt: 0,
        consecutiveDays: 0,
        totalSignIns: 0
      },
      queryStats: {
        todayCount: 0,
        todayExpCount: 0,
        todayFreeUsed: 0,
        lastQueryAt: 0,
        totalQueries: 0,
        lastResetDate: today()
      },
      createdAt: _0x481a8e,
      updatedAt: _0x481a8e
    };
  },
  normalize(_0x8be23c, _0x12c53a) {
    const _0x3c44c4 = this.newProfile(_0x12c53a);
    const _0x9c0dc1 = {
      ..._0x3c44c4,
      ..._0x8be23c,
      userId: _0x12c53a
    };
    _0x9c0dc1.signIn = {
      ..._0x3c44c4.signIn,
      ...(_0x8be23c?.signIn || {})
    };
    _0x9c0dc1.queryStats = {
      ..._0x3c44c4.queryStats,
      ...(_0x8be23c?.queryStats || {})
    };
    return _0x9c0dc1;
  },
  applyDailyReset(_0x31850f) {
    const _0x58e061 = today();
    if (_0x31850f.queryStats.lastResetDate !== _0x58e061) {
      _0x31850f.queryStats.todayCount = 0;
      _0x31850f.queryStats.todayExpCount = 0;
      _0x31850f.queryStats.todayFreeUsed = 0;
      _0x31850f.queryStats.lastResetDate = _0x58e061;
    }
  },
  get(_0x11f3a1) {
    const _0x2d1fcc = this.userList[_0x11f3a1];
    if (_0x2d1fcc) {
      this.applyDailyReset(_0x2d1fcc);
    }
    return _0x2d1fcc;
  },
  async ensure(_0x57cbc5) {
    let _0x994255 = this.userList[_0x57cbc5];
    if (!_0x994255) {
      _0x994255 = this.newProfile(_0x57cbc5);
      this.userList[_0x57cbc5] = _0x994255;
      await this.save(_0x57cbc5);
    }
    this.applyDailyReset(_0x994255);
    return _0x994255;
  },
  async syncBalance(_0x23dedb) {
    const _0x1492e1 = await this.ensure(_0x23dedb.userId);
    if (this.ctx && _0x23dedb.user?.id != null) {
      const [_0x337cbb] = await this.ctx.database.get("monetary", {
        uid: _0x23dedb.user.id,
        currency: "default"
      });
      if (!_0x337cbb) {
        await this.ctx.monetary.gain(_0x23dedb.user.id, 0);
        _0x1492e1.currentPoints = 0;
      } else {
        _0x1492e1.currentPoints = Math.floor(_0x337cbb.value);
      }
    }
    return _0x1492e1;
  },
  async changePoints(_0x286327, _0x60886, _0x53d070, _0x1d221b) {
    const _0x29ebe1 = _0x286327.userId;
    const _0x42ccb2 = this.changeQueues[_0x29ebe1] ?? Promise.resolve(0);
    const _0x22f32d = _0x42ccb2.catch(() => 0).then(() => this.changePointsInner(_0x286327, _0x60886, _0x53d070, _0x1d221b));
    this.changeQueues[_0x29ebe1] = _0x22f32d;
    _0x22f32d.then(_0x37f8e4 => {
      if (this.changeQueues[_0x29ebe1] === _0x22f32d) {
        delete this.changeQueues[_0x29ebe1];
      }
      return _0x37f8e4;
    }, () => {
      if (this.changeQueues[_0x29ebe1] === _0x22f32d) {
        delete this.changeQueues[_0x29ebe1];
      }
      return 0;
    });
    return _0x22f32d;
  },
  async changePointsInner(_0x324c0b, _0x4af7d6, _0x553714, _0x1a8e5b) {
    const _0xa1c5fd = await this.syncBalance(_0x324c0b);
    if (_0x4af7d6 === 0) {
      return _0xa1c5fd.currentPoints;
    }
    let _0x26067a = _0x4af7d6;
    if (_0x4af7d6 < 0) {
      _0x26067a = -Math.min(Math.abs(_0x4af7d6), _0xa1c5fd.currentPoints);
    }
    if (this.ctx && _0x324c0b.user?.id != null && _0x26067a !== 0) {
      if (_0x26067a > 0) {
        await this.ctx.monetary.gain(_0x324c0b.user.id, _0x26067a);
      } else {
        await this.ctx.monetary.cost(_0x324c0b.user.id, -_0x26067a);
      }
    }
    _0xa1c5fd.currentPoints = Math.max(0, _0xa1c5fd.currentPoints + _0x26067a);
    if (_0x553714 === "query_refund" && _0x26067a > 0) {
      _0xa1c5fd.totalSpent = Math.max(0, _0xa1c5fd.totalSpent - _0x26067a);
    } else if (_0x26067a > 0) {
      _0xa1c5fd.totalEarned += _0x26067a;
    } else if (_0x553714 === "violation") {
      _0xa1c5fd.totalDeducted += -_0x26067a;
    } else {
      _0xa1c5fd.totalSpent += -_0x26067a;
    }
    _0xa1c5fd.updatedAt = Date.now();
    await deps.transactionStore.record({
      userId: _0x324c0b.userId,
      ledger: "points",
      amount: _0x26067a,
      balanceAfter: _0xa1c5fd.currentPoints,
      source: _0x553714,
      remark: _0x1a8e5b
    });
    await this.save(_0x324c0b.userId);
    return _0xa1c5fd.currentPoints;
  },
  async changePointsByUserId(_0x29a0a2, _0x8cfba9, _0xd97269, _0x43879d) {
    const _0x3fa548 = this.changeQueues[_0x29a0a2] ?? Promise.resolve(0);
    const _0x9716b1 = _0x3fa548.catch(() => 0).then(() => this.changePointsByUserIdInner(_0x29a0a2, _0x8cfba9, _0xd97269, _0x43879d));
    this.changeQueues[_0x29a0a2] = _0x9716b1;
    _0x9716b1.then(_0x32096c => {
      if (this.changeQueues[_0x29a0a2] === _0x9716b1) {
        delete this.changeQueues[_0x29a0a2];
      }
      return _0x32096c;
    }, () => {
      if (this.changeQueues[_0x29a0a2] === _0x9716b1) {
        delete this.changeQueues[_0x29a0a2];
      }
      return 0;
    });
    return _0x9716b1;
  },
  async changePointsByUserIdInner(_0x356c3a, _0x30fd85, _0x2cc166, _0x5da3d5) {
    const _0xc225db = await this.ensure(_0x356c3a);
    const _0x1644d6 = await this.resolveUid(_0x356c3a);
    if (_0x1644d6 != null && this.ctx) {
      const [_0x507aba] = await this.ctx.database.get("monetary", {
        uid: _0x1644d6,
        currency: "default"
      });
      _0xc225db.currentPoints = _0x507aba ? Math.floor(_0x507aba.value) : 0;
    }
    if (_0x30fd85 === 0) {
      return _0xc225db.currentPoints;
    }
    let _0x5855bf = _0x30fd85;
    if (_0x30fd85 < 0) {
      _0x5855bf = -Math.min(Math.abs(_0x30fd85), _0xc225db.currentPoints);
    }
    if (this.ctx && _0x1644d6 != null && _0x5855bf !== 0) {
      if (_0x5855bf > 0) {
        await this.ctx.monetary.gain(_0x1644d6, _0x5855bf);
      } else {
        await this.ctx.monetary.cost(_0x1644d6, -_0x5855bf);
      }
    }
    _0xc225db.currentPoints = Math.max(0, _0xc225db.currentPoints + _0x5855bf);
    if (_0x2cc166 === "query_refund" && _0x5855bf > 0) {
      _0xc225db.totalSpent = Math.max(0, _0xc225db.totalSpent - _0x5855bf);
    } else if (_0x5855bf > 0) {
      _0xc225db.totalEarned += _0x5855bf;
    } else if (_0x2cc166 === "violation") {
      _0xc225db.totalDeducted += -_0x5855bf;
    } else {
      _0xc225db.totalSpent += -_0x5855bf;
    }
    _0xc225db.updatedAt = Date.now();
    await deps.transactionStore.record({
      userId: _0x356c3a,
      ledger: "points",
      amount: _0x5855bf,
      balanceAfter: _0xc225db.currentPoints,
      source: _0x2cc166,
      remark: _0x5da3d5
    });
    await this.save(_0x356c3a);
    return _0xc225db.currentPoints;
  },
  async resolveUid(_0x12e4b2) {
    if (!this.ctx) {
      return null;
    }
    const _0x116e6c = await this.ctx.database.get("binding", {
      pid: _0x12e4b2
    });
    if (_0x116e6c.length) {
      return _0x116e6c[0].aid;
    } else {
      return null;
    }
  },
  recordExp(_0x2b53c9, _0x5be369, _0x2e388e, _0x5531b9) {
    return deps.transactionStore.record({
      userId: _0x2b53c9.userId,
      ledger: "exp",
      amount: _0x5be369,
      balanceAfter: _0x2b53c9.expIntoLevel,
      source: _0x2e388e,
      remark: _0x5531b9
    });
  },
  async save(_0x23dee5) {
    const _0x2814b5 = this.userList[_0x23dee5];
    if (!_0x2814b5 || !this.ctx || !this.config) {
      return;
    }
    _0x2814b5.updatedAt = Date.now();
    if (!this.config.useDatabase) {
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/pointsProfile/" + _0x23dee5, JSON.stringify(_0x2814b5));
    } else {
      const [_0x45da07] = await this.ctx.database.get("smm_roblox_points_profile", {
        userId: _0x23dee5
      });
      if (_0x45da07) {
        const {
          userId: _0x48206b,
          ..._0x11a355
        } = _0x2814b5;
        await this.ctx.database.set("smm_roblox_points_profile", {
          userId: _0x23dee5
        }, _0x11a355);
      } else {
        await this.ctx.database.create("smm_roblox_points_profile", _0x2814b5);
      }
    }
  }
};
return { get today() { return today; },
get pointsStore() { return pointsStore; }, set pointsStore(value) { pointsStore = value; } };
};
