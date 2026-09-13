'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/兑换码 <giftCode>").action(async ({
  session: _0xe890ec
}, _0x3916bf) => {
  if (await deps.legacyBan.verify(_0xe890ec)) {
    return;
  }
  await deps.GiftCode.getGiftByCode(_0xe890ec, _0x3916bf?.toUpperCase());
});
return {  };
};
