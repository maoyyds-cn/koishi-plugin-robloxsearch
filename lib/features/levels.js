'use strict';

module.exports = function create(deps) {
var EXP_TO_NEXT = {
  0: 70,
  1: 230,
  2: 300,
  3: 300,
  4: 300,
  5: 1200,
  6: 1250
};
var DEFAULT_EXP_TO_NEXT = 1250;
function expToNext(_0x485ed9) {
  if (_0x485ed9 < 0) {
    return EXP_TO_NEXT[0];
  }
  return EXP_TO_NEXT[_0x485ed9] ?? DEFAULT_EXP_TO_NEXT;
}
function applyExp(_0x59d6f5, _0xbf5f82) {
  const _0x590b3c = [];
  if (_0xbf5f82 <= 0) {
    return {
      leveledUp: _0x590b3c
    };
  }
  _0x59d6f5.expIntoLevel += _0xbf5f82;
  _0x59d6f5.totalExpEarned += _0xbf5f82;
  let _0x3add48 = 0;
  while (_0x59d6f5.expIntoLevel >= expToNext(_0x59d6f5.level) && _0x3add48 < 10000) {
    _0x59d6f5.expIntoLevel -= expToNext(_0x59d6f5.level);
    _0x59d6f5.level += 1;
    _0x590b3c.push(_0x59d6f5.level);
    _0x3add48++;
  }
  return {
    leveledUp: _0x590b3c
  };
}
function deductExp(_0x203758, _0x554153) {
  if (_0x554153 <= 0) {
    return;
  }
  _0x203758.expIntoLevel = Math.max(0, _0x203758.expIntoLevel - _0x554153);
}
var PRIVILEGE_TABLE = [{
  level: 0,
  name: "未激活",
  badge: "",
  dailyQueryLimit: 10,
  queryCost: 2,
  freeQuota: 0,
  cooldownDiscount: 0,
  showNickname: false,
  showAvatar: false,
  showGameCover: false,
  showGroupIcon: false
}, {
  level: 1,
  name: "新手",
  badge: "⭐",
  dailyQueryLimit: 15,
  queryCost: 2,
  freeQuota: 0,
  cooldownDiscount: 0,
  showNickname: false,
  showAvatar: false,
  showGameCover: false,
  showGroupIcon: false
}, {
  level: 2,
  name: "初级",
  badge: "⭐⭐",
  dailyQueryLimit: 25,
  queryCost: 2,
  freeQuota: 0,
  cooldownDiscount: 0,
  showNickname: true,
  showAvatar: false,
  showGameCover: false,
  showGroupIcon: false
}, {
  level: 3,
  name: "中级",
  badge: "⭐⭐⭐",
  dailyQueryLimit: 40,
  queryCost: 2,
  freeQuota: 0,
  cooldownDiscount: 0,
  showNickname: true,
  showAvatar: false,
  showGameCover: true,
  showGroupIcon: false
}, {
  level: 4,
  name: "高级",
  badge: "⭐⭐⭐⭐",
  dailyQueryLimit: 60,
  queryCost: 1,
  freeQuota: 0,
  cooldownDiscount: 0.05,
  showNickname: true,
  showAvatar: true,
  showGameCover: true,
  showGroupIcon: true
}, {
  level: 5,
  name: "资深",
  badge: "⭐⭐⭐⭐⭐",
  dailyQueryLimit: 100,
  queryCost: 1,
  freeQuota: 3,
  cooldownDiscount: 0.15,
  showNickname: true,
  showAvatar: true,
  showGameCover: true,
  showGroupIcon: true
}, {
  level: 6,
  name: "大师",
  badge: "🏆",
  dailyQueryLimit: 150,
  queryCost: 1,
  freeQuota: 5,
  cooldownDiscount: 0.2,
  showNickname: true,
  showAvatar: true,
  showGameCover: true,
  showGroupIcon: true
}, {
  level: 7,
  name: "宗师",
  badge: "👑",
  dailyQueryLimit: Infinity,
  queryCost: 0,
  freeQuota: Infinity,
  cooldownDiscount: 0.3,
  showNickname: true,
  showAvatar: true,
  showGameCover: true,
  showGroupIcon: true
}];
function getPrivilege(_0x25ee53) {
  const _0x5c4c24 = Math.max(0, Math.min(_0x25ee53, PRIVILEGE_TABLE.length - 1));
  return PRIVILEGE_TABLE[_0x5c4c24];
}
function getLevelLabel(_0x22d34d) {
  const _0x525c70 = getPrivilege(_0x22d34d);
  return _0x22d34d + " 级 " + _0x525c70.name + (_0x525c70.badge ? " " + _0x525c70.badge : "");
}
function describeLevels() {
  const _0x45af5e = PRIVILEGE_TABLE.map(_0x334321 => {
    const _0x5e4ac4 = _0x334321.level >= 7 ? "1250/级" : String(expToNext(_0x334321.level));
    const _0x23750f = _0x334321.dailyQueryLimit === Infinity ? "无限" : _0x334321.dailyQueryLimit;
    const _0x4fbdb3 = _0x334321.freeQuota === Infinity ? "无限" : _0x334321.freeQuota;
    const _0x40cd1d = _0x334321.cooldownDiscount ? Math.round(_0x334321.cooldownDiscount * 100) + "%" : "0%";
    return _0x334321.level + "级 " + _0x334321.name + _0x334321.badge + "｜升级需" + _0x5e4ac4 + "经验｜每日上限" + _0x23750f + "｜单次" + _0x334321.queryCost + "R｜免积分" + _0x4fbdb3 + "｜冷却减免" + _0x40cd1d;
  });
  return _0x45af5e.join("\n");
}
return { get EXP_TO_NEXT() { return EXP_TO_NEXT; }, set EXP_TO_NEXT(value) { EXP_TO_NEXT = value; },
get DEFAULT_EXP_TO_NEXT() { return DEFAULT_EXP_TO_NEXT; }, set DEFAULT_EXP_TO_NEXT(value) { DEFAULT_EXP_TO_NEXT = value; },
get expToNext() { return expToNext; },
get applyExp() { return applyExp; },
get deductExp() { return deductExp; },
get PRIVILEGE_TABLE() { return PRIVILEGE_TABLE; }, set PRIVILEGE_TABLE(value) { PRIVILEGE_TABLE = value; },
get getPrivilege() { return getPrivilege; },
get getLevelLabel() { return getLevelLabel; },
get describeLevels() { return describeLevels; } };
};
