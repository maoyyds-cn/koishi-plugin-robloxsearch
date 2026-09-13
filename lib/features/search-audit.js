'use strict';

module.exports = function create(deps) {
var VERIFIED_VALUES = new Set(["1", "true", "是", "已验证", "verified"]);
function isVerifiedValue(_0x86e825) {
  if (_0x86e825 === true || _0x86e825 === 1) {
    return true;
  }
  if (typeof _0x86e825 !== "string") {
    return false;
  }
  return VERIFIED_VALUES.has(_0x86e825.trim().toLowerCase());
}
function shouldBypassSearchAudit(_0x520ad1) {
  if (!_0x520ad1) {
    return false;
  }
  return [_0x520ad1.hasVerifiedBadge, _0x520ad1.creatorHasVerifiedBadge, _0x520ad1.是否已验证, _0x520ad1.游戏主人状态].some(isVerifiedValue);
}
async function applySearchAudit(_0x3e4109, _0x330bca, _0x3579e3) {
  if (_0x330bca) {
    return _0x3e4109;
  } else {
    return _0x3579e3(_0x3e4109);
  }
}
return { get VERIFIED_VALUES() { return VERIFIED_VALUES; }, set VERIFIED_VALUES(value) { VERIFIED_VALUES = value; },
get isVerifiedValue() { return isVerifiedValue; },
get shouldBypassSearchAudit() { return shouldBypassSearchAudit; },
get applySearchAudit() { return applySearchAudit; } };
};
