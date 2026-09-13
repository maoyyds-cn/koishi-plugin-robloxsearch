'use strict';

module.exports = function create(deps) {
var SearchSessionStore = class {
  constructor(_0x4a8078 = 30000, _0x587d10 = 500, _0x1743cc = 3) {
    this.ttlMs = _0x4a8078;
    this.maxSessions = _0x587d10;
    this.maxPerUser = _0x1743cc;
  }
  static {}
  sessions = new Map();
  create(_0x32457a) {
    this.prune();
    const _0x3df844 = this.generateToken();
    const _0x452fe2 = {
      ..._0x32457a,
      token: _0x3df844,
      expiresAt: Date.now() + this.ttlMs
    };
    this.sessions.set(_0x3df844, _0x452fe2);
    this.trimUser(_0x32457a.userId);
    this.trimGlobal();
    return _0x452fe2;
  }
  get(_0x5a8f83, _0x290824, _0x51d41d) {
    this.prune();
    const _0x2070c1 = this.sessions.get(_0x5a8f83);
    if (!_0x2070c1 || _0x2070c1.userId !== _0x290824 || _0x2070c1.type !== _0x51d41d) {
      return null;
    }
    _0x2070c1.expiresAt = Date.now() + this.ttlMs;
    return _0x2070c1;
  }
  update(_0x303811, _0x27213c) {
    Object.assign(_0x303811, _0x27213c, {
      expiresAt: Date.now() + this.ttlMs
    });
    this.sessions.set(_0x303811.token, _0x303811);
    return _0x303811;
  }
  clear() {
    this.sessions.clear();
  }
  generateToken() {
    let _0x1a64dd = "";
    do {
      _0x1a64dd = deps.import_crypto2.default.randomBytes(6).toString("base64url");
    } while (this.sessions.has(_0x1a64dd));
    return _0x1a64dd;
  }
  prune() {
    const _0x2a5b63 = Date.now();
    for (const [_0x26b140, _0x171284] of this.sessions) {
      if (_0x171284.expiresAt <= _0x2a5b63) {
        this.sessions.delete(_0x26b140);
      }
    }
  }
  trimUser(_0x3173b0) {
    const _0x1ce7e6 = [...this.sessions.values()].filter(_0x45cfeb => _0x45cfeb.userId === _0x3173b0).sort((_0x29c0d4, _0x9f9c26) => _0x29c0d4.expiresAt - _0x9f9c26.expiresAt);
    while (_0x1ce7e6.length > this.maxPerUser) {
      const _0x401e9f = _0x1ce7e6.shift();
      if (_0x401e9f) {
        this.sessions.delete(_0x401e9f.token);
      }
    }
  }
  trimGlobal() {
    if (this.sessions.size <= this.maxSessions) {
      return;
    }
    const _0x33a75a = [...this.sessions.values()].sort((_0x2b9dab, _0x10bff6) => _0x2b9dab.expiresAt - _0x10bff6.expiresAt);
    while (this.sessions.size > this.maxSessions) {
      const _0x2d995c = _0x33a75a.shift();
      if (!_0x2d995c) {
        break;
      }
      this.sessions.delete(_0x2d995c.token);
    }
  }
};
return { get SearchSessionStore() { return SearchSessionStore; }, set SearchSessionStore(value) { SearchSessionStore = value; } };
};
