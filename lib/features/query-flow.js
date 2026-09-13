'use strict';

module.exports = function create(deps) {
const queryFlow = {
  async begin(_0x19f7f7, _0x3c64e5) {
    let _0x37d3aa = 1;
    if (deps.config.useRiskControl) {
      const _0x591062 = await deps.riskControl.guardQuery(_0x19f7f7, {
        scope: _0x3c64e5.scope,
        targetType: _0x3c64e5.targetType,
        targetId: _0x3c64e5.targetId,
        queryText: _0x3c64e5.queryText
      });
      if (!_0x591062.allowed) {
        if (_0x591062.message) {
          await deps.Chat.send(_0x19f7f7, _0x591062.message);
        }
        return {
          ok: false,
          costMultiplier: _0x591062.costMultiplier
        };
      }
      _0x37d3aa = _0x591062.costMultiplier;
    }
    return {
      ok: true,
      costMultiplier: _0x37d3aa
    };
  },
  async cancel(_0x1cd789, _0x5d12a4) {
    if (!deps.config.useExpSystem || !_0x5d12a4) {
      return;
    }
    try {
      await deps.refundQuery(_0x1cd789, _0x5d12a4);
    } catch {
      if (deps.config.deBug) {
        console.log("[queryFlow.cancel] 查询计费回滚失败");
      }
    }
  },
  async sensitive(_0x3df4a9, _0x29fef8) {
    if (!deps.config.useRiskControl) {
      return;
    }
    try {
      const _0x47ecfe = await deps.riskControl.onSensitiveOutput(_0x3df4a9, _0x29fef8);
      if (_0x47ecfe) {
        await deps.Chat.send(_0x3df4a9, _0x47ecfe);
      }
    } catch (_0x286cdb) {
      if (deps.config.deBug) {
        console.log("[queryFlow.sensitive]", _0x286cdb);
      }
    }
  }
};
return { get queryFlow() { return queryFlow; } };
};
