'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/添加兑换码 <giftCode:string> <currency:posint> <total:integer> <validityDay:integer> <note:text>").action(async ({
  session: _0x4ade99
}, _0x1e9090, _0x533dbe, _0x3d87a9, _0x4e202b, _0x3a6dfd) => {
  if (await deps.legacyBan.verify(_0x4ade99)) {
    return;
  }
  if (!(await deps.requirePerm(_0x4ade99, "admin.general", "添加兑换码", "兑换码：" + (_0x1e9090 || "交互输入")))) {
    return;
  }
  await deps.GiftCode.addGiftCode(_0x4ade99, _0x1e9090, _0x533dbe, _0x3d87a9, _0x4e202b, _0x3a6dfd);
  await deps.logOp(_0x4ade99, "添加兑换码", "兑换码：" + (_0x1e9090 || "交互输入") + "，R点：" + (_0x533dbe ?? "-") + "，数量：" + (_0x3d87a9 ?? "-"));
});
return {  };
};
