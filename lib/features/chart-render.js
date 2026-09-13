'use strict';

module.exports = function create(deps) {
var CHART_RANGE_LABELS = {
  "1w": "近1周",
  "1m": "近1月",
  "3m": "近3月",
  "6m": "近6月",
  "1y": "近1年",
  all: "全部"
};
function renderChartResultMarkdown(_0x473a48, _0xbbf8d7, _0x4f9570) {
  const _0x1503cb = CHART_RANGE_LABELS[_0x473a48.range];
  const _0x3f1de7 = deps.escapeCommandAttribute(String(_0x473a48.assetId));
  return "## 📈 " + deps.escapeMarkdownText(deps.truncateText(_0x473a48.name, 60)) + " · 价格趋势（" + _0x1503cb + "）\n\n" + (_0xbbf8d7 ? "![img #600px #300px](" + _0xbbf8d7 + ")\n\n" : "") + ("- 🧾 物品 ID：<qqbot-cmd-input text=\"" + _0x3f1de7 + "\" show=\"" + _0x3f1de7 + "\"/>\n- 💰 RAP：" + deps.formatRobuxBold(_0x473a48.rap) + "\n- 💵 原价：" + deps.formatRobuxBold(_0x473a48.originalPrice) + "\n- 📊 " + _0x1503cb + "内：" + deps.formatRobuxBold(_0x473a48.minPrice) + " ~ " + deps.formatRobuxBold(_0x473a48.maxPrice) + "（共 " + deps.formatInteger(_0x473a48.pointCount) + " 笔成交）\n\n> 💡 切换时间范围：`/物品趋势 " + _0x3f1de7 + " --range 1w|1m|3m|6m|1y|all`") + (_0x4f9570 ? "\n> 调用者：<@" + deps.escapeCommandAttribute(_0x4f9570) + ">" : "");
}
function renderChartResultText(_0x387ec8) {
  const _0x3bd4ad = CHART_RANGE_LABELS[_0x387ec8.range];
  return "📈 " + deps.escapePlainText(deps.truncateText(_0x387ec8.name, 60)) + " 价格趋势（" + _0x3bd4ad + "）\n物品 ID " + _0x387ec8.assetId + "\nRAP " + deps.formatRobux(_0x387ec8.rap) + "，原价 " + deps.formatRobux(_0x387ec8.originalPrice) + "\n" + _0x3bd4ad + "内：" + deps.formatRobux(_0x387ec8.minPrice) + " ~ " + deps.formatRobux(_0x387ec8.maxPrice) + "（共 " + deps.formatInteger(_0x387ec8.pointCount) + " 笔成交）\n切换时间范围：/物品趋势 " + _0x387ec8.assetId + " --range 1w|1m|3m|6m|1y|all";
}
return { get CHART_RANGE_LABELS() { return CHART_RANGE_LABELS; }, set CHART_RANGE_LABELS(value) { CHART_RANGE_LABELS = value; },
get renderChartResultMarkdown() { return renderChartResultMarkdown; },
get renderChartResultText() { return renderChartResultText; } };
};
