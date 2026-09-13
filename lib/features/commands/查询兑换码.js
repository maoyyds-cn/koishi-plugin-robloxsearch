'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/查询兑换码 <giftCode>").action(async ({
  session: _0x28531e
}, _0x55b9dd) => {
  if (await deps.legacyBan.verify(_0x28531e)) {
    return;
  }
  if (!(await deps.requirePerm(_0x28531e, "admin.general", "查询兑换码", "兑换码：" + (_0x55b9dd || "交互输入")))) {
    return;
  }
  await deps.GiftCode.checkGiftCode(_0x28531e, _0x55b9dd?.toUpperCase());
});
return {  };
};
