'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/报名推荐社群").action(async ({
  session: _0xs
}) => {
  await _0xs.send("报名推荐社群请填写以下表单：\nhttps://docs.qq.com/form/page/DYUR5VkVwdUp4eVdh");
  return "";
});
return {  };
};
