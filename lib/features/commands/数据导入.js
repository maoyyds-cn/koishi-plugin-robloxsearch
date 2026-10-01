'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/数据导入 [file]").option("overwrite", "--overwrite 按主键覆盖已有数据（默认只补齐缺失记录）").option("allow-admin", "--allow-admin 允许一并导入备份中的子管理员名单（高危，默认拒绝）").action(async ({
  session: _0xb7cedb,
  options: _0x54f4a6
}, _0x175972) => {
  if (await deps.legacyBan.verify(_0xb7cedb)) {
    return;
  }
  if (!(await deps.requirePerm(_0xb7cedb, "admin.general", "数据导入", "文件：" + (_0x175972 || "列表查看")))) {
    return;
  }
  const _0x587179 = await deps.listBackups();
  if (!_0x175972) {
    if (!_0x587179.length) {
      return deps.sendWithAt(_0xb7cedb, "备份目录为空，请先执行 数据导出。").then(() => "");
    }
    const _0x181b43 = _0x587179.map((_0x3c1ef4, _0x851536) => _0x851536 + 1 + ". " + _0x3c1ef4.fileName + "（" + deps.formatSize(_0x3c1ef4.size) + "，" + new Date(_0x3c1ef4.mtime).toLocaleString() + "）");
    return deps.sendWithAt(_0xb7cedb, "可导入的备份文件：\n" + _0x181b43.join("\n") + "\n\n用 数据导入 <文件名|序号> 执行导入").then(() => "");
  }
  const _0x35a360 = Number(_0x175972);
  const _0x5989f7 = Number.isInteger(_0x35a360) && _0x35a360 >= 1 && _0x35a360 <= _0x587179.length ? _0x587179[_0x35a360 - 1] : _0x587179.find(_0x3c7045 => _0x3c7045.fileName === _0x175972);
  if (!_0x5989f7) {
    return deps.sendWithAt(_0xb7cedb, "未找到备份文件「" + _0x175972 + "」，请先用 数据导入 查看列表。").then(() => "");
  }
  if (deps._0x11d2aa) {
    return deps.sendWithAt(_0xb7cedb, "请等待当前数据操作完成！").then(() => "");
  }
  deps._0x11d2aa = true;
  try {
    const _0x1e0acb = await deps.loadBackupFile(_0x5989f7.filePath);
    const _0x148b7a = !!_0x54f4a6.overwrite;
    const _0x2ba7e5 = Array.isArray(_0x1e0acb.data?.adminList) ? _0x1e0acb.data.adminList : [];
    const _0x4d0a5b = !!_0x54f4a6["allow-admin"] && _0x54f4a6["allow-admin"] !== false;
    await deps.sendWithAt(_0xb7cedb, "校验通过：" + _0x5989f7.fileName + "\n导出时间：" + new Date(_0x1e0acb.meta.exportedAt).toLocaleString() + "\n" + deps.formatPreview(_0x1e0acb.meta.counts, _0x1e0acb.meta.useDatabase) + "\n\n模式：" + (_0x148b7a ? "覆盖已有数据" : "只补齐缺失记录（不覆盖）") + "\n回复「确认导入」执行，其他内容取消。");
    const _0x3166ab = await _0xb7cedb.prompt(60000);
    if (_0x3166ab !== "确认导入") {
      await deps.sendWithAt(_0xb7cedb, "已取消导入。");
      return;
    }
    if (_0x2ba7e5.length && !_0x4d0a5b) {
      await deps.sendWithAt(_0xb7cedb, "⚠ 该备份包含 " + _0x2ba7e5.length + " 条子管理员记录。\n出于安全考虑，默认不会导入管理员名单。\n如确需导入，请重新执行并加上 --allow-admin 参数。");
      return;
    }
    if (_0x2ba7e5.length && _0x4d0a5b) {
      await deps.sendWithAt(_0xb7cedb, "⚠ 你已指定 --allow-admin，将导入以下子管理员：\n" + _0x2ba7e5.map(_0x4a3d3b => "· " + _0x4a3d3b).join("\n") + "\n\n请再次回复「确认导入管理员」以继续。");
      const _0x53dc31 = await _0xb7cedb.prompt(60000);
      if (_0x53dc31 !== "确认导入管理员") {
        await deps.sendWithAt(_0xb7cedb, "已取消导入。");
        return;
      }
    }
    await deps.sendWithAt(_0xb7cedb, "正在对当前数据做导入前快照…");
    const _0x31a251 = await deps.exportBackup(deps.ctx, deps.config, "pre-import");
    await deps.sendWithAt(_0xb7cedb, "快照完成：" + _0x31a251.fileName + "，开始导入…");
    const _0x4ba04b = await deps.importBackup(deps.ctx, deps.config, _0x1e0acb, _0x148b7a, async (_0x4effbf, _0x516119) => {
      if (_0x516119.found > 0) {
        await deps.sendWithAt(_0xb7cedb, _0x4effbf + "：备份 " + _0x516119.found + " 条，新增 " + _0x516119.ok + "，跳过/覆盖 " + _0x516119.skip + "，失败 " + _0x516119.err);
      }
    }, _0x4d0a5b);
    const _0x20c8d6 = deps.formatBackupReport(_0x4ba04b, _0x148b7a);
    await deps.logOp(_0xb7cedb, "数据导入", "文件：" + _0x5989f7.fileName + "，模式：" + (_0x148b7a ? "覆盖" : "补齐") + "，管理员名单：" + (_0x4d0a5b ? "允许导入" : "拒绝导入"));
    await deps.Chat.send(_0xb7cedb, "<@" + _0xb7cedb.userId + "> \n" + _0x20c8d6.replace(/^· /gm, "- "), _0x20c8d6);
  } catch (_0x37df32) {
    await deps.logOp(_0xb7cedb, "数据导入", "导入失败：" + (_0x37df32 instanceof Error ? _0x37df32.message : "未知错误"), "failed");
    await deps.sendWithAt(_0xb7cedb, "导入失败：" + (_0x37df32 instanceof Error ? _0x37df32.message : "未知错误"));
  } finally {
    deps._0x11d2aa = false;
  }
});
return {  };
};
