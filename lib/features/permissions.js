'use strict';

module.exports = function create(deps) {
const requirePerm = async (_0x89844b, _0x55cf00, _0x4230d4, _0x416f13 = "") => {
  if (deps.Roles.has(_0x89844b.userId, _0x55cf00)) {
    return true;
  }
  await deps.OpLog.record({
    operatorId: _0x89844b.userId,
    operatorRole: deps.Roles.resolve(_0x89844b.userId),
    action: _0x4230d4,
    detail: _0x416f13 || "权限不足，操作被拒绝",
    result: "denied"
  });
  await deps.Chat.send(_0x89844b, "<@" + _0x89844b.userId + "> 无权限。当前身份：" + deps.Roles.label(_0x89844b.userId), "无权限。当前身份：" + deps.Roles.label(_0x89844b.userId));
  return false;
};
const logOp = (_0x4d21c3, _0x2295c9, _0x1dc706, _0x1fd575 = "success") => deps.OpLog.record({
  operatorId: _0x4d21c3.userId,
  operatorRole: deps.Roles.resolve(_0x4d21c3.userId),
  action: _0x2295c9,
  detail: _0x1dc706,
  result: _0x1fd575
});
return { get requirePerm() { return requirePerm; },
get logOp() { return logOp; } };
};
