'use strict';

module.exports = function create(deps) {
var CACHE_MAX_AGE = 300000;
var CACHE_MAX_SIZE = 300;
var requestCache = {
  userCacheList: [],
  userCache: {},
  userKeyCache: {},
  getUserCache(_0x3b2032, _0x58a2a7) {
    try {
      let _0x60178f = _0x3b2032;
      if (_0x58a2a7) {
        _0x60178f = requestCache.userKeyCache[_0x3b2032.toLocaleLowerCase()];
        if (!_0x60178f) {
          return null;
        }
      }
      const _0x1a99a6 = this.userCache[_0x60178f];
      if (!_0x1a99a6) {
        return null;
      }
      const _0x1dad52 = Date.now();
      if (_0x1dad52 - _0x1a99a6.timestamp > CACHE_MAX_AGE) {
        this.deleteCacheByUserId(_0x60178f);
        return null;
      }
      return {
        success: true,
        data: _0x1a99a6.data
      };
    } catch (_0x1641d9) {
      return null;
    }
  },
  addUserCache(_0x35f58a) {
    if (!_0x35f58a) {
      return;
    }
    const {
      userId: _0xea2d2f,
      username: _0x307bfa
    } = _0x35f58a;
    if (!_0xea2d2f || !_0x307bfa) {
      return;
    }
    this.userKeyCache[_0x307bfa.toLocaleLowerCase()] = _0xea2d2f;
    if (this.userCacheList.includes(_0xea2d2f)) {
      this.userCacheList = this.userCacheList.filter(_0x4ac6d7 => _0x4ac6d7 !== _0xea2d2f);
    }
    this.userCacheList.push(_0xea2d2f);
    this.userCache[_0xea2d2f] = {
      data: _0x35f58a,
      timestamp: Date.now()
    };
    this.cleanAllExpiredCache();
    this.trimCacheToMaxSize();
  },
  cleanAllExpiredCache() {
    const _0x51679d = Date.now();
    const _0x429ecd = [];
    for (const _0x1d5efa of this.userCacheList) {
      const _0x569767 = this.userCache[_0x1d5efa];
      if (!_0x569767 || _0x51679d - _0x569767.timestamp > CACHE_MAX_AGE) {
        _0x429ecd.push(_0x1d5efa);
      }
    }
    _0x429ecd.forEach(_0x441a1f => this.deleteCacheByUserId(_0x441a1f));
  },
  trimCacheToMaxSize() {
    while (this.userCacheList.length > CACHE_MAX_SIZE) {
      const _0x5dabaa = this.userCacheList.shift();
      if (_0x5dabaa) {
        this.deleteCacheByUserId(_0x5dabaa);
      }
    }
  },
  deleteCacheByUserId(_0x213558) {
    const _0x3bccb1 = Object.keys(this.userKeyCache).find(_0x5d7118 => this.userKeyCache[_0x5d7118] === _0x213558);
    if (_0x3bccb1) {
      delete this.userKeyCache[_0x3bccb1];
    }
    delete this.userCache[_0x213558];
  },
  clearUserCache() {
    this.cleanAllExpiredCache();
    this.trimCacheToMaxSize();
  }
};
return { get CACHE_MAX_AGE() { return CACHE_MAX_AGE; }, set CACHE_MAX_AGE(value) { CACHE_MAX_AGE = value; },
get CACHE_MAX_SIZE() { return CACHE_MAX_SIZE; }, set CACHE_MAX_SIZE(value) { CACHE_MAX_SIZE = value; },
get requestCache() { return requestCache; }, set requestCache(value) { requestCache = value; } };
};
