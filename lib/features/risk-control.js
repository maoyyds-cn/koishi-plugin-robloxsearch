'use strict';

module.exports = function create(deps) {
var riskControl = {
  ctx: null,
  config: null,
  get enabled() {
    return !!this.config?.useRiskControl;
  },
  adminList() {
    const _0x53d0a5 = this.config;
    if (!_0x53d0a5) {
      return [];
    }
    return [...new Set([...(_0x53d0a5.developerList || []), ...(_0x53d0a5.adminList || []), ...(_0x53d0a5.assistAdminList || []), ...(_0x53d0a5.riskAdminList || [])])];
  },
  async init(_0x19b8e4, _0x36fa17) {
    this.ctx = _0x19b8e4;
    this.config = _0x36fa17;
    deps.inputCheck.init(_0x36fa17);
    deps.outputAudit.init(_0x19b8e4, _0x36fa17);
    await deps.violationLib.init(_0x19b8e4, _0x36fa17);
    await deps.riskStore.init(_0x19b8e4, _0x36fa17);
    await deps.auditQueue.init(_0x19b8e4, _0x36fa17);
  },
  async guardQuery(_0x520f78, _0x5063a0) {
    const _0x3c772b = {
      allowed: true,
      level: "L0",
      costMultiplier: 1,
      signinMultiplier: 1
    };
    if (!this.enabled) {
      return _0x3c772b;
    }
    const _0x44e6cf = this.adminList();
    if (deps.identityCheck.isExempt(_0x520f78, _0x44e6cf)) {
      return _0x3c772b;
    }
    if (_0x5063a0.targetId && _0x5063a0.targetType) {
      const _0x10a25e = await deps.violationLib.lookup(_0x5063a0.targetId, _0x5063a0.targetType);
      if (_0x10a25e && _0x10a25e.severity === "high") {
        const _0x5e16bd = await deps.riskStore.recordViolation(_0x520f78, _0x520f78.userId, "BLACKLIST_HIT", {
          reason: "查询命中违规库目标",
          targetName: _0x10a25e.targetName,
          targetType: _0x5063a0.targetType,
          auditSource: "local_blacklist"
        });
        return {
          allowed: false,
          message: _0x5e16bd.message,
          level: _0x5e16bd.level,
          costMultiplier: 1,
          signinMultiplier: 1
        };
      }
    }
    if (_0x5063a0.queryText) {
      const _0x454223 = deps.inputCheck.checkInput(_0x5063a0.queryText, _0x520f78);
      if (!_0x454223.ok) {
        if (_0x454223.rateLimited) {
          return {
            allowed: false,
            message: _0x454223.message,
            level: "L0",
            costMultiplier: 1,
            signinMultiplier: 1
          };
        }
        const _0x1066ae = await deps.riskStore.recordViolation(_0x520f78, _0x520f78.userId, _0x454223.violationType, {
          reason: _0x454223.reason,
          targetName: _0x5063a0.targetName,
          targetType: _0x5063a0.targetType,
          auditSource: "input_check"
        });
        return {
          allowed: false,
          message: _0x1066ae.message,
          level: _0x1066ae.level,
          costMultiplier: 1,
          signinMultiplier: 1
        };
      }
    }
    const _0x161531 = deps.identityCheck.checkIdentity(_0x520f78, _0x5063a0.scope, _0x44e6cf);
    if (!_0x161531.allowed) {
      return {
        allowed: false,
        message: _0x161531.message,
        level: _0x161531.level,
        costMultiplier: _0x161531.costMultiplier,
        signinMultiplier: _0x161531.signinMultiplier
      };
    }
    return {
      allowed: true,
      level: _0x161531.level,
      costMultiplier: _0x161531.costMultiplier,
      signinMultiplier: _0x161531.signinMultiplier
    };
  },
  async onSensitiveOutput(_0x216911, _0x188993) {
    if (!this.enabled) {
      return "";
    }
    if (deps.identityCheck.isExempt(_0x216911, this.adminList())) {
      return "";
    }
    await deps.auditQueue.enqueue({
      reporterId: _0x216911.userId,
      reporterName: _0x216911.username || _0x216911.userId,
      targetId: _0x188993.targetId,
      targetType: _0x188993.targetType,
      targetName: _0x188993.targetName,
      robloxUserId: _0x188993.targetType === "user" ? _0x188993.targetId : undefined,
      violationType: "SENSITIVE_QUERY",
      reason: _0x188993.reason || "输出审核命中敏感内容",
      summary: (_0x188993.summary || _0x188993.targetName || "（无文本）").slice(0, 500),
      pic: _0x188993.pic,
      auditSource: _0x188993.auditSource || "output_audit"
    });
    return deps.avatarAt(_0x216911.userId) + "\n⚠️ 本次查询结果包含可能违规的内容，已被拦截并**提交人工审核**。\n> 在审核确认前不会对你做任何处罚；若确认违规将依规则追加风控限制。请规范使用。";
  },
  async resolveAudit(_0x1e7155, _0x1fcfe2, _0x3a3c32) {
    const _0x694308 = deps.auditQueue.get(_0x1e7155);
    if (!_0x694308) {
      return {
        ok: false,
        message: "未找到该审核记录"
      };
    }
    if (_0x694308.status !== "pending") {
      return {
        ok: false,
        message: "该记录已被处理"
      };
    }
    if (_0x1fcfe2 === "ok") {
      await deps.auditQueue.resolve(_0x1e7155, "ok", _0x3a3c32);
      return {
        ok: true,
        message: "已标记为误判，未施加任何处罚",
        item: deps.auditQueue.get(_0x1e7155)
      };
    }
    if (_0x694308.targetType === "catalog_item") {
      if (_0x694308.targetId) {
        await deps.violationLib.add({
          targetId: _0x694308.targetId,
          targetType: _0x694308.targetType,
          targetName: _0x694308.targetName,
          violationReason: "人工审核确认商品文本含敏感信息",
          severity: "high",
          addedBy: "manual",
          sourceViolationId: _0x1e7155
        });
      }
      await deps.auditQueue.resolve(_0x1e7155, "violation", _0x3a3c32);
      return {
        ok: true,
        message: "已确认商品 " + (_0x694308.targetId || "未知") + " 的文本违规并加入违规库，未处罚查询用户",
        item: deps.auditQueue.get(_0x1e7155)
      };
    }
    const _0x49d6d7 = await deps.riskStore.recordViolation(null, _0x694308.reporterId, _0x694308.violationType, {
      reason: _0x694308.reason || "人工审核确认敏感内容",
      targetName: _0x694308.targetName,
      targetType: _0x694308.targetType,
      auditSource: "output_audit"
    });
    if (_0x694308.targetId && _0x694308.targetType) {
      await deps.violationLib.add({
        targetId: _0x694308.targetId,
        targetType: _0x694308.targetType,
        targetName: _0x694308.targetName,
        violationReason: "人工审核确认含敏感信息",
        severity: "high",
        addedBy: "manual",
        sourceViolationId: _0x1e7155
      });
    }
    await deps.auditQueue.resolve(_0x1e7155, "violation", _0x3a3c32, {
      level: _0x49d6d7.level,
      days: _0x49d6d7.durationDays
    });
    return {
      ok: true,
      message: "已裁定违规并对用户 " + _0x694308.reporterId + " 追加处罚：" + _0x49d6d7.level + "，" + (_0x49d6d7.isMaxLimit ? "10 年（上限）" : _0x49d6d7.durationDays + " 天"),
      item: deps.auditQueue.get(_0x1e7155)
    };
  },
  pendingAudits() {
    return deps.auditQueue.pending();
  },
  auditLog(_0x52a768 = 200) {
    return deps.auditQueue.all(_0x52a768);
  },
  level(_0x46194a) {
    return deps.riskStore.getEffectiveLevel(_0x46194a);
  }
};
return { get riskControl() { return riskControl; }, set riskControl(value) { riskControl = value; } };
};
