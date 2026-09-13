'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/积分排行榜").action(async ({
  session: _0x8afdc2
}) => {
  if (await deps.legacyBan.verify(_0x8afdc2)) {
    return;
  }
  await deps.userLocal.monetaryChartsList(_0x8afdc2);
});
return {  };
};
