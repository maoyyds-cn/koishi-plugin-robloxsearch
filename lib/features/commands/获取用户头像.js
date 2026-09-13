'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/获取用户头像 <username>").userFields(["id"]).action(async ({
  session: _0xc6ea61
}, _0x494ea6) => {
  if (await deps.legacyBan.verify(_0xc6ea61)) {
    return;
  }
  if (!_0x494ea6 || !_0x494ea6.trim()) {
    await deps.Chat.send(_0xc6ea61, "<@" + _0xc6ea61.userId + "> 请输入用户名");
    return;
  }
  const _0xcda5fd = {
    imageUrl: "",
    id: ""
  };
  if (deps.queryLock.isUse(_0xc6ea61)) {
    return deps.throttleHint(_0xc6ea61);
  }
  const _0x10b73c = await deps.queryFlow.begin(_0xc6ea61, {
    scope: "query",
    targetType: "user",
    queryText: _0x494ea6
  });
  if (!_0x10b73c.ok) {
    return;
  }
  await deps.sendWithAt(_0xc6ea61, "正在获取用户头像...");
  await deps.userQuery.getUserAvatarByName(_0x494ea6, _0xc6ea61, _0x10d8ca => {
    _0xcda5fd.imageUrl = _0x10d8ca.imageUrl;
    _0xcda5fd.id = _0x10d8ca.targetId;
    deps.queryLock.clearUse(_0xc6ea61);
  });
  if (!_0xcda5fd.imageUrl) {
    await deps.Chat.send(_0xc6ea61, "<@" + _0xc6ea61.userId + "> 获取该用户头像失败");
    return;
  }
  await deps.Chat.send(_0xc6ea61, deps.import_koishi2.h.image(_0xcda5fd.imageUrl) + ("[用户ID] " + _0xcda5fd.id));
});
return {  };
};
