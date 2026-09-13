'use strict';

module.exports = function create(deps) {
var VERIFIED_BADGE = "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)";
function catalogAttributes(_0x96c4c6) {
  const _0x202791 = [];
  if (_0x96c4c6.attributes.legacyLimited) {
    _0x202791.push("Limited");
  }
  if (_0x96c4c6.attributes.collectible) {
    _0x202791.push("Collectible");
  }
  if (_0x96c4c6.attributes.hasResellers) {
    _0x202791.push("可转售");
  }
  if (_0x96c4c6.attributes.offSale) {
    _0x202791.push("已下架");
  }
  if (_0x202791.length) {
    return _0x202791.join(" · ");
  } else {
    return "普通";
  }
}
function thumbnailFragment(_0x7eecfd, _0x4ce863) {
  const _0x46f7a6 = _0x4ce863.thumbnails?.get(_0x7eecfd.id);
  if (_0x46f7a6) {
    return "![img #50px #50px](" + _0x46f7a6 + ") ";
  } else {
    return "";
  }
}
function attributesWithProjected(_0x38fc14, _0x4203ed) {
  return "" + catalogAttributes(_0x38fc14) + (_0x4203ed?.projected === 1 ? " 🔥看涨" : "");
}
function renderItemBasic(_0x5cbd3b, _0x598642, _0x34a2f0) {
  const _0x56fa44 = deps.escapeCommandAttribute(String(_0x5cbd3b.id));
  const _0x110dfa = deps.truncateText(_0x5cbd3b.creator.name || "未知作者", 50);
  return "**" + (_0x598642 + 1) + ".** " + thumbnailFragment(_0x5cbd3b, _0x34a2f0) + "**" + deps.escapeMarkdownText(deps.truncateText(_0x5cbd3b.name, 80) || "****") + "**\n- 🧾 ID：<qqbot-cmd-input text=\"" + _0x56fa44 + "\" show=\"" + _0x56fa44 + "\"/>\n- 类型：" + _0x5cbd3b.itemType + "\n- 类别：" + deps.escapeMarkdownText(deps.truncateText(_0x5cbd3b.categoryLabel, 30) || "未知") + "\n- 👤 作者：" + deps.escapeMarkdownText(_0x110dfa) + (_0x5cbd3b.creator.verified ? "  " + VERIFIED_BADGE : "") + "\n- 💵 当前价：" + deps.formatRobuxMarkdown(_0x5cbd3b.price) + "\n- 最低价：" + deps.formatRobuxMarkdown(_0x5cbd3b.lowestPrice) + "\n- 转售价：" + deps.formatRobuxMarkdown(_0x5cbd3b.lowestResalePrice) + "\n- 库存：```" + deps.formatInteger(_0x5cbd3b.unitsAvailableForConsumption ?? _0x5cbd3b.totalQuantity) + "```\n- 收藏：```" + deps.formatInteger(_0x5cbd3b.favoriteCount) + "```\n- 属性：" + catalogAttributes(_0x5cbd3b) + "\n\n";
}
function renderItemWithMarketData(_0x51ce24, _0x16d162, _0x15382a) {
  const _0x297d20 = deps.escapeCommandAttribute(String(_0x51ce24.id));
  const _0x2815db = deps.truncateText(_0x51ce24.creator.name || "未知作者", 50);
  const _0x4536ce = _0x15382a.market?.get(_0x51ce24.id);
  const _0x458247 = _0x4536ce ? deps.demandLabel(_0x4536ce.demand) : "";
  const _0xd64a9c = _0x4536ce ? deps.trendLabel(_0x4536ce.trend) : "";
  return "**" + (_0x16d162 + 1) + ".** " + thumbnailFragment(_0x51ce24, _0x15382a) + "**" + deps.escapeMarkdownText(deps.truncateText(_0x51ce24.name, 80) || "****") + "**\n- 🧾 ID：<qqbot-cmd-input text=\"" + _0x297d20 + "\" show=\"" + _0x297d20 + "\"/>\n- 类型：" + _0x51ce24.itemType + "\n- 类别：" + deps.escapeMarkdownText(deps.truncateText(_0x51ce24.categoryLabel, 30) || "未知") + "\n- 👤 作者：" + deps.escapeMarkdownText(_0x2815db) + (_0x51ce24.creator.verified ? "  " + VERIFIED_BADGE : "") + "\n" + (_0x4536ce?.rap != null ? "- 💰 RAP：" + deps.formatRobuxMarkdown(_0x4536ce.rap) + "\n" : "") + (_0x458247 ? "- 📊 需求：" + _0x458247 + "\n" : "") + (_0xd64a9c ? "- " + _0xd64a9c + "\n" : "") + ("- 💵 当前价：" + deps.formatRobuxMarkdown(_0x51ce24.price) + "\n- 最低价：" + deps.formatRobuxMarkdown(_0x51ce24.lowestPrice) + "\n- 转售价：" + deps.formatRobuxMarkdown(_0x51ce24.lowestResalePrice) + "\n- 库存：```" + deps.formatInteger(_0x51ce24.unitsAvailableForConsumption ?? _0x51ce24.totalQuantity) + "```\n- 收藏：```" + deps.formatInteger(_0x51ce24.favoriteCount) + "```\n- 属性：" + attributesWithProjected(_0x51ce24, _0x4536ce) + "\n\n");
}
function renderCatalogResultsMarkdown(_0xf5a25b, _0xf1685a = {}) {
  const _0x590b54 = deps.normalizePageSize(_0xf1685a.pageSize);
  const _0x1e742e = _0xf5a25b.slice(0, _0x590b54);
  const _0xd00d4d = deps.escapeMarkdownText(deps.truncateText(_0xf1685a.keyword || "", 40));
  const _0x258d59 = _0xf1685a.marketMode ? "## 🎒 限量物品搜索结果\n\n> 关键词：" + (_0xd00d4d ? _0xd00d4d : "全部") + "\n\n---\n\n" : "## 🎒 物品搜索结果\n\n> 关键词：" + (_0xd00d4d ? _0xd00d4d : "全部") + "\n\n---\n\n";
  const _0x18c090 = _0x1e742e.map((_0x4a8e86, _0x3e9070) => _0xf1685a.marketMode ? renderItemWithMarketData(_0x4a8e86, _0x3e9070, _0xf1685a) : renderItemBasic(_0x4a8e86, _0x3e9070, _0xf1685a));
  const _0x15f6ee = deps.paginationMarkdown("物品搜索", {
    ..._0xf1685a,
    pageSize: _0x590b54
  });
  return deps.fitResultSections(_0x258d59, _0x18c090, _0x15f6ee, deps.MARKDOWN_LIMIT);
}
function renderCatalogResultsText(_0x4abd90, _0x2772b0 = {}) {
  const _0x4e3571 = deps.normalizePageSize(_0x2772b0.pageSize);
  const _0x5de4e1 = _0x4abd90.slice(0, _0x4e3571);
  const _0x415ddb = _0x2772b0.marketMode ? "🎒 Roblox 限量品搜索\n" : "🎒 Roblox 物品搜索\n";
  const _0x20aaf3 = _0x5de4e1.map((_0x11ee41, _0x22e9a7) => {
    const _0x27f0b7 = _0x2772b0.marketMode ? _0x2772b0.market?.get(_0x11ee41.id) : undefined;
    const _0xdef0d3 = [];
    if (_0x27f0b7?.rap != null) {
      _0xdef0d3.push("RAP " + deps.formatRobux(_0x27f0b7.rap));
    }
    if (_0x27f0b7?.value != null) {
      _0xdef0d3.push("估值 " + deps.formatRobux(_0x27f0b7.value));
    }
    const _0x16bd0d = _0x27f0b7 ? deps.demandTextLabel(_0x27f0b7.demand) : "";
    if (_0x16bd0d) {
      _0xdef0d3.push("需求 " + _0x16bd0d);
    }
    const _0x4d2e58 = _0x27f0b7 ? deps.trendTextLabel(_0x27f0b7.trend) : "";
    if (_0x4d2e58) {
      _0xdef0d3.push("趋势 " + _0x4d2e58);
    }
    const _0x23bb35 = _0xdef0d3.length ? "" + _0xdef0d3.join("，") + (_0x27f0b7?.projected === 1 ? "（看涨）" : "") + "\n" : "";
    return "\n" + (_0x22e9a7 + 1) + ". " + (deps.escapePlainText(deps.truncateText(_0x11ee41.name, 80)) || "****") + "\n商品 ID " + _0x11ee41.id + "，类型 " + _0x11ee41.itemType + "，类别 " + (deps.escapePlainText(deps.truncateText(_0x11ee41.categoryLabel, 30)) || "未知") + "\n作者 " + deps.escapePlainText(deps.truncateText(_0x11ee41.creator.name || "未知作者", 50)) + (_0x11ee41.creator.verified ? "（已认证）" : "") + "\n" + _0x23bb35 + ("当前价 " + deps.formatRobux(_0x11ee41.price) + "，最低价 " + deps.formatRobux(_0x11ee41.lowestPrice) + "，最低转售价 " + deps.formatRobux(_0x11ee41.lowestResalePrice) + "\n库存 " + deps.formatInteger(_0x11ee41.unitsAvailableForConsumption ?? _0x11ee41.totalQuantity) + "，收藏 " + deps.formatInteger(_0x11ee41.favoriteCount) + "，属性 " + catalogAttributes(_0x11ee41) + "\n");
  });
  const _0x49b719 = _0x2772b0.marketMode && _0x2772b0.marketAvailable ? " · 数据来源：Rolimons" : "";
  const _0xbc552e = deps.paginationText("物品搜索", {
    ..._0x2772b0,
    pageSize: _0x4e3571
  }).replace(/条/, "条" + _0x49b719);
  return deps.fitResultSections(_0x415ddb, _0x20aaf3, _0xbc552e, deps.TEXT_LIMIT);
}
return { get VERIFIED_BADGE() { return VERIFIED_BADGE; }, set VERIFIED_BADGE(value) { VERIFIED_BADGE = value; },
get catalogAttributes() { return catalogAttributes; },
get thumbnailFragment() { return thumbnailFragment; },
get attributesWithProjected() { return attributesWithProjected; },
get renderItemBasic() { return renderItemBasic; },
get renderItemWithMarketData() { return renderItemWithMarketData; },
get renderCatalogResultsMarkdown() { return renderCatalogResultsMarkdown; },
get renderCatalogResultsText() { return renderCatalogResultsText; } };
};
