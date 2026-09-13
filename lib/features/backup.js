'use strict';

module.exports = function create(deps) {
var BACKUP_FORMAT = "smmcat-robloxservice-backup";
var BACKUP_VERSION = 1;
function newStat2(_0x352958 = 0) {
  return {
    found: _0x352958,
    ok: 0,
    skip: 0,
    err: 0
  };
}
function computeChecksum(_0x3caf43, _0x444602) {
  return deps.import_crypto3.default.createHash("sha256").update(JSON.stringify({
    data: _0x3caf43,
    koishi: _0x444602
  })).digest("hex");
}
function getBackupDir() {
  return deps.import_path8.default.resolve(deps.pluginRoot, "data", "backup");
}
async function readDirEntries2(_0x4e4707, _0x179af4, _0x2ff169) {
  const _0x330956 = deps.import_path8.default.join(_0x4e4707.localstorage.basePath, _0x179af4, _0x2ff169);
  if (!deps.import_fs8.default.existsSync(_0x330956)) {
    return {};
  }
  const _0x5928ec = {};
  for (const _0x544d71 of await deps.import_promises5.default.readdir(_0x330956)) {
    try {
      const _0x58cebd = await _0x4e4707.localstorage.getItem(_0x179af4 + "/" + _0x2ff169 + "/" + _0x544d71);
      if (_0x58cebd) {
        _0x5928ec[_0x544d71] = JSON.parse(_0x58cebd);
      }
    } catch {}
  }
  return _0x5928ec;
}
async function readJsonItem(_0x440b7e, _0x4df81a, _0x5796bb) {
  try {
    const _0x4aaf23 = await _0x440b7e.localstorage.getItem(_0x4df81a);
    if (_0x4aaf23) {
      return JSON.parse(_0x4aaf23);
    } else {
      return _0x5796bb;
    }
  } catch {
    return _0x5796bb;
  }
}
async function getAllRows(_0x3ff955, _0x97d3bd) {
  try {
    return await _0x3ff955.database.get(_0x97d3bd, {});
  } catch {
    return [];
  }
}
async function collectBackup(_0x56c9b9, _0x1c708c) {
  const _0x5c7f93 = {
    userLocal: {},
    pointsProfile: {},
    transaction: [],
    riskState: {},
    violationLib: [],
    auditQueue: [],
    announcementList: [],
    announcementReceipt: [],
    giftCode: [],
    giftHistory: [],
    banList: {},
    banHistoryList: {},
    adminList: []
  };
  if (_0x1c708c.useDatabase) {
    for (const _0x598d26 of await getAllRows(_0x56c9b9, "smm_roblox_userLocal")) {
      _0x5c7f93.userLocal[_0x598d26.userId] = _0x598d26;
    }
    for (const _0x4acc67 of await getAllRows(_0x56c9b9, "smm_roblox_points_profile")) {
      _0x5c7f93.pointsProfile[_0x4acc67.userId] = _0x4acc67;
    }
    _0x5c7f93.transaction = await getAllRows(_0x56c9b9, "smm_roblox_transaction");
    for (const _0x3bb01d of await getAllRows(_0x56c9b9, "smm_roblox_risk_state")) {
      _0x5c7f93.riskState[_0x3bb01d.userId] = _0x3bb01d;
    }
    _0x5c7f93.violationLib = await getAllRows(_0x56c9b9, "smm_roblox_violation_lib");
    _0x5c7f93.auditQueue = await getAllRows(_0x56c9b9, "smm_roblox_audit_queue");
    _0x5c7f93.announcementList = await getAllRows(_0x56c9b9, "smm_roblox_announcement");
    _0x5c7f93.announcementReceipt = await getAllRows(_0x56c9b9, "smm_roblox_announcement_receipt");
  } else {
    _0x5c7f93.userLocal = await readDirEntries2(_0x56c9b9, _0x1c708c.basePath, "userSave");
    _0x5c7f93.pointsProfile = await readDirEntries2(_0x56c9b9, _0x1c708c.basePath, "pointsProfile");
    const _0x261261 = await readDirEntries2(_0x56c9b9, _0x1c708c.basePath, "transaction");
    for (const [_0x5773c6, _0x462c8c] of Object.entries(_0x261261)) {
      if (Array.isArray(_0x462c8c)) {
        _0x5c7f93.transaction.push(..._0x462c8c.map(_0x2afe2d => ({
          ..._0x2afe2d,
          userId: _0x2afe2d.userId || _0x5773c6
        })));
      }
    }
    _0x5c7f93.riskState = await readDirEntries2(_0x56c9b9, _0x1c708c.basePath, "riskState");
    _0x5c7f93.violationLib = Object.values(await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/violationLib", {}));
    _0x5c7f93.auditQueue = await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/auditQueue", []);
    _0x5c7f93.announcementList = Object.values(await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/announcement/list", {}));
    _0x5c7f93.announcementReceipt = Object.values(await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/announcement/receipt", {}));
  }
  _0x5c7f93.giftCode = await getAllRows(_0x56c9b9, "roblox_giftCode");
  _0x5c7f93.giftHistory = await getAllRows(_0x56c9b9, "roblox_giftHistory");
  _0x5c7f93.banList = await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/banList", {});
  _0x5c7f93.banHistoryList = await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/banHistoryList", {});
  const _0x367b09 = await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/adminList", []);
  _0x5c7f93.adminList = Array.isArray(_0x367b09) ? _0x367b09 : [];
  const _0x377a27 = {
    user: await getAllRows(_0x56c9b9, "user"),
    binding: await getAllRows(_0x56c9b9, "binding"),
    channel: await getAllRows(_0x56c9b9, "channel"),
    seenGuild: _0x1c708c.useDatabase ? await getAllRows(_0x56c9b9, "smm_roblox_seen_guild") : Object.values(await readJsonItem(_0x56c9b9, _0x1c708c.basePath + "/seenGuilds", {}))
  };
  const _0x3d3edb = getCounts(_0x5c7f93, _0x377a27);
  const _0x456e0e = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    useDatabase: _0x1c708c.useDatabase,
    counts: _0x3d3edb,
    checksum: computeChecksum(_0x5c7f93, _0x377a27)
  };
  return {
    meta: _0x456e0e,
    data: _0x5c7f93,
    koishi: _0x377a27
  };
}
var SECTION_LABELS = {
  userLocal: "用户数据",
  pointsProfile: "积分档案",
  transaction: "交易流水",
  riskState: "风控状态",
  violationLib: "违规库",
  auditQueue: "人工审核队列",
  announcementList: "公告",
  announcementReceipt: "公告接收记录",
  giftCode: "礼品码",
  giftHistory: "礼品码兑换历史",
  banList: "时效黑名单",
  banHistoryList: "风控限制历史",
  adminList: "子管理员",
  "koishi.user": "Koishi 账号",
  "koishi.binding": "Koishi 绑定（QQ openid）",
  "koishi.channel": "Koishi 频道（群 openid）",
  "koishi.seenGuild": "已见群记录"
};
function sizeOf(_0x188473) {
  if (Array.isArray(_0x188473)) {
    return _0x188473.length;
  }
  if (_0x188473 && typeof _0x188473 === "object") {
    return Object.keys(_0x188473).length;
  }
  return 0;
}
function getCounts(_0x421654, _0x3756e6) {
  const _0x4b8912 = {};
  for (const _0x43e336 of Object.keys(_0x421654)) {
    _0x4b8912[_0x43e336] = sizeOf(_0x421654[_0x43e336]);
  }
  for (const _0x39b12a of Object.keys(_0x3756e6)) {
    _0x4b8912["koishi." + _0x39b12a] = sizeOf(_0x3756e6[_0x39b12a]);
  }
  return _0x4b8912;
}
function formatPreview(_0x1bdfd5, _0x283463) {
  const _0xd6b2c5 = Object.entries(_0x1bdfd5).map(([_0x31f888, _0xe2b165]) => "· " + (SECTION_LABELS[_0x31f888] || _0x31f888) + "：" + _0xe2b165 + " 条");
  return ["当前存储模式：" + (_0x283463 ? "数据库" : "本地文件"), ..._0xd6b2c5].join("\n");
}
function formatTimestamp(_0x162e68) {
  const _0x63e9 = _0xa85d32 => String(_0xa85d32).padStart(2, "0");
  return "" + _0x162e68.getFullYear() + _0x63e9(_0x162e68.getMonth() + 1) + _0x63e9(_0x162e68.getDate()) + "-" + _0x63e9(_0x162e68.getHours()) + _0x63e9(_0x162e68.getMinutes()) + _0x63e9(_0x162e68.getSeconds());
}
async function exportBackup(_0x47a176, _0x451e65, _0x26bb9f = "roblox-backup") {
  const _0x3e619a = await collectBackup(_0x47a176, _0x451e65);
  const _0x1c488f = getBackupDir();
  await deps.import_promises5.default.mkdir(_0x1c488f, {
    recursive: true
  });
  const _0x25f28e = _0x26bb9f + "-" + formatTimestamp(new Date()) + ".json";
  const _0x55e491 = deps.import_path8.default.join(_0x1c488f, _0x25f28e);
  const _0x180ec9 = JSON.stringify(_0x3e619a, null, 2);
  await deps.import_promises5.default.writeFile(_0x55e491, _0x180ec9, "utf-8");
  return {
    fileName: _0x25f28e,
    filePath: _0x55e491,
    size: Buffer.byteLength(_0x180ec9),
    counts: _0x3e619a.meta.counts
  };
}
async function listBackups() {
  const _0x5887df = getBackupDir();
  if (!deps.import_fs8.default.existsSync(_0x5887df)) {
    return [];
  }
  const _0x335f7e = [];
  for (const _0x1a88f6 of await deps.import_promises5.default.readdir(_0x5887df)) {
    if (!_0x1a88f6.endsWith(".json")) {
      continue;
    }
    const _0x4bc299 = deps.import_path8.default.join(_0x5887df, _0x1a88f6);
    const _0xc4f083 = await deps.import_promises5.default.stat(_0x4bc299);
    _0x335f7e.push({
      fileName: _0x1a88f6,
      filePath: _0x4bc299,
      size: _0xc4f083.size,
      mtime: +_0xc4f083.mtime
    });
  }
  return _0x335f7e.sort((_0x42bc7c, _0x5e2d3b) => _0x5e2d3b.mtime - _0x42bc7c.mtime);
}
async function loadBackupFile(_0x575fd9) {
  let _0x69a2ff;
  try {
    _0x69a2ff = JSON.parse(await deps.import_promises5.default.readFile(_0x575fd9, "utf-8"));
  } catch {
    throw new Error("备份文件解析失败：不是合法的 JSON");
  }
  if (_0x69a2ff?.meta?.format !== BACKUP_FORMAT) {
    throw new Error("备份文件格式不正确：缺少有效的 meta.format");
  }
  if (_0x69a2ff.meta.version > BACKUP_VERSION) {
    throw new Error("备份文件版本过新（v" + _0x69a2ff.meta.version + "），当前支持 v" + BACKUP_VERSION);
  }
  if (!_0x69a2ff.data || !_0x69a2ff.koishi) {
    throw new Error("备份文件结构不完整：缺少 data 或 koishi 分节");
  }
  const _0x1c48d8 = computeChecksum(_0x69a2ff.data, _0x69a2ff.koishi);
  if (_0x1c48d8 !== _0x69a2ff.meta.checksum) {
    throw new Error("备份文件校验和不匹配：文件可能已被篡改或损坏");
  }
  return _0x69a2ff;
}
async function importRow(_0x26cfee, _0xbefd77, _0x55cd80, _0x13b1b8, _0xe7aed4, _0x3305e3) {
  try {
    const [_0x686896] = await _0x26cfee.database.get(_0xbefd77, _0x55cd80);
    if (_0x686896) {
      if (_0x3305e3) {
        await _0x26cfee.database.set(_0xbefd77, _0x55cd80, _0x13b1b8);
        _0xe7aed4.skip++;
      } else {
        _0xe7aed4.skip++;
      }
      return;
    }
    await _0x26cfee.database.create(_0xbefd77, _0x13b1b8);
    _0xe7aed4.ok++;
  } catch {
    _0xe7aed4.err++;
  }
}
async function importLocalMap(_0x140483, _0x41c94d, _0x544f3f, _0x55cc38, _0x24073f) {
  const _0x2c7bc7 = await readJsonItem(_0x140483, _0x41c94d, {});
  for (const [_0x3b197a, _0x1b753e] of Object.entries(_0x544f3f)) {
    if (_0x2c7bc7[_0x3b197a] !== undefined) {
      if (!_0x24073f) {
        _0x55cc38.skip++;
        continue;
      }
      _0x2c7bc7[_0x3b197a] = _0x1b753e;
      _0x55cc38.skip++;
      continue;
    }
    _0x2c7bc7[_0x3b197a] = _0x1b753e;
    _0x55cc38.ok++;
  }
  await deps.queuedSetItem(_0x140483, _0x41c94d, JSON.stringify(_0x2c7bc7));
}
async function importBackup(_0x58544c, _0x47751a, _0x548592, _0x481089 = false, _0x3f39f4) {
  const _0x22da1a = {};
  const _0xf95584 = async (_0x52b708, _0x3a0819) => {
    const _0x4fdd0d = SECTION_LABELS[_0x52b708] || _0x52b708;
    _0x22da1a[_0x4fdd0d] = _0x3a0819;
    await _0x3f39f4?.(_0x4fdd0d, _0x3a0819);
  };
  const {
    data: _0x39112b,
    koishi: _0x4c593a
  } = _0x548592;
  if (_0x47751a.useDatabase) {
    const _0x380339 = [{
      key: "userLocal",
      table: "smm_roblox_userLocal"
    }, {
      key: "pointsProfile",
      table: "smm_roblox_points_profile"
    }, {
      key: "riskState",
      table: "smm_roblox_risk_state"
    }];
    for (const {
      key: _0x51c403,
      table: _0x370a86
    } of _0x380339) {
      const _0x52a284 = _0x39112b[_0x51c403] || {};
      const _0x2068c1 = newStat2(Object.keys(_0x52a284).length);
      for (const [_0x416260, _0x326a25] of Object.entries(_0x52a284)) {
        if (!_0x326a25 || typeof _0x326a25 !== "object") {
          _0x2068c1.err++;
          continue;
        }
        await importRow(_0x58544c, _0x370a86, {
          userId: _0x416260
        }, {
          ..._0x326a25,
          userId: _0x416260
        }, _0x2068c1, _0x481089);
      }
      await _0xf95584(_0x51c403, _0x2068c1);
    }
    {
      const _0xaf3cca = newStat2(_0x39112b.transaction.length);
      for (const _0x304efc of _0x39112b.transaction) {
        if (!_0x304efc?.id) {
          _0xaf3cca.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_transaction", {
          id: _0x304efc.id
        }, _0x304efc, _0xaf3cca, _0x481089);
      }
      await _0xf95584("transaction", _0xaf3cca);
    }
    {
      const _0x16b21c = newStat2(_0x39112b.violationLib.length);
      for (const _0x422dac of _0x39112b.violationLib) {
        if (!_0x422dac?.targetId || !_0x422dac?.targetType) {
          _0x16b21c.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_violation_lib", {
          targetType: _0x422dac.targetType,
          targetId: _0x422dac.targetId
        }, _0x422dac, _0x16b21c, _0x481089);
      }
      await _0xf95584("violationLib", _0x16b21c);
    }
    {
      const _0x1763d0 = newStat2(_0x39112b.auditQueue.length);
      for (const _0x396dcb of _0x39112b.auditQueue) {
        if (!_0x396dcb?.id) {
          _0x1763d0.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_audit_queue", {
          id: _0x396dcb.id
        }, _0x396dcb, _0x1763d0, _0x481089);
      }
      await _0xf95584("auditQueue", _0x1763d0);
    }
    {
      const _0x28b54a = newStat2(_0x39112b.announcementList.length);
      for (const _0x1b03fa of _0x39112b.announcementList) {
        if (!_0x1b03fa?.id) {
          _0x28b54a.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_announcement", {
          id: _0x1b03fa.id
        }, _0x1b03fa, _0x28b54a, _0x481089);
      }
      await _0xf95584("announcementList", _0x28b54a);
    }
    {
      const _0x63556e = newStat2(_0x39112b.announcementReceipt.length);
      for (const _0x3804b4 of _0x39112b.announcementReceipt) {
        if (!_0x3804b4?.id) {
          _0x63556e.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_announcement_receipt", {
          id: _0x3804b4.id
        }, _0x3804b4, _0x63556e, _0x481089);
      }
      await _0xf95584("announcementReceipt", _0x63556e);
    }
  } else {
    const _0x12048e = [{
      key: "userLocal",
      storageKey: "userSave"
    }, {
      key: "pointsProfile",
      storageKey: "pointsProfile"
    }, {
      key: "riskState",
      storageKey: "riskState"
    }];
    for (const {
      key: _0x4887ef,
      storageKey: _0x58322a
    } of _0x12048e) {
      const _0x546bf0 = _0x39112b[_0x4887ef] || {};
      const _0x2f27c7 = newStat2(Object.keys(_0x546bf0).length);
      for (const [_0x32eb6a, _0x2f6d80] of Object.entries(_0x546bf0)) {
        if (!_0x2f6d80 || typeof _0x2f6d80 !== "object") {
          _0x2f27c7.err++;
          continue;
        }
        try {
          const _0x10dfe9 = _0x47751a.basePath + "/" + _0x58322a + "/" + _0x32eb6a;
          const _0x325567 = await _0x58544c.localstorage.getItem(_0x10dfe9);
          if (_0x325567 && !_0x481089) {
            _0x2f27c7.skip++;
            continue;
          }
          await deps.queuedSetItem(_0x58544c, _0x10dfe9, JSON.stringify(_0x2f6d80));
          if (_0x325567) {
            _0x2f27c7.skip++;
          } else {
            _0x2f27c7.ok++;
          }
        } catch {
          _0x2f27c7.err++;
        }
      }
      await _0xf95584(_0x4887ef, _0x2f27c7);
    }
    {
      const _0x437fa9 = newStat2(_0x39112b.transaction.length);
      const _0x244183 = {};
      for (const _0x592105 of _0x39112b.transaction) {
        if (!_0x592105?.id || !_0x592105?.userId) {
          _0x437fa9.err++;
          continue;
        }
        (_0x244183[_0x592105.userId] ||= []).push(_0x592105);
      }
      for (const [_0x388dff, _0x583a53] of Object.entries(_0x244183)) {
        try {
          const _0x380a70 = _0x47751a.basePath + "/transaction/" + _0x388dff;
          const _0x406eaa = await readJsonItem(_0x58544c, _0x380a70, []);
          const _0x19fae1 = new Set(_0x406eaa.map(_0x23fa32 => _0x23fa32.id));
          for (const _0x3043ca of _0x583a53) {
            if (_0x19fae1.has(_0x3043ca.id)) {
              if (_0x481089) {
                const _0x4de262 = _0x406eaa.findIndex(_0x2f0df4 => _0x2f0df4.id === _0x3043ca.id);
                _0x406eaa[_0x4de262] = _0x3043ca;
              }
              _0x437fa9.skip++;
            } else {
              _0x406eaa.push(_0x3043ca);
              _0x437fa9.ok++;
            }
          }
          await deps.queuedSetItem(_0x58544c, _0x380a70, JSON.stringify(_0x406eaa));
        } catch {
          _0x437fa9.err += _0x583a53.length;
        }
      }
      await _0xf95584("transaction", _0x437fa9);
    }
    {
      const _0x2d832f = newStat2(_0x39112b.violationLib.length);
      const _0x4712a4 = {};
      for (const _0x5843be of _0x39112b.violationLib) {
        if (!_0x5843be?.targetId || !_0x5843be?.targetType) {
          _0x2d832f.err++;
          continue;
        }
        _0x4712a4[_0x5843be.targetType + ":" + _0x5843be.targetId] = _0x5843be;
      }
      await importLocalMap(_0x58544c, _0x47751a.basePath + "/violationLib", _0x4712a4, _0x2d832f, _0x481089);
      await _0xf95584("violationLib", _0x2d832f);
    }
    {
      const _0x1475ff = newStat2(_0x39112b.auditQueue.length);
      try {
        const _0x597975 = _0x47751a.basePath + "/auditQueue";
        const _0x142d22 = await readJsonItem(_0x58544c, _0x597975, []);
        const _0xd4a398 = new Set(_0x142d22.map(_0x156776 => _0x156776.id));
        for (const _0x8ab03d of _0x39112b.auditQueue) {
          if (!_0x8ab03d?.id) {
            _0x1475ff.err++;
            continue;
          }
          if (_0xd4a398.has(_0x8ab03d.id)) {
            if (_0x481089) {
              const _0x319d72 = _0x142d22.findIndex(_0x12d373 => _0x12d373.id === _0x8ab03d.id);
              _0x142d22[_0x319d72] = _0x8ab03d;
            }
            _0x1475ff.skip++;
          } else {
            _0x142d22.push(_0x8ab03d);
            _0x1475ff.ok++;
          }
        }
        await deps.queuedSetItem(_0x58544c, _0x597975, JSON.stringify(_0x142d22));
      } catch {
        _0x1475ff.err++;
      }
      await _0xf95584("auditQueue", _0x1475ff);
    }
    {
      const _0x1ffb5b = newStat2(_0x39112b.announcementList.length);
      const _0x291076 = {};
      for (const _0xcaaa44 of _0x39112b.announcementList) {
        if (!_0xcaaa44?.id) {
          _0x1ffb5b.err++;
          continue;
        }
        _0x291076[_0xcaaa44.id] = _0xcaaa44;
      }
      await importLocalMap(_0x58544c, _0x47751a.basePath + "/announcement/list", _0x291076, _0x1ffb5b, _0x481089);
      await _0xf95584("announcementList", _0x1ffb5b);
    }
    {
      const _0x4d91cc = newStat2(_0x39112b.announcementReceipt.length);
      const _0x240337 = {};
      for (const _0x3cd936 of _0x39112b.announcementReceipt) {
        if (!_0x3cd936?.id) {
          _0x4d91cc.err++;
          continue;
        }
        _0x240337[_0x3cd936.id] = _0x3cd936;
      }
      await importLocalMap(_0x58544c, _0x47751a.basePath + "/announcement/receipt", _0x240337, _0x4d91cc, _0x481089);
      await _0xf95584("announcementReceipt", _0x4d91cc);
    }
  }
  {
    const _0x36eb98 = newStat2(_0x39112b.giftCode.length);
    for (const _0x2098d3 of _0x39112b.giftCode) {
      if (!_0x2098d3?.code) {
        _0x36eb98.err++;
        continue;
      }
      const {
        id: _0x6b4fe2,
        ..._0x49145f
      } = _0x2098d3;
      await importRow(_0x58544c, "roblox_giftCode", {
        code: _0x2098d3.code
      }, _0x49145f, _0x36eb98, _0x481089);
    }
    await _0xf95584("giftCode", _0x36eb98);
  }
  {
    const _0x2df375 = newStat2(_0x39112b.giftHistory.length);
    for (const _0x7937bb of _0x39112b.giftHistory) {
      if (!_0x7937bb?.code || !_0x7937bb?.userid) {
        _0x2df375.err++;
        continue;
      }
      const {
        id: _0x5bd1a3,
        ..._0x543364
      } = _0x7937bb;
      await importRow(_0x58544c, "roblox_giftHistory", {
        code: _0x7937bb.code,
        userid: _0x7937bb.userid
      }, _0x543364, _0x2df375, _0x481089);
    }
    await _0xf95584("giftHistory", _0x2df375);
  }
  {
    const _0x500493 = newStat2(Object.keys(_0x39112b.banList || {}).length);
    await importLocalMap(_0x58544c, _0x47751a.basePath + "/banList", _0x39112b.banList || {}, _0x500493, _0x481089);
    await _0xf95584("banList", _0x500493);
  }
  {
    const _0x498a67 = newStat2(Object.keys(_0x39112b.banHistoryList || {}).length);
    await importLocalMap(_0x58544c, _0x47751a.basePath + "/banHistoryList", _0x39112b.banHistoryList || {}, _0x498a67, _0x481089);
    await _0xf95584("banHistoryList", _0x498a67);
  }
  {
    const _0x2c0203 = Array.isArray(_0x39112b.adminList) ? _0x39112b.adminList : [];
    const _0x3e069f = newStat2(_0x2c0203.length);
    try {
      const _0x2650c2 = await readJsonItem(_0x58544c, _0x47751a.basePath + "/adminList", []);
      for (const _0x1d4be5 of _0x2c0203) {
        if (_0x2650c2.includes(_0x1d4be5)) {
          _0x3e069f.skip++;
          continue;
        }
        _0x2650c2.push(_0x1d4be5);
        _0x3e069f.ok++;
      }
      await deps.queuedSetItem(_0x58544c, _0x47751a.basePath + "/adminList", JSON.stringify(_0x2650c2));
    } catch {
      _0x3e069f.err++;
    }
    await _0xf95584("adminList", _0x3e069f);
  }
  {
    const _0x10fa0e = newStat2(_0x4c593a.user.length);
    for (const _0x18557d of _0x4c593a.user) {
      if (_0x18557d?.id === undefined) {
        _0x10fa0e.err++;
        continue;
      }
      await importRow(_0x58544c, "user", {
        id: _0x18557d.id
      }, _0x18557d, _0x10fa0e, _0x481089);
    }
    await _0xf95584("koishi.user", _0x10fa0e);
  }
  {
    const _0x417983 = newStat2(_0x4c593a.binding.length);
    for (const _0x17222a of _0x4c593a.binding) {
      if (!_0x17222a?.platform || _0x17222a?.pid === undefined) {
        _0x417983.err++;
        continue;
      }
      await importRow(_0x58544c, "binding", {
        platform: _0x17222a.platform,
        pid: _0x17222a.pid
      }, _0x17222a, _0x417983, _0x481089);
    }
    await _0xf95584("koishi.binding", _0x417983);
  }
  {
    const _0x711beb = newStat2(_0x4c593a.channel.length);
    for (const _0x5e6043 of _0x4c593a.channel) {
      if (!_0x5e6043?.platform || _0x5e6043?.id === undefined) {
        _0x711beb.err++;
        continue;
      }
      await importRow(_0x58544c, "channel", {
        platform: _0x5e6043.platform,
        id: _0x5e6043.id
      }, _0x5e6043, _0x711beb, _0x481089);
    }
    await _0xf95584("koishi.channel", _0x711beb);
  }
  {
    const _0x5e208b = newStat2(_0x4c593a.seenGuild.length);
    if (_0x47751a.useDatabase) {
      for (const _0x216f6f of _0x4c593a.seenGuild) {
        if (!_0x216f6f?.guildId) {
          _0x5e208b.err++;
          continue;
        }
        await importRow(_0x58544c, "smm_roblox_seen_guild", {
          guildId: _0x216f6f.guildId
        }, _0x216f6f, _0x5e208b, _0x481089);
      }
    } else {
      const _0x5b7d6f = {};
      for (const _0x39dc4e of _0x4c593a.seenGuild) {
        if (!_0x39dc4e?.guildId) {
          _0x5e208b.err++;
          continue;
        }
        _0x5b7d6f[_0x39dc4e.guildId] = _0x39dc4e;
      }
      await importLocalMap(_0x58544c, _0x47751a.basePath + "/seenGuilds", _0x5b7d6f, _0x5e208b, _0x481089);
    }
    await _0xf95584("koishi.seenGuild", _0x5e208b);
  }
  return _0x22da1a;
}
function formatBackupReport(_0x4f8cf2, _0x47c3e6) {
  const _0x235620 = Object.entries(_0x4f8cf2).filter(([, _0x675e99]) => _0x675e99.found > 0).map(([_0x158f03, _0x3cdf7e]) => "· " + _0x158f03 + "：备份 " + _0x3cdf7e.found + " 条，新增 " + _0x3cdf7e.ok + "，" + (_0x47c3e6 ? "覆盖" : "已存在跳过") + " " + _0x3cdf7e.skip + "，失败 " + _0x3cdf7e.err);
  if (!_0x235620.length) {
    return "备份文件内没有可导入的数据。";
  }
  return ["导入完成（" + (_0x47c3e6 ? "覆盖模式" : "仅补齐缺失记录，不覆盖已有数据") + "）：", ..._0x235620, "提示：请重载插件以加载导入后的数据。"].join("\n");
}
function formatSize(_0x469aae) {
  if (_0x469aae < 1024) {
    return _0x469aae + " B";
  }
  if (_0x469aae < 1048576) {
    return (_0x469aae / 1024).toFixed(1) + " KB";
  }
  return (_0x469aae / 1024 / 1024).toFixed(2) + " MB";
}
return { get BACKUP_FORMAT() { return BACKUP_FORMAT; }, set BACKUP_FORMAT(value) { BACKUP_FORMAT = value; },
get BACKUP_VERSION() { return BACKUP_VERSION; }, set BACKUP_VERSION(value) { BACKUP_VERSION = value; },
get newStat2() { return newStat2; },
get computeChecksum() { return computeChecksum; },
get getBackupDir() { return getBackupDir; },
get readDirEntries2() { return readDirEntries2; },
get readJsonItem() { return readJsonItem; },
get getAllRows() { return getAllRows; },
get collectBackup() { return collectBackup; },
get SECTION_LABELS() { return SECTION_LABELS; }, set SECTION_LABELS(value) { SECTION_LABELS = value; },
get sizeOf() { return sizeOf; },
get getCounts() { return getCounts; },
get formatPreview() { return formatPreview; },
get formatTimestamp() { return formatTimestamp; },
get exportBackup() { return exportBackup; },
get listBackups() { return listBackups; },
get loadBackupFile() { return loadBackupFile; },
get importRow() { return importRow; },
get importLocalMap() { return importLocalMap; },
get importBackup() { return importBackup; },
get formatBackupReport() { return formatBackupReport; },
get formatSize() { return formatSize; } };
};
