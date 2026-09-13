'use strict';

module.exports = function create(deps) {
var DAY2 = 86400000;
var MAX_DURATION = DAY2 * 3650;
var LEVEL_ORDER = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4
};
var GRADIENT = {
  SENSITIVE_QUERY: [{
    count: 1,
    level: "L1",
    duration: DAY2 * 7,
    window: 0
  }, {
    count: 2,
    level: "L2",
    duration: DAY2 * 14,
    window: DAY2 * 90
  }, {
    count: 3,
    level: "L3",
    duration: DAY2 * 30,
    window: DAY2 * 180
  }, {
    count: 4,
    level: "L4",
    duration: DAY2 * 90,
    window: 0
  }, {
    count: 5,
    level: "L4",
    duration: MAX_DURATION,
    window: 0
  }],
  MALICIOUS_PROBE: [{
    count: 1,
    level: "L2",
    duration: DAY2 * 14,
    window: 0
  }, {
    count: 2,
    level: "L3",
    duration: DAY2 * 30,
    window: DAY2 * 180
  }, {
    count: 3,
    level: "L4",
    duration: MAX_DURATION,
    window: 0
  }],
  EVADE_AUDIT: [{
    count: 1,
    level: "L2",
    duration: DAY2 * 14,
    window: 0
  }, {
    count: 2,
    level: "L3",
    duration: DAY2 * 30,
    window: DAY2 * 180
  }, {
    count: 3,
    level: "L4",
    duration: MAX_DURATION,
    window: 0
  }],
  BLACKLIST_HIT: [{
    count: 1,
    level: "L1",
    duration: DAY2 * 7,
    window: 0
  }, {
    count: 2,
    level: "L2",
    duration: DAY2 * 14,
    window: 0
  }, {
    count: 3,
    level: "L3",
    duration: DAY2 * 30,
    window: 0
  }, {
    count: 4,
    level: "L4",
    duration: MAX_DURATION,
    window: 0
  }]
};
function getGradient(_0x2fb0cc, _0x42a93e) {
  const _0x4b0428 = GRADIENT[_0x2fb0cc];
  for (let _0x40fb8f = _0x4b0428.length - 1; _0x40fb8f >= 0; _0x40fb8f--) {
    if (_0x42a93e >= _0x4b0428[_0x40fb8f].count) {
      return _0x4b0428[_0x40fb8f];
    }
  }
  return _0x4b0428[0];
}
var VIOLATION_DEDUCT = {
  SENSITIVE_QUERY: {
    points: 100,
    exp: 20
  },
  BLACKLIST_HIT: {
    points: 50,
    exp: 10
  },
  MALICIOUS_PROBE: {
    points: 200,
    exp: 40
  },
  EVADE_AUDIT: {
    points: 200,
    exp: 40
  }
};
function mergeRestrictions(_0x2db196) {
  const _0x45a71b = Date.now();
  const _0x1b91c7 = _0x2db196.filter(_0x17298f => _0x17298f.expiresAt > _0x45a71b);
  if (!_0x1b91c7.length) {
    return null;
  }
  const _0x353332 = new Set(_0x1b91c7.map(_0x45a422 => _0x45a422.type));
  if (_0x353332.size >= 3) {
    return {
      level: "L4",
      expiresAt: _0x45a71b + DAY2 * 90
    };
  }
  let _0x28fb5e = "L0";
  let _0x6dbf66 = 0;
  for (const _0x1e02a9 of _0x1b91c7) {
    if (LEVEL_ORDER[_0x1e02a9.level] > LEVEL_ORDER[_0x28fb5e]) {
      _0x28fb5e = _0x1e02a9.level;
    }
    _0x6dbf66 = Math.max(_0x6dbf66, _0x1e02a9.expiresAt - _0x45a71b);
  }
  let _0x1399be = 0;
  if (_0x353332.size >= 2) {
    _0x1399be = DAY2 * 7;
  }
  return {
    level: _0x28fb5e,
    expiresAt: _0x45a71b + Math.min(_0x6dbf66 + _0x1399be, MAX_DURATION)
  };
}
var COOLDOWN_DISCOUNT = {
  4: 0.05,
  5: 0.15,
  6: 0.2,
  7: 0.3
};
function applyLevelCooldownDiscount(_0x41705f, _0x561320, _0x2c4612) {
  if (_0x41705f !== "L1") {
    return _0x561320;
  }
  const _0x43fefe = COOLDOWN_DISCOUNT[Math.min(_0x2c4612, 7)] ?? 0;
  return Math.round(_0x561320 * (1 - _0x43fefe));
}
var OBSERVATION_PERIOD = DAY2 * 30;
var LEVEL_DEFAULT_DURATION = {
  L0: 0,
  L1: DAY2 * 7,
  L2: DAY2 * 14,
  L3: DAY2 * 30,
  L4: DAY2 * 90
};
function bumpLevel(_0x2ddcf6) {
  const _0x1a502d = Math.min(LEVEL_ORDER[_0x2ddcf6] + 1, 4);
  return ["L0", "L1", "L2", "L3", "L4"][_0x1a502d];
}
return { get DAY2() { return DAY2; }, set DAY2(value) { DAY2 = value; },
get MAX_DURATION() { return MAX_DURATION; }, set MAX_DURATION(value) { MAX_DURATION = value; },
get LEVEL_ORDER() { return LEVEL_ORDER; }, set LEVEL_ORDER(value) { LEVEL_ORDER = value; },
get GRADIENT() { return GRADIENT; }, set GRADIENT(value) { GRADIENT = value; },
get getGradient() { return getGradient; },
get VIOLATION_DEDUCT() { return VIOLATION_DEDUCT; }, set VIOLATION_DEDUCT(value) { VIOLATION_DEDUCT = value; },
get mergeRestrictions() { return mergeRestrictions; },
get COOLDOWN_DISCOUNT() { return COOLDOWN_DISCOUNT; }, set COOLDOWN_DISCOUNT(value) { COOLDOWN_DISCOUNT = value; },
get applyLevelCooldownDiscount() { return applyLevelCooldownDiscount; },
get OBSERVATION_PERIOD() { return OBSERVATION_PERIOD; }, set OBSERVATION_PERIOD(value) { OBSERVATION_PERIOD = value; },
get LEVEL_DEFAULT_DURATION() { return LEVEL_DEFAULT_DURATION; }, set LEVEL_DEFAULT_DURATION(value) { LEVEL_DEFAULT_DURATION = value; },
get bumpLevel() { return bumpLevel; } };
};
