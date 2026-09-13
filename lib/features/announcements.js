'use strict';

module.exports = function create(deps) {
var LIST_KEY = "announcement/list";
var RECEIPT_KEY = "announcement/receipt";
var announcementStore = {
  ctx: null,
  config: null,
  list: {},
  receipts: {},
  onChange: null,
  async init(_0x3bbb77, _0x458824) {
    this.ctx = _0x3bbb77;
    this.config = _0x458824;
    this.list = {};
    this.receipts = {};
    if (_0x458824.useDatabase) {
      _0x3bbb77.database.extend("smm_roblox_announcement", {
        id: "string",
        title: "string",
        content: "text",
        status: "string",
        levels: "json",
        maxTriggers: "unsigned",
        createdAt: "unsigned",
        updatedAt: "unsigned",
        publishedAt: "unsigned",
        expiresAt: "unsigned"
      }, {
        primary: "id",
        autoInc: false
      });
      _0x3bbb77.database.extend("smm_roblox_announcement_receipt", {
        id: "string",
        announcementId: "string",
        userId: "string",
        count: "unsigned",
        lastTriggeredAt: "unsigned"
      }, {
        primary: "id",
        autoInc: false
      });
      const _0x4d273f = await _0x3bbb77.database.get("smm_roblox_announcement", {});
      _0x4d273f.forEach(_0x40a915 => {
        this.list[_0x40a915.id] = this.normalize(_0x40a915);
      });
      const _0xf9995 = await _0x3bbb77.database.get("smm_roblox_announcement_receipt", {});
      _0xf9995.forEach(_0x23cc63 => {
        this.receipts[_0x23cc63.id] = _0x23cc63;
      });
    } else {
      try {
        const _0x3c0d93 = await _0x3bbb77.localstorage.getItem(_0x458824.basePath + "/" + LIST_KEY);
        if (_0x3c0d93) {
          JSON.parse(_0x3c0d93).forEach(_0x2234b5 => {
            this.list[_0x2234b5.id] = this.normalize(_0x2234b5);
          });
        }
      } catch {}
      try {
        const _0x55a440 = await _0x3bbb77.localstorage.getItem(_0x458824.basePath + "/" + RECEIPT_KEY);
        if (_0x55a440) {
          const _0x59e210 = JSON.parse(_0x55a440);
          Object.keys(_0x59e210).forEach(_0x170a59 => {
            this.receipts[_0x170a59] = _0x59e210[_0x170a59];
          });
        }
      } catch {}
    }
    console.log("roblox公告 加载完成：公告 " + Object.keys(this.list).length + " 条，接收记录 " + Object.keys(this.receipts).length + " 条");
  },
  normalize(_0x315003) {
    return {
      id: String(_0x315003.id),
      title: String(_0x315003.title ?? ""),
      content: String(_0x315003.content ?? ""),
      status: ["draft", "published", "expired"].includes(_0x315003.status) ? _0x315003.status : "draft",
      levels: Array.isArray(_0x315003.levels) ? _0x315003.levels.filter(_0x566639 => Number.isInteger(_0x566639) && _0x566639 >= 0 && _0x566639 <= 7) : [0],
      maxTriggers: Number.isInteger(_0x315003.maxTriggers) && _0x315003.maxTriggers >= 0 ? _0x315003.maxTriggers : 1,
      createdAt: _0x315003.createdAt || Date.now(),
      updatedAt: _0x315003.updatedAt || Date.now(),
      publishedAt: _0x315003.publishedAt || 0,
      expiresAt: _0x315003.expiresAt || 0
    };
  },
  validate(_0xa60f38) {
    if (!_0xa60f38.title?.trim()) {
      return "公告标题不能为空";
    }
    if (!_0xa60f38.content?.trim()) {
      return "公告内容不能为空";
    }
    if (!Array.isArray(_0xa60f38.levels) || !_0xa60f38.levels.length) {
      return "至少选择一个定向等级";
    }
    if (_0xa60f38.levels.some(_0x44cb0f => !Number.isInteger(_0x44cb0f) || _0x44cb0f < 0 || _0x44cb0f > 7)) {
      return "定向等级必须是 0~7 的整数";
    }
    if (!Number.isInteger(_0xa60f38.maxTriggers) || _0xa60f38.maxTriggers < 0) {
      return "触发次数必须是不小于 0 的整数";
    }
    return null;
  },
  async save(_0x40a9d4) {
    const _0x133098 = this.validate(_0x40a9d4);
    if (_0x133098) {
      return {
        ok: false,
        message: _0x133098
      };
    }
    const _0x2f02d2 = Date.now();
    const _0x4fc435 = [...new Set(_0x40a9d4.levels)].sort((_0x4f4d45, _0x1b0f64) => _0x4f4d45 - _0x1b0f64);
    if (_0x40a9d4.id) {
      const _0x33c3d0 = this.list[_0x40a9d4.id];
      if (!_0x33c3d0) {
        return {
          ok: false,
          message: "公告不存在"
        };
      }
      _0x33c3d0.title = _0x40a9d4.title.trim();
      _0x33c3d0.content = _0x40a9d4.content;
      _0x33c3d0.levels = _0x4fc435;
      _0x33c3d0.maxTriggers = _0x40a9d4.maxTriggers;
      _0x33c3d0.expiresAt = _0x40a9d4.expiresAt || 0;
      _0x33c3d0.updatedAt = _0x2f02d2;
      if (_0x33c3d0.status === "expired" && (!_0x33c3d0.expiresAt || _0x33c3d0.expiresAt > _0x2f02d2)) {
        _0x33c3d0.status = "draft";
      }
      await this.persist(_0x33c3d0);
      this.onChange?.();
      return {
        ok: true,
        message: "公告已更新",
        id: _0x33c3d0.id
      };
    }
    const _0x736319 = {
      id: "ann_" + deps.import_crypto.default.randomUUID(),
      title: _0x40a9d4.title.trim(),
      content: _0x40a9d4.content,
      status: "draft",
      levels: _0x4fc435,
      maxTriggers: _0x40a9d4.maxTriggers,
      createdAt: _0x2f02d2,
      updatedAt: _0x2f02d2,
      publishedAt: 0,
      expiresAt: _0x40a9d4.expiresAt || 0
    };
    this.list[_0x736319.id] = _0x736319;
    await this.persist(_0x736319);
    this.onChange?.();
    return {
      ok: true,
      message: "公告已创建（草稿）",
      id: _0x736319.id
    };
  },
  async publish(_0x3eaa81) {
    const _0x4b118d = this.list[_0x3eaa81];
    if (!_0x4b118d) {
      return {
        ok: false,
        message: "公告不存在"
      };
    }
    if (_0x4b118d.expiresAt && _0x4b118d.expiresAt <= Date.now()) {
      return {
        ok: false,
        message: "公告已到过期时间，请先调整过期时间"
      };
    }
    _0x4b118d.status = "published";
    _0x4b118d.publishedAt = Date.now();
    _0x4b118d.updatedAt = Date.now();
    await this.persist(_0x4b118d);
    this.onChange?.();
    return {
      ok: true,
      message: "公告已发布"
    };
  },
  async expire(_0x31a60a) {
    const _0x27897a = this.list[_0x31a60a];
    if (!_0x27897a) {
      return {
        ok: false,
        message: "公告不存在"
      };
    }
    _0x27897a.status = "expired";
    _0x27897a.updatedAt = Date.now();
    await this.persist(_0x27897a);
    this.onChange?.();
    return {
      ok: true,
      message: "公告已设为过期"
    };
  },
  async remove(_0x3f7c28) {
    if (!this.list[_0x3f7c28]) {
      return {
        ok: false,
        message: "公告不存在"
      };
    }
    delete this.list[_0x3f7c28];
    Object.keys(this.receipts).forEach(_0x1b75b4 => {
      if (this.receipts[_0x1b75b4].announcementId === _0x3f7c28) {
        delete this.receipts[_0x1b75b4];
      }
    });
    if (this.config?.useDatabase && this.ctx) {
      await this.ctx.database.remove("smm_roblox_announcement", {
        id: _0x3f7c28
      });
      await this.ctx.database.remove("smm_roblox_announcement_receipt", {
        announcementId: _0x3f7c28
      });
    } else {
      await this.persistLocalList();
      await this.persistLocalReceipts();
    }
    this.onChange?.();
    return {
      ok: true,
      message: "公告已删除"
    };
  },
  checkExpiry(_0x8ba7bd) {
    if (_0x8ba7bd.status === "published" && _0x8ba7bd.expiresAt && _0x8ba7bd.expiresAt <= Date.now()) {
      _0x8ba7bd.status = "expired";
      _0x8ba7bd.updatedAt = Date.now();
      this.persist(_0x8ba7bd).catch(() => {});
      this.onChange?.();
    }
    return _0x8ba7bd;
  },
  all() {
    return Object.values(this.list).map(_0x3d785b => this.checkExpiry(_0x3d785b)).sort((_0x57ed10, _0x32ec4a) => _0x32ec4a.createdAt - _0x57ed10.createdAt);
  },
  matchLevel(_0x5b9f90, _0x722266) {
    return _0x5b9f90.levels.includes(0) || _0x5b9f90.levels.includes(_0x722266);
  },
  pendingFor(_0x532b59, _0x1d38d9) {
    return this.all().filter(_0x204763 => _0x204763.status === "published" && _0x204763.maxTriggers > 0 && this.matchLevel(_0x204763, _0x1d38d9) && (this.receipts[_0x204763.id + ":" + _0x532b59]?.count ?? 0) < _0x204763.maxTriggers);
  },
  async markTriggered(_0x210eb6, _0x2ebe16) {
    const _0x2448e9 = _0x210eb6 + ":" + _0x2ebe16;
    const _0x9127d1 = this.receipts[_0x2448e9] ?? {
      id: _0x2448e9,
      announcementId: _0x210eb6,
      userId: _0x2ebe16,
      count: 0,
      lastTriggeredAt: 0
    };
    _0x9127d1.count += 1;
    _0x9127d1.lastTriggeredAt = Date.now();
    this.receipts[_0x2448e9] = _0x9127d1;
    if (this.config?.useDatabase && this.ctx) {
      await this.ctx.database.upsert("smm_roblox_announcement_receipt", [_0x9127d1]);
    } else {
      await this.persistLocalReceipts();
    }
    this.onChange?.();
  },
  audiencePreview(_0xb1d675) {
    const _0x5e1e6d = Object.values(deps.pointsStore.userList);
    const _0x105da9 = _0x5e1e6d.length;
    if (_0xb1d675.includes(0)) {
      return {
        count: _0x105da9,
        total: _0x105da9
      };
    }
    const _0x23c331 = new Set(_0xb1d675);
    return {
      count: _0x5e1e6d.filter(_0x2378de => _0x23c331.has(_0x2378de.level)).length,
      total: _0x105da9
    };
  },
  deliveryStats() {
    const _0x4e3ba0 = {};
    Object.values(this.receipts).forEach(_0x3956cd => {
      const _0x43d949 = _0x4e3ba0[_0x3956cd.announcementId] ?? {
        users: 0,
        triggers: 0
      };
      _0x43d949.users += 1;
      _0x43d949.triggers += _0x3956cd.count;
      _0x4e3ba0[_0x3956cd.announcementId] = _0x43d949;
    });
    return _0x4e3ba0;
  },
  async persist(_0x1f8f45) {
    if (!this.ctx || !this.config) {
      return;
    }
    if (this.config.useDatabase) {
      await this.ctx.database.upsert("smm_roblox_announcement", [_0x1f8f45]);
    } else {
      await this.persistLocalList();
    }
  },
  async persistLocalList() {
    if (!this.ctx || !this.config) {
      return;
    }
    await deps.queuedSetItem(this.ctx, this.config.basePath + "/" + LIST_KEY, JSON.stringify(Object.values(this.list)));
  },
  async persistLocalReceipts() {
    if (!this.ctx || !this.config) {
      return;
    }
    await deps.queuedSetItem(this.ctx, this.config.basePath + "/" + RECEIPT_KEY, JSON.stringify(this.receipts));
  }
};
return { get LIST_KEY() { return LIST_KEY; }, set LIST_KEY(value) { LIST_KEY = value; },
get RECEIPT_KEY() { return RECEIPT_KEY; }, set RECEIPT_KEY(value) { RECEIPT_KEY = value; },
get announcementStore() { return announcementStore; }, set announcementStore(value) { announcementStore = value; } };
};
