'use strict';

module.exports = function create(deps) {
var MAX_LOCAL_PER_USER = 200;
var transactionStore = {
  ctx: null,
  config: null,
  cache: {},
  async init(_0x4b5bff, _0x5d6df1) {
    this.ctx = _0x4b5bff;
    this.config = _0x5d6df1;
    if (_0x5d6df1.useDatabase) {
      _0x4b5bff.database.extend("smm_roblox_transaction", {
        id: "string",
        userId: "string",
        ledger: "string",
        amount: "integer",
        balanceAfter: "integer",
        source: "string",
        remark: "string",
        timestamp: "unsigned"
      }, {
        primary: "id",
        autoInc: false
      });
    }
  },
  genId() {
    return Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  },
  async record(_0x2a44af) {
    const _0x228b8f = {
      id: this.genId(),
      timestamp: Date.now(),
      ..._0x2a44af
    };
    if (this.config?.useDatabase && this.ctx) {
      await this.ctx.database.create("smm_roblox_transaction", _0x228b8f);
      return _0x228b8f;
    }
    return this._recordLocal(_0x228b8f);
  },
  async _ensureLocal(_0x49c6cb) {
    if (Array.isArray(this.cache[_0x49c6cb])) {
      return this.cache[_0x49c6cb];
    }
    if (this._loading?.[_0x49c6cb]) {
      return this._loading[_0x49c6cb];
    }
    this._loading ||= {};
    const loading = (async () => {
      const raw = await this.ctx.localstorage.getItem(this.config.basePath + "/transaction/" + _0x49c6cb);
      const records = raw == null || raw === "" ? [] : JSON.parse(raw);
      if (!Array.isArray(records)) {
        throw new Error("Invalid transaction history: expected an array");
      }
      this.cache[_0x49c6cb] = records;
      return records;
    })();
    this._loading[_0x49c6cb] = loading;
    try {
      return await loading;
    } finally {
      if (this._loading[_0x49c6cb] === loading) {
        delete this._loading[_0x49c6cb];
      }
    }
  },
  async _recordLocal(_0x228b8f) {
    const _0x4e2022 = await this._ensureLocal(_0x228b8f.userId);
    _0x4e2022.push(_0x228b8f);
    if (_0x4e2022.length > MAX_LOCAL_PER_USER) {
      _0x4e2022.splice(0, _0x4e2022.length - MAX_LOCAL_PER_USER);
    }
    await this.persistLocal(_0x228b8f.userId);
    return _0x228b8f;
  },
  async persistLocal(_0x13022d) {
    if (!this.ctx || !this.config) {
      return;
    }
    await deps.queuedSetItem(this.ctx, this.config.basePath + "/transaction/" + _0x13022d, JSON.stringify(this.cache[_0x13022d] || []));
  },
  async list(_0x2c774c, _0x5bbc64 = 10, _0x26fcf0) {
    if (this.config?.useDatabase && this.ctx) {
      const _0x37ada2 = {
        userId: _0x2c774c
      };
      if (_0x26fcf0) {
        _0x37ada2.ledger = _0x26fcf0;
      }
      const _0x356bfd = await this.ctx.database.get("smm_roblox_transaction", _0x37ada2, {
        sort: {
          timestamp: "desc"
        },
        limit: _0x5bbc64
      });
      return _0x356bfd;
    }
    const _0x41d150 = await this._ensureLocal(_0x2c774c);
    const _0x395808 = _0x26fcf0 ? _0x41d150.filter(_0x4275a4 => _0x4275a4.ledger === _0x26fcf0) : _0x41d150;
    return _0x395808.slice(-_0x5bbc64).reverse();
  }
};
return { get MAX_LOCAL_PER_USER() { return MAX_LOCAL_PER_USER; }, set MAX_LOCAL_PER_USER(value) { MAX_LOCAL_PER_USER = value; },
get transactionStore() { return transactionStore; }, set transactionStore(value) { transactionStore = value; } };
};
