'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/获取群组图标 <groupName>").userFields(["id"]).action(async ({
  session: _0x4161fe
}, _0x18a786) => {
  if (await deps.legacyBan.verify(_0x4161fe)) {
    return;
  }
  if (!_0x18a786 || !_0x18a786.trim()) {
    await deps.Chat.send(_0x4161fe, "<@" + _0x4161fe.userId + "> 请输入群组名字");
    return;
  }
  if (deps.queryLock.isUse(_0x4161fe)) {
    return deps.throttleHint(_0x4161fe);
  }
  const _0x207f80 = await deps.queryFlow.begin(_0x4161fe, {
    scope: "query",
    targetType: "group",
    queryText: _0x18a786
  });
  if (!_0x207f80.ok) {
    return;
  }
  await deps.sendWithAt(_0x4161fe, "正在获取群组图标...");
  const _0x23812a = {
    id: "",
    name: "",
    avatar: ""
  };
  await deps.groupQuery.getGroupAvatarByName(_0x18a786, _0x4161fe, _0xa655a9 => {
    _0x23812a.id = _0xa655a9.data.groupId;
    _0x23812a.name = _0xa655a9.data.groupName;
    _0x23812a.avatar = _0xa655a9.data.thumbnailUrl;
    deps.queryLock.clearUse(_0x4161fe);
  });
  if (!_0x23812a.avatar) {
    await deps.Chat.send(_0x4161fe, "<@" + _0x4161fe.userId + "> 获取该群组图标失败");
    return;
  }
  await deps.Chat.send(_0x4161fe, deps.import_koishi2.h.image(_0x23812a.avatar) + ("[群组ID] " + _0x23812a.id + "\n[群组名称] " + _0x23812a.name));
});
return {  };
};
