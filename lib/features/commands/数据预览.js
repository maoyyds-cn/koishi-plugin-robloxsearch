'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/数据预览").action(async ({
  session: _0x464c7a
}) => {
  if (await deps.legacyBan.verify(_0x464c7a)) {
    return;
  }
  if (!(await deps.requirePerm(_0x464c7a, "admin.general", "数据预览"))) {
    return;
  }
  try {
    const _0x4c06d5 = await deps.collectBackup(deps.ctx, deps.config);
    const _0x2f42c3 = await deps.listBackups();
    const _0x3f448b = _0x2f42c3.length ? _0x2f42c3.map((_0x4baab6, _0x4fd21a) => _0x4fd21a + 1 + ". " + _0x4baab6.fileName + "（" + deps.formatSize(_0x4baab6.size) + "）") : ["（暂无备份文件）"];
    const _0x124451 = [deps.formatPreview(_0x4c06d5.meta.counts, deps.config.useDatabase), "", "备份文件列表：", ..._0x3f448b].join("\n");
    await deps.Chat.send(_0x464c7a, "<@" + _0x464c7a.userId + "> \n" + _0x124451.replace(/^· /gm, "- "), _0x124451);
  } catch (_0x1f5d6f) {
    await deps.sendWithAt(_0x464c7a, "数据预览失败：" + (_0x1f5d6f instanceof Error ? _0x1f5d6f.message : "未知错误"));
  }
});
return {  };
};
