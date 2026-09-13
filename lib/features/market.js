'use strict';

module.exports = function create(deps) {
var ROLIMONS_URL = "https://api.rolimons.com/items/v1/itemdetails";
var CACHE_TTL_MS = 300000;
var cache = null;
var cachedAt = 0;
var inflight = null;
function parseItems(_0x10d948) {
  const _0x3e988d = new Map();
  if (typeof _0x10d948 !== "object" || _0x10d948 === null) {
    return _0x3e988d;
  }
  const _0xbf4e6d = _0x10d948.items;
  if (typeof _0xbf4e6d !== "object" || _0xbf4e6d === null) {
    return _0x3e988d;
  }
  for (const [_0x58d368, _0x3ed9e8] of Object.entries(_0xbf4e6d)) {
    const _0x1256d3 = Number(_0x58d368);
    if (!Number.isSafeInteger(_0x1256d3) || !Array.isArray(_0x3ed9e8)) {
      continue;
    }
    const _0x310466 = _0x29582b => typeof _0x3ed9e8[_0x29582b] === "number" && Number.isFinite(_0x3ed9e8[_0x29582b]) ? _0x3ed9e8[_0x29582b] : null;
    _0x3e988d.set(_0x1256d3, {
      rap: (_0x310466(2) ?? -1) >= 0 ? _0x310466(2) : null,
      value: (_0x310466(3) ?? -1) >= 0 ? _0x310466(3) : null,
      demand: _0x310466(5) ?? -1,
      trend: _0x310466(6) ?? -1,
      projected: _0x310466(7) ?? -1
    });
  }
  return _0x3e988d;
}
async function getRolimonsMarketData(_0x4703c9) {
  if (cache && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cache;
  }
  if (inflight) {
    return inflight;
  }
  inflight = (async () => {
    try {
      const _0x51b4a9 = await _0x4703c9.http.get(ROLIMONS_URL, {
        responseType: "json",
        timeout: 15000
      });
      const _0x1c4760 = parseItems(_0x51b4a9);
      if (_0x1c4760.size > 0) {
        cache = _0x1c4760;
        cachedAt = Date.now();
      }
      return _0x1c4760;
    } catch (_0x33d3be) {
      _0x4703c9.logger("roblox-rolimons").warn("Rolimons 数据拉取失败，静默降级：%s", String(_0x33d3be));
      return cache ?? new Map();
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
function demandLabel(_0x379fb2) {
  switch (_0x379fb2) {
    case 4:
      return "⭐⭐⭐⭐⭐ 极高";
    case 3:
      return "⭐⭐⭐⭐ 高";
    case 2:
      return "⭐⭐⭐ 中";
    case 1:
      return "⭐⭐ 低";
    case 0:
      return "⭐ 极低";
    default:
      return "";
  }
}
function trendLabel(_0x4cc0ea) {
  switch (_0x4cc0ea) {
    case 2:
      return "📈 上涨";
    case 1:
      return "📊 持平";
    case 0:
      return "📉 下跌";
    default:
      return "";
  }
}
function demandTextLabel(_0x45d0e9) {
  switch (_0x45d0e9) {
    case 4:
      return "极高";
    case 3:
      return "高";
    case 2:
      return "中";
    case 1:
      return "低";
    case 0:
      return "极低";
    default:
      return "";
  }
}
function trendTextLabel(_0x4ff59d) {
  switch (_0x4ff59d) {
    case 2:
      return "上涨";
    case 1:
      return "持平";
    case 0:
      return "下跌";
    default:
      return "";
  }
}
return { get ROLIMONS_URL() { return ROLIMONS_URL; }, set ROLIMONS_URL(value) { ROLIMONS_URL = value; },
get CACHE_TTL_MS() { return CACHE_TTL_MS; }, set CACHE_TTL_MS(value) { CACHE_TTL_MS = value; },
get cache() { return cache; }, set cache(value) { cache = value; },
get cachedAt() { return cachedAt; }, set cachedAt(value) { cachedAt = value; },
get inflight() { return inflight; }, set inflight(value) { inflight = value; },
get parseItems() { return parseItems; },
get getRolimonsMarketData() { return getRolimonsMarketData; },
get demandLabel() { return demandLabel; },
get trendLabel() { return trendLabel; },
get demandTextLabel() { return demandTextLabel; },
get trendTextLabel() { return trendTextLabel; } };
};
