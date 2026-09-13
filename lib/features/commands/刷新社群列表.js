'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/刷新社群列表").action(async ({
  session: _0xs
}) => {
  await deps._0xcommLoad();
  deps._0xcommRegister();
  await _0xs.send("已刷新社群列表，共 " + deps._0xCOMM_DATA.length + " 个社群");
  return "";
});
return {  };
};
