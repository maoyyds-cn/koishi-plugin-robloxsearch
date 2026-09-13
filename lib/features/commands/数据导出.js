'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/数据导出").action(async ({
  session: _0x30702c
}) => {
  if (await deps.legacyBan.verify(_0x30702c)) {
    return;
  }
  if (!(await deps.requirePerm(_0x30702c, "admin.general", "数据导出"))) {
    return;
  }
  if (deps._0x11d2aa) {
    return deps.sendWithAt(_0x30702c, "请等待当前数据操作完成！").then(() => "");
  }
  deps._0x11d2aa = true;
  try {
    const _0x3c89c8 = await deps.collectBackup(deps.ctx, deps.config);
    await deps.sendWithAt(_0x30702c, "导出预览：\n" + deps.formatPreview(_0x3c89c8.meta.counts, deps.config.useDatabase) + "\n开始写入备份文件…");
    const _0x2df69a = await deps.exportBackup(deps.ctx, deps.config);
    const _0x1bdded = Object.values(_0x2df69a.counts).reduce((_0x34ef25, _0x9aba0c) => _0x34ef25 + _0x9aba0c, 0);
    await deps.logOp(_0x30702c, "数据导出", "文件：" + _0x2df69a.fileName + "，共 " + _0x1bdded + " 条记录");
    await deps.sendWithAt(_0x30702c, "导出成功：" + _0x2df69a.fileName + "（" + deps.formatSize(_0x2df69a.size) + "，共 " + _0x1bdded + " 条记录）\n路径：data/backup/");
  } catch (_0x53d2a0) {
    await deps.logOp(_0x30702c, "数据导出", "导出失败：" + (_0x53d2a0 instanceof Error ? _0x53d2a0.message : "未知错误"), "failed");
    await deps.sendWithAt(_0x30702c, "导出失败：" + (_0x53d2a0 instanceof Error ? _0x53d2a0.message : "未知错误"));
  } finally {
    deps._0x11d2aa = false;
  }
});
return {  };
};
