'use strict';

module.exports = function create(deps) {
function newStat() {
  return {
    found: 0,
    ok: 0,
    skip: 0,
    err: 0
  };
}
async function readDirEntries(_0x12e366, _0x2ab4a3, _0x444c23) {
  const _0x276e40 = deps.import_path7.default.join(_0x12e366.localstorage.basePath, _0x2ab4a3, _0x444c23);
  if (!deps.import_fs7.default.existsSync(_0x276e40)) {
    return {};
  }
  const _0x4db925 = {};
  for (const _0x378992 of await deps.import_promises4.default.readdir(_0x276e40)) {
    try {
      const _0x4d0bda = await _0x12e366.localstorage.getItem(_0x2ab4a3 + "/" + _0x444c23 + "/" + _0x378992);
      if (_0x4d0bda) {
        _0x4db925[_0x378992] = JSON.parse(_0x4d0bda);
      }
    } catch {
      _0x4db925[_0x378992] = undefined;
    }
  }
  return _0x4db925;
}
async function insertIfAbsent(_0x5ed94e, _0x5e3114, _0x4283f4, _0x30c097, _0x50603f) {
  try {
    const [_0x34a7f6] = await _0x5ed94e.database.get(_0x5e3114, _0x4283f4);
    if (_0x34a7f6) {
      _0x50603f.skip++;
      return;
    }
    await _0x5ed94e.database.create(_0x5e3114, _0x30c097);
    _0x50603f.ok++;
  } catch (_0x187389) {
    console.log("[migration] " + String(_0x5e3114) + " 插入失败", _0x187389);
    _0x50603f.err++;
  }
}
async function migrateAllToDatabase(_0x2c16a1, _0x7ebdb4, _0x335966) {
  if (!_0x7ebdb4.useDatabase) {
    throw new Error("useDatabase 未开启：请先在插件配置中启用数据库并重载后再迁移");
  }
  const _0x111203 = {};
  const _0xbe88dd = [{
    label: "用户数据",
    subDir: "userSave",
    table: "smm_roblox_userLocal"
  }, {
    label: "积分档案",
    subDir: "pointsProfile",
    table: "smm_roblox_points_profile"
  }, {
    label: "风控状态",
    subDir: "riskState",
    table: "smm_roblox_risk_state"
  }];
  for (const {
    label: _0x1a1ea0,
    subDir: _0x3d108b,
    table: _0x3433b5
  } of _0xbe88dd) {
    const _0x645a64 = newStat();
    const _0x5fcc25 = await readDirEntries(_0x2c16a1, _0x7ebdb4.basePath, _0x3d108b);
    for (const [_0xa8560, _0x1b95b2] of Object.entries(_0x5fcc25)) {
      _0x645a64.found++;
      if (!_0x1b95b2 || typeof _0x1b95b2 !== "object") {
        _0x645a64.err++;
        continue;
      }
      await insertIfAbsent(_0x2c16a1, _0x3433b5, {
        userId: _0xa8560
      }, {
        ..._0x1b95b2,
        userId: _0xa8560
      }, _0x645a64);
    }
    _0x111203[_0x1a1ea0] = _0x645a64;
    await _0x335966?.(_0x1a1ea0, _0x645a64);
  }
  {
    const _0x182953 = newStat();
    const _0x26ed7b = await readDirEntries(_0x2c16a1, _0x7ebdb4.basePath, "transaction");
    for (const [_0x287018, _0x33a2be] of Object.entries(_0x26ed7b)) {
      if (!Array.isArray(_0x33a2be)) {
        if (_0x33a2be !== undefined) {
          _0x182953.err++;
        }
        continue;
      }
      for (const _0x5ca256 of _0x33a2be) {
        _0x182953.found++;
        if (!_0x5ca256?.id) {
          _0x182953.err++;
          continue;
        }
        await insertIfAbsent(_0x2c16a1, "smm_roblox_transaction", {
          id: _0x5ca256.id
        }, {
          ..._0x5ca256,
          userId: _0x5ca256.userId || _0x287018
        }, _0x182953);
      }
    }
    _0x111203.交易流水 = _0x182953;
    await _0x335966?.("交易流水", _0x182953);
  }
  {
    const _0x221fd7 = newStat();
    try {
      const _0x101fb6 = await _0x2c16a1.localstorage.getItem(_0x7ebdb4.basePath + "/violationLib");
      const _0x13bba5 = _0x101fb6 ? JSON.parse(_0x101fb6) : {};
      for (const _0x5f375f of Object.values(_0x13bba5)) {
        _0x221fd7.found++;
        if (!_0x5f375f?.targetId || !_0x5f375f?.targetType) {
          _0x221fd7.err++;
          continue;
        }
        await insertIfAbsent(_0x2c16a1, "smm_roblox_violation_lib", {
          targetType: _0x5f375f.targetType,
          targetId: _0x5f375f.targetId
        }, _0x5f375f, _0x221fd7);
      }
    } catch {
      _0x221fd7.err++;
    }
    _0x111203.违规库 = _0x221fd7;
    await _0x335966?.("违规库", _0x221fd7);
  }
  {
    const _0x3f4d88 = newStat();
    try {
      const _0x47eabb = await _0x2c16a1.localstorage.getItem(_0x7ebdb4.basePath + "/auditQueue");
      const _0xc33295 = _0x47eabb ? JSON.parse(_0x47eabb) : [];
      for (const _0x46e739 of _0xc33295) {
        _0x3f4d88.found++;
        if (!_0x46e739?.id) {
          _0x3f4d88.err++;
          continue;
        }
        await insertIfAbsent(_0x2c16a1, "smm_roblox_audit_queue", {
          id: _0x46e739.id
        }, _0x46e739, _0x3f4d88);
      }
    } catch {
      _0x3f4d88.err++;
    }
    _0x111203.人工审核队列 = _0x3f4d88;
    await _0x335966?.("人工审核队列", _0x3f4d88);
  }
  return _0x111203;
}
function formatMigrationReport(_0x3ea66b) {
  const _0x187769 = Object.entries(_0x3ea66b).map(([_0x31fddb, _0x5a0042]) => "· " + _0x31fddb + "：发现 " + _0x5a0042.found + " 条，新增 " + _0x5a0042.ok + "，已存在跳过 " + _0x5a0042.skip + "，失败 " + _0x5a0042.err);
  return ["迁移完成（仅插入缺失记录，不覆盖数据库已有数据）：", ..._0x187769].join("\n");
}
return { get newStat() { return newStat; },
get readDirEntries() { return readDirEntries; },
get insertIfAbsent() { return insertIfAbsent; },
get migrateAllToDatabase() { return migrateAllToDatabase; },
get formatMigrationReport() { return formatMigrationReport; } };
};
