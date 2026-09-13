'use strict';

module.exports = function create(deps) {
var QUERY_EXP = 1;
function getDailyQueryState(_0x450aa7) {
  const _0x222510 = deps.pointsStore.get(_0x450aa7);
  if (!_0x222510) {
    return null;
  }
  const _0x2ede43 = deps.getPrivilege(_0x222510.level);
  return {
    todayCount: _0x222510.queryStats.todayCount,
    dailyLimit: _0x2ede43.dailyQueryLimit,
    freeUsed: _0x222510.queryStats.todayFreeUsed,
    freeQuota: _0x2ede43.freeQuota,
    queryCost: _0x2ede43.queryCost
  };
}
async function consumeForQuery(_0x107f79, _0x4fa27b = 1) {
  const _0x18ba70 = await deps.pointsStore.syncBalance(_0x107f79);
  const _0x206abd = deps.getPrivilege(_0x18ba70.level);
  const _0x3b3fc0 = snapshotQueryState(_0x18ba70);
  if (_0x206abd.dailyQueryLimit !== Infinity && _0x18ba70.queryStats.todayCount >= _0x206abd.dailyQueryLimit) {
    return {
      ok: false,
      message: "<@" + _0x107f79.userId + "> 您今日查询次数已达上限（" + _0x206abd.dailyQueryLimit + " 次/天）\n当前用户等级：" + _0x18ba70.level + " 级 " + _0x206abd.name + _0x206abd.badge + "\n> 提示：提升等级可获得更高每日上限，明日 0 点重置。"
    };
  }
  const _0x1756c6 = _0x206abd.freeQuota === Infinity ? Infinity : _0x206abd.freeQuota - _0x18ba70.queryStats.todayFreeUsed;
  if (_0x1756c6 > 0) {
    _0x18ba70.queryStats.todayFreeUsed += _0x1756c6 === Infinity ? 0 : 1;
    await commitQuery(_0x107f79, _0x18ba70);
    return {
      ok: true,
      cost: 0,
      usedFree: true,
      receipt: {
        cost: 0,
        usedFree: true,
        before: _0x3b3fc0
      }
    };
  }
  const _0x314be3 = _0x206abd.queryCost * _0x4fa27b;
  if (_0x314be3 > 0 && _0x18ba70.currentPoints < _0x314be3) {
    return {
      ok: false,
      message: insufficientPointsMessage(_0x107f79, _0x314be3, _0x18ba70.currentPoints)
    };
  }
  if (_0x314be3 > 0) {
    await deps.pointsStore.changePoints(_0x107f79, -_0x314be3, "query", _0x4fa27b > 1 ? "风控冷却×2" : undefined);
  }
  await commitQuery(_0x107f79, _0x18ba70);
  return {
    ok: true,
    cost: _0x314be3,
    receipt: {
      cost: _0x314be3,
      usedFree: false,
      before: _0x3b3fc0
    }
  };
}
async function refundQuery(_0x21fac3, _0x421827) {
  if (!_0x421827 || _0x421827.refunded || _0x421827.refunding) {
    return;
  }
  _0x421827.refunding = true;
  try {
    const _0x40ab10 = deps.pointsStore.get(_0x21fac3.userId);
    if (_0x40ab10) {
      const _0x3da5eb = _0x40ab10.queryStats.todayExpCount > _0x421827.before.todayExpCount;
      _0x40ab10.level = _0x421827.before.level;
      _0x40ab10.expIntoLevel = _0x421827.before.expIntoLevel;
      _0x40ab10.totalExpEarned = _0x421827.before.totalExpEarned;
      _0x40ab10.queryStats.todayCount = _0x421827.before.todayCount;
      _0x40ab10.queryStats.todayExpCount = _0x421827.before.todayExpCount;
      _0x40ab10.queryStats.todayFreeUsed = _0x421827.before.todayFreeUsed;
      _0x40ab10.queryStats.lastQueryAt = _0x421827.before.lastQueryAt;
      _0x40ab10.queryStats.totalQueries = _0x421827.before.totalQueries;
      if (_0x3da5eb) {
        await deps.pointsStore.recordExp(_0x40ab10, -QUERY_EXP, "query_refund", "系统或上游查询失败");
      }
      await deps.pointsStore.save(_0x21fac3.userId);
    }
    if (_0x421827.cost > 0) {
      await deps.pointsStore.changePoints(_0x21fac3, _0x421827.cost, "query_refund", "系统或上游查询失败");
    }
    _0x421827.refunded = true;
  } finally {
    _0x421827.refunding = false;
  }
}
function snapshotQueryState(_0x2daa01) {
  return {
    level: _0x2daa01.level,
    expIntoLevel: _0x2daa01.expIntoLevel,
    totalExpEarned: _0x2daa01.totalExpEarned,
    todayCount: _0x2daa01.queryStats.todayCount,
    todayExpCount: _0x2daa01.queryStats.todayExpCount,
    todayFreeUsed: _0x2daa01.queryStats.todayFreeUsed,
    lastQueryAt: _0x2daa01.queryStats.lastQueryAt,
    totalQueries: _0x2daa01.queryStats.totalQueries
  };
}
async function commitQuery(_0x288c4a, _0x490bb7 = deps.pointsStore.get(_0x288c4a.userId)) {
  if (!_0x490bb7) {
    return;
  }
  _0x490bb7.queryStats.todayCount += 1;
  _0x490bb7.queryStats.totalQueries += 1;
  _0x490bb7.queryStats.lastQueryAt = Date.now();
  const _0x19925c = deps.pointsStore.config?.dailyQueryExpCap ?? 5;
  if (_0x490bb7.queryStats.todayExpCount < _0x19925c) {
    _0x490bb7.queryStats.todayExpCount += 1;
    deps.applyExp(_0x490bb7, QUERY_EXP);
    await deps.pointsStore.recordExp(_0x490bb7, QUERY_EXP, "query");
  }
  await deps.pointsStore.save(_0x288c4a.userId);
}
function insufficientPointsMessage(_0x14d996, _0x33da7d, _0x9b8052) {
  if (_0x9b8052 <= 0) {
    return deps.avatarAt(_0x14d996.userId) + " 你的R点余额为 **0**\n---\n查询需要消耗 R点，先来补充一下吧～\n💡 立即获取：\n- 发送 <qqbot-cmd-input text=\"签到\" show=\"签到\"/> 领取今日 R点（约 10~30）\n- 也可用 <qqbot-cmd-input text=\"兑换经验\" show=\"兑换经验\"/> 了解经验体系\n- 经验值与 R点 互相独立：\n- 发送 <qqbot-cmd-input text=\"积分\" show=\"查看积分\"/> 查看详情";
  }
  return deps.avatarAt(_0x14d996.userId) + " R点不足，无法查询\n本次需要：**" + _0x33da7d + "** R点\n> 当前余额：" + _0x9b8052 + " R点 ➜ 还差 " + (_0x33da7d - _0x9b8052) + " R点";
}
return { get QUERY_EXP() { return QUERY_EXP; }, set QUERY_EXP(value) { QUERY_EXP = value; },
get getDailyQueryState() { return getDailyQueryState; },
get consumeForQuery() { return consumeForQuery; },
get refundQuery() { return refundQuery; },
get snapshotQueryState() { return snapshotQueryState; },
get commitQuery() { return commitQuery; },
get insufficientPointsMessage() { return insufficientPointsMessage; } };
};
