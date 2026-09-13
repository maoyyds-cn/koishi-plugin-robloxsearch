'use strict';

module.exports = function create(deps) {
function renderServerResultsMarkdown(_0x46b553, _0x256e0d = {}) {
  const _0x5cc460 = deps.normalizePageSize(_0x256e0d.pageSize);
  const _0x1d68a5 = _0x46b553.slice(0, _0x5cc460);
  const _0x5e5a90 = _0x256e0d.callerId ? deps.callerLine(_0x256e0d.callerId) + "\n" : "## 🖥️ Roblox 公开服务器\n\n";
  const _0x3239a2 = _0x1d68a5.map((_0xb6878b, _0x487395) => "**" + (_0x487395 + 1) + ".** 🖥️ 服务器 `" + deps.escapeMarkdownCode(_0xb6878b.id) + "`\n- 👥 人数：**" + deps.formatInteger(_0xb6878b.playing) + "/" + deps.formatInteger(_0xb6878b.maxPlayers) + "** · 🪑 空位：**" + deps.formatInteger(_0xb6878b.freeSlots) + "**\n- ⚡ FPS：" + deps.formatDecimal(_0xb6878b.fps, 1) + " · 📶 Ping：" + (_0xb6878b.ping == null ? deps.formatMissing() : deps.formatDecimal(_0xb6878b.ping, 0) + " ms") + "\n\n");
  const _0x560c00 = deps.paginationMarkdown("服务器搜索", {
    ..._0x256e0d,
    pageSize: _0x5cc460
  });
  return deps.fitResultSections(_0x5e5a90, _0x3239a2, _0x560c00, deps.MARKDOWN_LIMIT);
}
function renderServerResultsText(_0x50ddf5, _0x3a5f19 = {}) {
  const _0x44b833 = deps.normalizePageSize(_0x3a5f19.pageSize);
  const _0x1efc5c = _0x50ddf5.slice(0, _0x44b833);
  const _0x3c317e = "🖥️ Roblox 公开服务器\n";
  const _0x3291a3 = _0x1efc5c.map((_0x36bd3d, _0x3f4cdf) => "\n" + (_0x3f4cdf + 1) + ". 服务器 " + _0x36bd3d.id + "\n人数 " + deps.formatInteger(_0x36bd3d.playing) + "/" + deps.formatInteger(_0x36bd3d.maxPlayers) + "，空位 " + deps.formatInteger(_0x36bd3d.freeSlots) + "\nFPS " + deps.formatDecimal(_0x36bd3d.fps, 1) + "，Ping " + (_0x36bd3d.ping == null ? deps.formatMissing() : deps.formatDecimal(_0x36bd3d.ping, 0) + " ms") + "\n");
  const _0x344ca4 = deps.paginationText("服务器搜索", {
    ..._0x3a5f19,
    pageSize: _0x44b833
  });
  return deps.fitResultSections(_0x3c317e, _0x3291a3, _0x344ca4, deps.TEXT_LIMIT);
}
return { get renderServerResultsMarkdown() { return renderServerResultsMarkdown; },
get renderServerResultsText() { return renderServerResultsText; } };
};
