'use strict';

module.exports = function create(deps) {
var MARKDOWN_LIMIT = 3500;
var TEXT_LIMIT = 4000;
var DEFAULT_PAGE_SIZE = 5;
var MAX_PAGE_SIZE = 10;
function escapeMarkdownText(_0x152ec9) {
  return _0x152ec9.replace(/\\/g, "\\\\").replace(/[<]/g, "＜").replace(/[>]/g, "＞").replace(/([`*_{}\[\]()#+\-.!|])/g, "\\$1");
}
function escapeMarkdownCode(_0x9d5f27) {
  return _0x9d5f27.replace(/\\/g, "\\\\").replace(/`/g, "ˋ").replace(/[<]/g, "＜").replace(/[>]/g, "＞");
}
function escapeCommandAttribute(_0x52aa5a) {
  return _0x52aa5a.replace(/[\r\n\t]+/g, " ").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function formatInteger(_0x778fe1) {
  if (_0x778fe1 == null || !Number.isFinite(_0x778fe1)) {
    return formatMissing(_0x778fe1);
  }
  return Math.trunc(_0x778fe1).toLocaleString("zh-CN");
}
function formatDecimal(_0x5199fa, _0x2b07ca) {
  if (_0x5199fa == null || !Number.isFinite(_0x5199fa)) {
    return formatMissing(_0x5199fa);
  }
  return _0x5199fa.toFixed(Math.max(0, Math.min(6, _0x2b07ca)));
}
function formatRobux(_0x46760c) {
  if (_0x46760c == null || !Number.isFinite(_0x46760c)) {
    return formatMissing(_0x46760c);
  }
  return "R " + formatInteger(_0x46760c);
}
function formatRobuxMarkdown(_0x53121e) {
  if (_0x53121e == null || !Number.isFinite(_0x53121e)) {
    return formatMissing(_0x53121e);
  }
  return "R ```" + formatInteger(_0x53121e) + "```";
}
function formatRobuxBold(_0x305e25) {
  if (_0x305e25 == null || !Number.isFinite(_0x305e25)) {
    return formatMissing(_0x305e25);
  }
  return "R **" + formatInteger(_0x305e25) + "** ";
}
function callerLine(_0x3c1ec0) {
  if (!_0x3c1ec0) {
    return "";
  }
  const _0x33e5a5 = escapeCommandAttribute(_0x3c1ec0);
  return "![img #23px #23px](https://q.qlogo.cn/qqapp/102801826/" + _0x33e5a5 + "/100) <@" + _0x33e5a5 + ">";
}
function formatMissing(_0x4aad03) {
  return "暂无";
}
function truncateText(_0x10c64b, _0x4150a9) {
  if (_0x4150a9 <= 0) {
    return "";
  }
  const _0x1d8d6d = _0x10c64b.replace(/\s+/g, " ").trim();
  if (_0x1d8d6d.length <= _0x4150a9) {
    return _0x1d8d6d;
  }
  if (_0x4150a9 === 1) {
    return "…";
  } else {
    return _0x1d8d6d.slice(0, _0x4150a9 - 1) + "…";
  }
}
function escapePlainText(_0x53d246) {
  return _0x53d246.replace(/[<]/g, "＜").replace(/[>]/g, "＞").replace(/[\r\n\t]+/g, " ");
}
function normalizePageSize(_0x25b9fa) {
  if (!Number.isFinite(_0x25b9fa)) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.max(1, Math.min(MAX_PAGE_SIZE, Math.trunc(_0x25b9fa)));
}
function fitResultSections(_0x3916fd, _0x49c982, _0x2d4624, _0x4399f9) {
  let _0x44ae55 = _0x3916fd;
  for (const _0x1c495a of _0x49c982) {
    const _0x220f82 = "" + _0x44ae55 + _0x1c495a + _0x2d4624;
    if (_0x220f82.length > _0x4399f9) {
      break;
    }
    _0x44ae55 += _0x1c495a;
  }
  if (_0x44ae55 === _0x3916fd && _0x49c982.length) {
    _0x44ae55 += truncateText(_0x49c982[0], Math.max(0, _0x4399f9 - _0x3916fd.length - _0x2d4624.length));
  }
  return ("" + _0x44ae55 + _0x2d4624).slice(0, _0x4399f9);
}
function paginationMarkdown(_0x148ee0, _0x35850a) {
  const _0x1f920d = Math.max(1, _0x35850a.currentPage || 1);
  const _0x550e7e = Math.max(0, _0x35850a.total || 0);
  const _0x2d9950 = normalizePageSize(_0x35850a.pageSize);
  const _0x20a210 = Math.max(1, Math.ceil(_0x550e7e / _0x2d9950));
  const _0x18bb93 = ["\n---\n第 " + _0x1f920d + "/" + _0x20a210 + " 页，共 " + formatInteger(_0x550e7e) + " 条"];
  if (_0x35850a.auditNotice) {
    _0x18bb93.push("部分文本已拦截并提交人工审核");
  }
  if (_0x35850a.token && _0x35850a.hasPrevious) {
    const _0x4f2e = "/" + _0x148ee0 + "上一页 " + _0x35850a.token;
    _0x18bb93.push("<qqbot-cmd-input text=\"" + escapeCommandAttribute(_0x4f2e) + "\" show=\"上一页\"/>");
  }
  if (_0x35850a.token && _0x35850a.hasNext) {
    const _0x19719a = "/" + _0x148ee0 + "下一页 " + _0x35850a.token;
    _0x18bb93.push("<qqbot-cmd-input text=\"" + escapeCommandAttribute(_0x19719a) + "\" show=\"下一页\"/>");
  }
  if (_0x148ee0 !== "物品搜索") {
    return _0x18bb93.join("  ") + "\n";
  }
  let _0x1a15ba = "";
  if (_0x35850a.token && (_0x35850a.hasPrevious || _0x35850a.hasNext)) {
    _0x1a15ba += "\n> 请在`30s`内使用下一页功能";
  }
  if (_0x35850a.callerId) {
    const _0x37f707 = escapeCommandAttribute(_0x35850a.callerId);
    _0x1a15ba += "\n> 调用者：<qqbot-cmd-input text=\"" + _0x37f707 + "\" show=\"" + _0x37f707 + "\"/>";
  }
  if (_0x35850a.marketMode) {
    _0x1a15ba += "\n> 💡 查看某件商品的价格趋势图：<qqbot-cmd-input text=\"/物品趋势 ID --range all\" show=\"/物品趋势 {物品ID} --range 1w|1m|3m|6m|1y|all\"/>";
  }
  return "" + _0x18bb93.join("  ") + _0x1a15ba + "\n";
}
function paginationText(_0x595762, _0x1d28be) {
  const _0x85461c = Math.max(1, _0x1d28be.currentPage || 1);
  const _0x33a67a = Math.max(0, _0x1d28be.total || 0);
  const _0x5c693b = normalizePageSize(_0x1d28be.pageSize);
  const _0x42345a = Math.max(1, Math.ceil(_0x33a67a / _0x5c693b));
  const _0x313c48 = [];
  if (_0x1d28be.token && _0x1d28be.hasPrevious) {
    _0x313c48.push("/" + _0x595762 + "上一页 " + _0x1d28be.token);
  }
  if (_0x1d28be.token && _0x1d28be.hasNext) {
    _0x313c48.push("/" + _0x595762 + "下一页 " + _0x1d28be.token);
  }
  const _0xcbd795 = _0x1d28be.auditNotice ? "\n部分文本已拦截并提交人工审核" : "";
  return "\n第 " + _0x85461c + "/" + _0x42345a + " 页，共 " + formatInteger(_0x33a67a) + " 条" + _0xcbd795 + (_0x313c48.length ? "\n" + _0x313c48.join(" | ") : "") + "\n";
}
return { get MARKDOWN_LIMIT() { return MARKDOWN_LIMIT; }, set MARKDOWN_LIMIT(value) { MARKDOWN_LIMIT = value; },
get TEXT_LIMIT() { return TEXT_LIMIT; }, set TEXT_LIMIT(value) { TEXT_LIMIT = value; },
get DEFAULT_PAGE_SIZE() { return DEFAULT_PAGE_SIZE; }, set DEFAULT_PAGE_SIZE(value) { DEFAULT_PAGE_SIZE = value; },
get MAX_PAGE_SIZE() { return MAX_PAGE_SIZE; }, set MAX_PAGE_SIZE(value) { MAX_PAGE_SIZE = value; },
get escapeMarkdownText() { return escapeMarkdownText; },
get escapeMarkdownCode() { return escapeMarkdownCode; },
get escapeCommandAttribute() { return escapeCommandAttribute; },
get formatInteger() { return formatInteger; },
get formatDecimal() { return formatDecimal; },
get formatRobux() { return formatRobux; },
get formatRobuxMarkdown() { return formatRobuxMarkdown; },
get formatRobuxBold() { return formatRobuxBold; },
get callerLine() { return callerLine; },
get formatMissing() { return formatMissing; },
get truncateText() { return truncateText; },
get escapePlainText() { return escapePlainText; },
get normalizePageSize() { return normalizePageSize; },
get fitResultSections() { return fitResultSections; },
get paginationMarkdown() { return paginationMarkdown; },
get paginationText() { return paginationText; } };
};
