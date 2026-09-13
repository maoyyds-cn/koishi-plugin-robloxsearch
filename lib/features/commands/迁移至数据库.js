'use strict';

module.exports = function create(deps) {
deps.ctx.command("迁移至数据库").action(async ({
  session: _0x19c382
}) => {
  if (await deps.legacyBan.verify(_0x19c382)) {
    return;
  }
  if (!(await deps.requirePerm(_0x19c382, "admin.general", "迁移至数据库"))) {
    return;
  }
  if (!deps.config.useDatabase) {
    return deps.sendWithAt(_0x19c382, "请先在插件配置中开启 useDatabase 并重载后再迁移。").then(() => "");
  }
  if (deps._0x4a52b2) {
    return deps.sendWithAt(_0x19c382, "请等待迁移完成！").then(() => "");
  }
  deps._0x4a52b2 = true;
  try {
    await deps.sendWithAt(_0x19c382, "开始迁移数据库（仅补齐缺失记录，不覆盖已有数据）…");
    const _0x4736bd = await deps.migrateAllToDatabase(deps.ctx, deps.config, async (_0x24b3a0, _0xa1d70c) => {
      if (_0xa1d70c.found > 0) {
        await deps.sendWithAt(_0x19c382, _0x24b3a0 + "：发现 " + _0xa1d70c.found + " 条，新增 " + _0xa1d70c.ok + "，跳过 " + _0xa1d70c.skip + "，失败 " + _0xa1d70c.err);
      }
    });
    const _0xc0fcbb = deps.formatMigrationReport(_0x4736bd);
    await deps.logOp(_0x19c382, "迁移至数据库", _0xc0fcbb.split("\n")[0] || "迁移完成");
    await deps.Chat.send(_0x19c382, "<@" + _0x19c382.userId + "> \n" + _0xc0fcbb.replace(/^· /gm, "- ") + "\n> 提示：请重载插件以从数据库加载迁移后的数据。", _0xc0fcbb + "\n\n提示：请重载插件以从数据库加载迁移后的数据。");
  } catch (_0x17aae2) {
    await deps.logOp(_0x19c382, "迁移至数据库", "迁移失败：" + (_0x17aae2 instanceof Error ? _0x17aae2.message : "未知错误"), "failed");
    await deps.sendWithAt(_0x19c382, "迁移失败：" + (_0x17aae2 instanceof Error ? _0x17aae2.message : "未知错误"));
  } finally {
    deps._0x4a52b2 = false;
  }
});
return {  };
};
