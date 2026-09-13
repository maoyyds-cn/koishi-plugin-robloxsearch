'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/查看绑定").action(async ({
  session: _0x1b173e
}) => {
  if (await deps.legacyBan.verify(_0x1b173e)) {
    return;
  }
  if (deps.queryLock.isUse(_0x1b173e)) {
    return deps.throttleHint(_0x1b173e);
  }
  if (!deps.userLocal.userList[_0x1b173e.userId]?.bindingId) {
    await deps.sendWithAt(_0x1b173e, "您还没有绑定任何账号，请发送 /绑定Roblox账号 进入绑定环节", "您还没有绑定任何账号，请发送 <qqbot-cmd-input text=\"/绑定Roblox账号\" show=\"绑定账号\"/> 进入绑定环节");
    return;
  }
  return await deps.userQuery.getUserDetailByUserId("" + deps.userLocal.userList[_0x1b173e.userId]?.bindingId, _0x1b173e, _0x3e0ed8 => {
    if (deps.userLocal.userList[_0x1b173e.userId] && _0x3e0ed8.username !== deps.userLocal.userList[_0x1b173e.userId].bindingName) {
      deps.userLocal.userList[_0x1b173e.userId].bindingName = _0x3e0ed8.username;
      deps.userLocal.setLocalStorageData(_0x1b173e.userId);
    }
  });
});
return {  };
};
