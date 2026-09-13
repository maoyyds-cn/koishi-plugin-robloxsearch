'use strict';

module.exports = function create(deps) {
var BUILTIN_KEYWORDS = ["政治", "反动", "颠覆", "法轮", "台独", "港独", "疆独", "毒品", "冰毒", "海洛因", "大麻", "枪支", "军火", "色情", "裸聊", "约炮", "嫖娼", "卖淫", "诈骗", "赌博", "博彩", "洗钱"];
var EVADE_PATTERN = /[\u200b-\u200f\u202a-\u202e\u2060\ufeff\u0000-\u0008]/;
var rateState = {};
var inputCheck = {
  config: null,
  init(_0x4ceee2) {
    this.config = _0x4ceee2;
  },
  keywords() {
    return [...BUILTIN_KEYWORDS, ...(this.config?.riskKeywords || [])];
  },
  checkInput(_0x2e4e64, _0x427260) {
    const _0x492d1a = (_0x2e4e64 || "").toString();
    if (EVADE_PATTERN.test(_0x492d1a)) {
      return {
        ok: false,
        violationType: "EVADE_AUDIT",
        reason: "检测到逃避审核特征字符"
      };
    }
    const _0x39db96 = _0x492d1a.replace(/[\s\-_.·•|/\\*#]+/g, "");
    if (_0x39db96.length >= 2 && /(.)\1{0,}([^\w\u4e00-\u9fa5])(.)/.test(_0x492d1a) && this.hitKeyword(_0x39db96)) {
      return {
        ok: false,
        violationType: "EVADE_AUDIT",
        reason: "疑似分隔符绕过敏感词"
      };
    }
    if (this.hitKeyword(_0x492d1a)) {
      return {
        ok: false,
        violationType: "MALICIOUS_PROBE",
        reason: "查询词命中敏感词库"
      };
    }
    const _0x5460f2 = this.checkRate(_0x427260);
    if (_0x5460f2) {
      return _0x5460f2;
    }
    return {
      ok: true
    };
  },
  hitKeyword(_0x15b596) {
    const _0x4e5c50 = _0x15b596.toLowerCase();
    return this.keywords().some(_0x63f659 => _0x4e5c50.includes(_0x63f659.toLowerCase()));
  },
  checkRate(_0x5ae4ec) {
    const _0x36bca3 = this.config?.rateLimitPerMin ?? 20;
    const _0x5d58ad = this.config?.rateLimitPerHour ?? 200;
    const _0x410b8b = Date.now();
    const _0x496d61 = rateState[_0x5ae4ec.userId] ||= {
      minute: [],
      hour: []
    };
    _0x496d61.minute = _0x496d61.minute.filter(_0x1e43ae => _0x410b8b - _0x1e43ae < 60000);
    _0x496d61.hour = _0x496d61.hour.filter(_0x547342 => _0x410b8b - _0x547342 < 3600000);
    if (_0x496d61.minute.length >= _0x36bca3) {
      return {
        ok: false,
        rateLimited: true,
        message: "<@" + _0x5ae4ec.userId + "> 请求过于频繁，请稍后再试（限流降速，非风控冷却）。"
      };
    }
    if (_0x496d61.hour.length >= _0x5d58ad) {
      return {
        ok: false,
        rateLimited: true,
        message: "<@" + _0x5ae4ec.userId + "> 本小时请求次数过多，请稍后再试（限流降速，非风控冷却）。"
      };
    }
    _0x496d61.minute.push(_0x410b8b);
    _0x496d61.hour.push(_0x410b8b);
    return null;
  }
};
return { get BUILTIN_KEYWORDS() { return BUILTIN_KEYWORDS; }, set BUILTIN_KEYWORDS(value) { BUILTIN_KEYWORDS = value; },
get EVADE_PATTERN() { return EVADE_PATTERN; }, set EVADE_PATTERN(value) { EVADE_PATTERN = value; },
get rateState() { return rateState; }, set rateState(value) { rateState = value; },
get inputCheck() { return inputCheck; }, set inputCheck(value) { inputCheck = value; } };
};
