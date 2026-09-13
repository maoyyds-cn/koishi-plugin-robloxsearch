'use strict';

module.exports = function create(deps) {
var MASK = "****";
var API_ENDPOINT = "https://uapis.cn/api/v1/text/profanitycheck";
var REQUEST_TIMEOUT = 12000;
var MAX_RETRIES = 2;
var RETRY_BASE_DELAY = 500;
var QPS_INTERVAL = 50;
var CACHE_TTL = 30000;
var CACHE_MAX_SIZE2 = 100;
var PURE_NUMERIC_MIN_LENGTH = 4;
var outputAudit = {
  ctx: null,
  config: null,
  _callQueue: Promise.resolve(),
  _cache: new Map(),
  _circuitOpen: false,
  _circuitOpenTime: 0,
  _consecutiveFailures: 0,
  init(_0x5a2431, _0x5b1704) {
    this.ctx = _0x5a2431;
    this.config = _0x5b1704;
    this._callQueue = Promise.resolve();
    this._cache = new Map();
    this._circuitOpen = false;
    this._circuitOpenTime = 0;
    this._consecutiveFailures = 0;
  },
  isFlagged(_0x2ec714) {
    if (_0x2ec714 == null) {
      return false;
    }
    return _0x2ec714 === MASK || _0x2ec714.includes(MASK);
  },
  _isPureNumeric(_0x1f111c) {
    const _0x1e70eb = _0x1f111c.trim();
    if (_0x1e70eb.length < PURE_NUMERIC_MIN_LENGTH) {
      return false;
    }
    return /^\d+$/.test(_0x1e70eb);
  },
  async auditText(_0x122b18) {
    if (!_0x122b18 || !_0x122b18.trim()) {
      return {
        safe: true,
        text: _0x122b18
      };
    }
    if (this.config && !this.config.useTextAudit) {
      return {
        safe: true,
        text: _0x122b18
      };
    }
    if (!this.ctx) {
      return {
        safe: false,
        text: MASK
      };
    }
    if (this._isPureNumeric(_0x122b18)) {
      return {
        safe: true,
        text: _0x122b18
      };
    }
    const _0x3cac5f = this._getCached(_0x122b18);
    if (_0x3cac5f) {
      return _0x3cac5f;
    }
    if (this._circuitOpen) {
      if (Date.now() - this._circuitOpenTime < 300000) {
        return {
          safe: true,
          text: _0x122b18
        };
      }
      this._circuitOpenTime = Date.now();
    }
    const _0x18a3d8 = await this._callWithRetry(_0x122b18);
    this._setCached(_0x122b18, _0x18a3d8);
    return _0x18a3d8;
  },
  async _callWithRetry(_0x594537) {
    let _0x5887cd = null;
    for (let _0x315906 = 0; _0x315906 <= MAX_RETRIES; _0x315906++) {
      try {
        const _0xaccae2 = await this._callApi(_0x594537);
        this._consecutiveFailures = 0;
        this._circuitOpen = false;
        return _0xaccae2;
      } catch (_0x245c14) {
        _0x5887cd = _0x245c14;
        if (this.config?.deBug) {
          console.log("[outputAudit] 调用失败 (attempt " + (_0x315906 + 1) + "/" + (MAX_RETRIES + 1) + "):", _0x245c14 instanceof Error ? _0x245c14.message : _0x245c14);
        }
        if (_0x315906 < MAX_RETRIES) {
          await this._delay(RETRY_BASE_DELAY * (_0x315906 + 1));
        }
      }
    }
    this._consecutiveFailures = (this._consecutiveFailures || 0) + 1;
    if (this._consecutiveFailures >= 3) {
      if (!this._circuitOpen) {
        this._circuitOpen = true;
        console.log("[outputAudit] 审核API连续失败，已熔断，5分钟后重试");
      }
      this._circuitOpenTime = Date.now();
    }
    if (this.config?.deBug) {
      console.log("[outputAudit] 重试耗尽，fail-open (审核API不可用，放行原文):", _0x5887cd);
    }
    return {
      safe: true,
      text: _0x594537
    };
  },
  async _callApi(_0x119379) {
    const _0x5af5cb = await this._enqueueQPS(() => this._doRequest(_0x119379));
    return _0x5af5cb;
  },
  async _doRequest(_0x1729bc) {
    const _0xhdrs = { "Content-Type": "application/json" };
    const _0xtkn = (this.config?.textAuditToken || "").trim();
    if (_0xtkn) {
      _0xhdrs.Authorization = "Bearer " + _0xtkn;
    }
    const _0x4dd855 = await this.ctx.http.post(API_ENDPOINT, {
      text: _0x1729bc
    }, {
      headers: _0xhdrs,
      timeout: REQUEST_TIMEOUT
    });
    if (!_0x4dd855 || typeof _0x4dd855.status !== "string") {
      throw new Error("UApiPro 响应格式异常：缺少 status 字段");
    }
    const _0x4d62ba = _0x4dd855.status === "ok";
    if (this.config?.deBug) {
      console.log("[outputAudit] 审核" + (_0x4d62ba ? "通过" : "拦截") + ": forbiddenWords=" + JSON.stringify(_0x4dd855.forbidden_words || []));
    }
    return {
      safe: _0x4d62ba,
      text: _0x4d62ba ? _0x1729bc : MASK
    };
  },
  _enqueueQPS(_0x25d2e3) {
    const _0x44e713 = this._callQueue.then(() => _0x25d2e3());
    this._callQueue = _0x44e713.then(() => this._delay(QPS_INTERVAL), () => this._delay(QPS_INTERVAL));
    return _0x44e713;
  },
  _delay(_0x310453) {
    return new Promise(_0xe6fa76 => setTimeout(_0xe6fa76, _0x310453));
  },
  _getCached(_0x39c677) {
    const _0x327466 = this._cache.get(_0x39c677);
    if (!_0x327466) {
      return null;
    }
    if (Date.now() > _0x327466.expiresAt) {
      this._cache.delete(_0x39c677);
      return null;
    }
    return _0x327466.result;
  },
  _setCached(_0xd3e2fa, _0x2aa3cc) {
    if (this._cache.size >= CACHE_MAX_SIZE2) {
      const _0x1a95f6 = this._cache.keys().next().value;
      if (_0x1a95f6) {
        this._cache.delete(_0x1a95f6);
      }
    }
    this._cache.set(_0xd3e2fa, {
      result: _0x2aa3cc,
      expiresAt: Date.now() + CACHE_TTL
    });
  },
  async auditFields(_0x56eedd) {
    const _0x551611 = [];
    const _0x43e589 = {};
    for (const [_0x551877, _0x4fafe0] of Object.entries(_0x56eedd)) {
      if (!_0x4fafe0) {
        _0x43e589[_0x551877] = _0x4fafe0 || "";
        continue;
      }
      if (this.isFlagged(_0x4fafe0)) {
        _0x551611.push(_0x551877);
        _0x43e589[_0x551877] = MASK;
        continue;
      }
      const _0x45e80d = await this.auditText(_0x4fafe0);
      _0x43e589[_0x551877] = _0x45e80d.text;
      if (!_0x45e80d.safe) {
        _0x551611.push(_0x551877);
      }
    }
    return {
      safe: _0x551611.length === 0,
      flaggedFields: _0x551611,
      audited: _0x43e589
    };
  }
};
return { get MASK() { return MASK; }, set MASK(value) { MASK = value; },
get API_ENDPOINT() { return API_ENDPOINT; }, set API_ENDPOINT(value) { API_ENDPOINT = value; },
get REQUEST_TIMEOUT() { return REQUEST_TIMEOUT; }, set REQUEST_TIMEOUT(value) { REQUEST_TIMEOUT = value; },
get MAX_RETRIES() { return MAX_RETRIES; }, set MAX_RETRIES(value) { MAX_RETRIES = value; },
get RETRY_BASE_DELAY() { return RETRY_BASE_DELAY; }, set RETRY_BASE_DELAY(value) { RETRY_BASE_DELAY = value; },
get QPS_INTERVAL() { return QPS_INTERVAL; }, set QPS_INTERVAL(value) { QPS_INTERVAL = value; },
get CACHE_TTL() { return CACHE_TTL; }, set CACHE_TTL(value) { CACHE_TTL = value; },
get CACHE_MAX_SIZE2() { return CACHE_MAX_SIZE2; }, set CACHE_MAX_SIZE2(value) { CACHE_MAX_SIZE2 = value; },
get PURE_NUMERIC_MIN_LENGTH() { return PURE_NUMERIC_MIN_LENGTH; }, set PURE_NUMERIC_MIN_LENGTH(value) { PURE_NUMERIC_MIN_LENGTH = value; },
get outputAudit() { return outputAudit; }, set outputAudit(value) { outputAudit = value; } };
};
