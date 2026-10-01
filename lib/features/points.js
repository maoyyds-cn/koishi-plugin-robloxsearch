'use strict';

module.exports = function create(deps) {
var POINTS_PER_EXP = 5;
async function buyExp(_0x3b6581, _0x3e4248) {
  const _0x34c942 = deps.pointsStore.config?.pointsPerExp ?? POINTS_PER_EXP;
  const _0x3ad38e = Math.floor(_0x3e4248);
  if (!_0x3ad38e || _0x3ad38e <= 0) {
    return {
      ok: false,
      cost: 0,
      leveledUp: [],
      message: "请输入要兑换的经验数（正整数）。\n例如：/兑换经验 10"
    };
  }
  const _0x3cd442 = deps.pointsStore.config?.dailyConvertExpCap ?? 0;
  const _0x3a8de3 = _0x3ad38e * _0x34c942;
  // 余额校验与扣款在 changePoints 的同一把队列锁内完成：
  // 锁外校验会读到过期余额，并发时多条请求都能通过检查，
  // 而 changePoints 内部会把扣款钳制到实际余额，造成"少扣款多发货"。
  let _0x235083 = null;
  let _0x3d9e6a = 0; // 实际发放的经验数（按实际扣款额换算）
  let _0x1b1e0c = 0; // 实际扣款额
  let _0x1e4d0a = 0; // 因每日上限而被裁剪后的经验数（0 表示未触及上限）
  let _0x4a8b21 = ""; // 拒绝原因
  await deps.pointsStore.changePoints(_0x3b6581, 0, "buy_exp", undefined, async _0x5c3e2b => {
    _0x235083 = _0x5c3e2b;
    if (_0x5c3e2b.currentPoints < _0x3a8de3) {
      _0x4a8b21 = "R点不足，兑换 " + _0x3ad38e + " 经验需要 " + _0x3a8de3 + " R点，当前仅 " + _0x5c3e2b.currentPoints + " R点。\n（" + _0x34c942 + " R点 = 1 经验）";
      return false; // 余额不足，拒绝本次兑换（队列内判断，读到的是最新余额）
    }
    let _0x3a9f3c = _0x3ad38e;
    // 每日兑换经验上限（dailyConvertExpCap，0 = 不限）
    if (_0x3cd442 > 0) {
      const _0x2b8f0a = _0x5c3e2b.queryStats?.todayConvertExp || 0;
      const _0x2d3f81 = Math.max(0, _0x3cd442 - _0x2b8f0a);
      if (_0x2d3f81 <= 0) {
        _0x4a8b21 = "今日兑换经验已达上限（" + _0x3cd442 + " 经验），明日再来吧。";
        return false;
      }
      if (_0x3a9f3c > _0x2d3f81) {
        _0x3a9f3c = _0x2d3f81;
        _0x1e4d0a = 1;
      }
    }
    const _0x2c8f01 = _0x3a9f3c * _0x34c942;
    _0x1b1e0c = _0x2c8f01;
    // 在队列内累加当日兑换量，避免并发绕过每日上限
    _0x5c3e2b.queryStats = _0x5c3e2b.queryStats || {};
    _0x5c3e2b.queryStats.todayConvertExp = (_0x5c3e2b.queryStats.todayConvertExp || 0) + _0x3a9f3c;
    return {
      amount: -_0x2c8f01,
      remark: "兑换" + _0x3a9f3c + "经验"
    };
  });
  if (!_0x235083) {
    return {
      ok: false,
      cost: 0,
      leveledUp: [],
      message: _0x4a8b21 || "兑换失败，请稍后重试。"
    };
  }
  _0x3d9e6a = _0x34c942 > 0 ? Math.floor(_0x1b1e0c / _0x34c942) : 0;
  if (_0x3d9e6a <= 0) {
    return {
      ok: false,
      cost: 0,
      leveledUp: [],
      message: _0x4a8b21 || "R点不足，无法完成兑换。"
    };
  }
  const {
    leveledUp: _0x104de1
  } = deps.applyExp(_0x235083, _0x3d9e6a);
  await deps.pointsStore.recordExp(_0x235083, _0x3d9e6a, "buy_exp");
  await deps.pointsStore.save(_0x3b6581.userId);
  return {
    ok: true,
    cost: _0x1b1e0c,
    leveledUp: _0x104de1,
    // 命中每日上限被裁剪时，向上层透出以便提示用户
    trimmed: !!_0x1e4d0a,
    grantedExp: _0x3d9e6a,
    requestedExp: _0x3ad38e
  };
}
var pointsAdmin = {
  async changePoint(_0x27f667, _0x1ab811) {
    const _0x336d0d = _0x1ab811 >= 0 ? "admin_grant" : "admin_deduct";
    const _0x424108 = await deps.pointsStore.changePointsByUserId(_0x27f667, _0x1ab811, _0x336d0d, "管理员操作");
    const _0x2b830c = deps.pointsStore.get(_0x27f667);
    const _0x5b5a14 = await deps.pointsStore.resolveUid(_0x27f667);
    const _0x4f755f = _0x5b5a14 != null ? "" : "\n（注意：该用户未在 monetary 建账，已仅更新档案镜像）";
    const _0x60b21 = _0x1ab811 >= 0 ? _0x1ab811 : -Math.min(Math.abs(_0x1ab811), _0x2b830c?.currentPoints ?? 0);
    return "已" + (_0x60b21 >= 0 ? "增加" : "扣除") + " **" + Math.abs(_0x60b21) + "** R点\n目标 " + _0x27f667 + " 当前余额：" + _0x424108 + " R点" + _0x4f755f;
  },
  async changeExp(_0x3b4bff, _0x38dd05) {
    const _0x2c1418 = await deps.pointsStore.ensure(_0x3b4bff);
    let _0x1b13a8 = [];
    if (_0x38dd05 >= 0) {
      _0x1b13a8 = deps.applyExp(_0x2c1418, _0x38dd05).leveledUp;
      await deps.pointsStore.recordExp(_0x2c1418, _0x38dd05, "admin_grant", "管理员增经验");
    } else {
      deps.deductExp(_0x2c1418, -_0x38dd05);
      await deps.pointsStore.recordExp(_0x2c1418, _0x38dd05, "admin_deduct", "管理员扣经验");
    }
    await deps.pointsStore.save(_0x3b4bff);
    const _0x280686 = _0x1b13a8.length ? "\n触发升级 → " + deps.getLevelLabel(_0x2c1418.level) : "";
    return "已" + (_0x38dd05 >= 0 ? "增加" : "扣除") + " **" + Math.abs(_0x38dd05) + "** 经验\n目标 " + _0x3b4bff + "：" + deps.getLevelLabel(_0x2c1418.level) + "，本级 " + _0x2c1418.expIntoLevel + " 经验" + _0x280686;
  },
  async setLevel(_0x2d6519, _0x245583) {
    const _0x5cf877 = await deps.pointsStore.ensure(_0x2d6519);
    const _0x1449ce = Math.max(0, Math.floor(_0x245583));
    _0x5cf877.level = _0x1449ce;
    _0x5cf877.expIntoLevel = 0;
    await deps.pointsStore.recordExp(_0x5cf877, 0, "admin_set_level", "设定等级=" + _0x1449ce);
    await deps.pointsStore.save(_0x2d6519);
    return "已将目标 " + _0x2d6519 + " 设定为 " + deps.getLevelLabel(_0x5cf877.level) + "，本级经验已归零。";
  }
};
var points = {
  async init(_0x22e9e0, _0x4dfb7a) {
    await deps.transactionStore.init(_0x22e9e0, _0x4dfb7a);
    await deps.pointsStore.init(_0x22e9e0, _0x4dfb7a);
  },
  async onLevelUp(_0x6ea87a, _0x1e391c) {
    const _0x3395eb = deps.pointsStore.config?.levelUpRewardPoints ?? 100;
    const _0x2b3352 = await deps.pointsStore.ensure(_0x6ea87a.userId);
    const _0xd46cee = _0x1e391c[_0x1e391c.length - 1];
    if (_0x3395eb > 0) {
      await deps.pointsStore.changePoints(_0x6ea87a, _0x3395eb * _0x1e391c.length, "level_up", "升级至" + _0xd46cee + "级");
    }
    const _0x4e97c6 = deps.getPrivilege(_0xd46cee);
    const _0x4c4ac1 = _0x4e97c6.dailyQueryLimit === Infinity ? "无限" : _0x4e97c6.dailyQueryLimit;
    const _0x1b5550 = _0x4e97c6.freeQuota === Infinity ? "无限" : _0x4e97c6.freeQuota;
    await deps.Chat.send(_0x6ea87a, deps.avatarAt(_0x6ea87a.userId) + " 🎉恭喜升级！\n- 当前等级：**" + deps.getLevelLabel(_0xd46cee) + "**\n- 奖励：+" + _0x3395eb * _0x1e391c.length + " R点\n- 每日查询次数上限增大到 " + _0x4c4ac1 + " 次\n- 单次查询消耗为 " + _0x4e97c6.queryCost + " R点\n- 每日免积分查询次数剩余 " + _0x1b5550 + " 次", "🎉 恭喜升级！\n当前等级：" + deps.getLevelLabel(_0xd46cee) + "\n奖励：+" + _0x3395eb * _0x1e391c.length + " R点\n新特权：每日上限 " + _0x4c4ac1 + " 次｜单次消耗 " + _0x4e97c6.queryCost + " R点｜免积分 " + _0x1b5550 + " 次");
  }
};
return { get POINTS_PER_EXP() { return POINTS_PER_EXP; }, set POINTS_PER_EXP(value) { POINTS_PER_EXP = value; },
get buyExp() { return buyExp; },
get pointsAdmin() { return pointsAdmin; }, set pointsAdmin(value) { pointsAdmin = value; },
get points() { return points; }, set points(value) { points = value; } };
};
