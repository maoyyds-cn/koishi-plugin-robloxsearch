'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/我的信息").userFields(["id"]).action(async ({
  session: _0x57f9bb
}) => {
  const {
    userId: _0x4593e3,
    guildId: _0x2a56bb
  } = _0x57f9bb;
  let _0x24d7c8 = "\n[Roblox用户ID] 未绑定Roblox账号";
  let _0x268fd8 = "\n[Roblox用户名] 未绑定Roblox账号";
  let _0x3ab801 = "\n[所持R点] 0点";
  await deps.userLocal.initUserInfo(_0x57f9bb.userId);
  if (deps.userLocal.userList[_0x57f9bb.userId]?.bindingId) {
    _0x24d7c8 = "\n[Roblox用户ID] " + deps.userLocal.userList[_0x57f9bb.userId]?.bindingId;
  }
  if (deps.userLocal.userList[_0x57f9bb.userId]?.bindingName) {
    _0x268fd8 = "\n[Roblox用户名] " + deps.userLocal.userList[_0x57f9bb.userId]?.bindingName;
  }
  const [_0x2a53ad] = await deps.ctx.database.get("monetary", {
    uid: _0x57f9bb.user.id
  });
  const _0x6473f6 = _0x2a53ad ? _0x2a53ad.value : 0;
  if (!_0x2a53ad) {
    await deps.ctx.monetary.gain(_0x57f9bb.user.id, 0);
  } else {
    _0x3ab801 = "\n[所持R点] " + _0x6473f6 + "点";
  }
  let _0x102e85 = "";
  if (deps.config.useExpSystem) {
    const _0x1a812d = await deps.pointsStore.ensure(_0x57f9bb.userId);
    _0x102e85 = deps.getLevelLabel(_0x1a812d.level);
  }
  const _0x2fbdcd = deps.Roles.label(_0x57f9bb.userId);
  let _0x346466 = "";
  if (deps.config.useRiskControl) {
    const _0x2c6778 = deps.riskControl.level(_0x57f9bb.userId);
    if (_0x2c6778 === "L0") {
      _0x346466 = "无（正常）";
    } else {
      const _0x5a715a = {
        L1: "L1 冷却",
        L2: "L2 限制",
        L3: "L3 严格限制",
        L4: "L4 异常限制"
      };
      const _0x1a53a8 = deps.riskStore.getExpiresAt(_0x57f9bb.userId);
      _0x346466 = "" + (_0x5a715a[_0x2c6778] || _0x2c6778) + (_0x1a53a8 ? "（至 " + new Date(_0x1a53a8).toLocaleString() + "）" : "");
    }
  }
  if (deps.config.useMd) {
    await deps.Chat.send(_0x57f9bb, "\n<@" + _0x57f9bb.userId + "> 的个人信息面板:\n- 群ID：<qqbot-cmd-input text=\"" + (_0x2a56bb || "无") + "\" show=\"" + (_0x2a56bb || "无") + "\"/>\n- 用户标识ID： <qqbot-cmd-input text=\"" + _0x57f9bb.userId + "\" show=\"" + _0x57f9bb.userId + "\"/>\n- Roblox用户ID： " + (deps.userLocal.userList[_0x57f9bb.userId]?.bindingId ? "<qqbot-cmd-input text=\"/用户ID搜索 " + deps.userLocal.userList[_0x57f9bb.userId]?.bindingId + "\" show=\"" + deps.userLocal.userList[_0x57f9bb.userId]?.bindingId + "\"/>" : "无") + "\n- Roblox用户名： " + (deps.userLocal.userList[_0x57f9bb.userId]?.bindingName ? "<qqbot-cmd-input text=\"/用户名搜索 " + deps.userLocal.userList[_0x57f9bb.userId]?.bindingName + "\" show=\"" + deps.userLocal.userList[_0x57f9bb.userId]?.bindingName + "\"/>" : "无") + "\n- R点数量： ```" + _0x6473f6 + " ``` 点" + (deps.config.useExpSystem ? "\n- 用户等级： **" + _0x102e85 + "**" : "") + (deps.config.useRiskControl ? "\n- 风控限制： " + _0x346466 : "") + "\n- 身份： **" + _0x2fbdcd + "**\n", undefined, deps.kb.myInfo());
  } else {
    const _0x36cb9f = deps.config.useExpSystem ? "\n[用户等级] " + _0x102e85 : "";
    const _0x3deed9 = deps.config.useRiskControl ? "\n[风控限制] " + _0x346466 : "";
    return "获取到结果:\n[群标识ID] " + (_0x2a56bb || "无") + "\n[用户标识ID] " + _0x4593e3 + _0x24d7c8 + _0x268fd8 + _0x3ab801 + _0x36cb9f + _0x3deed9 + ("\n[身份] " + _0x2fbdcd);
  }
});
return {  };
};
