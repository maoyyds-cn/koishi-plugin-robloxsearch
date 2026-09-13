'use strict';

module.exports = function create(deps) {
const _0x42f0a9 = ["1w", "1m", "3m", "6m", "1y", "all"];
const _0x4321e8 = 3;
const searchSessions = new deps.SearchSessionStore();
function appendSearchParam(_0x4b66eb, _0x1dfc95, _0x1f6880) {
  if (_0x1f6880 === undefined || _0x1f6880 === null || _0x1f6880 === "") {
    return;
  }
  _0x4b66eb.set(_0x1dfc95, String(_0x1f6880));
}
function isSearchFailure(_0x4e788d) {
  if (!_0x4e788d || typeof _0x4e788d !== "object") {
    return false;
  }
  const _0x1d56de = _0x4e788d;
  return _0x1d56de.success === false && typeof _0x1d56de.message === "string";
}
function isRecord(_0xe6fb16) {
  return !!_0xe6fb16 && typeof _0xe6fb16 === "object" && !Array.isArray(_0xe6fb16);
}
function isNullableNumber(_0x53ffef) {
  return _0x53ffef === null || typeof _0x53ffef === "number" && Number.isFinite(_0x53ffef);
}
function isGameServerDto(_0x32a87e) {
  if (!isRecord(_0x32a87e)) {
    return false;
  }
  return typeof _0x32a87e.id === "string" && /^[A-Za-z0-9-]{1,100}$/.test(_0x32a87e.id) && Number.isInteger(_0x32a87e.playing) && Number(_0x32a87e.playing) >= 0 && Number.isInteger(_0x32a87e.maxPlayers) && Number(_0x32a87e.maxPlayers) >= 0 && Number.isInteger(_0x32a87e.freeSlots) && Number(_0x32a87e.freeSlots) >= 0 && isNullableNumber(_0x32a87e.fps) && isNullableNumber(_0x32a87e.ping);
}
function isCatalogItemDto(_0x2145ba) {
  if (!isRecord(_0x2145ba) || !isRecord(_0x2145ba.creator) || !isRecord(_0x2145ba.attributes) || !isRecord(_0x2145ba.match)) {
    return false;
  }
  const _0x4f72f4 = _0x2145ba.itemType;
  const _0x1470fd = _0x2145ba.creator.type;
  const _0x2bbe70 = _0x2145ba.match.name;
  return Number.isSafeInteger(_0x2145ba.id) && (_0x4f72f4 === "Asset" || _0x4f72f4 === "Bundle") && isNullableNumber(_0x2145ba.assetType) && isNullableNumber(_0x2145ba.bundleType) && typeof _0x2145ba.categoryKey === "string" && typeof _0x2145ba.categoryLabel === "string" && typeof _0x2145ba.name === "string" && typeof _0x2145ba.description === "string" && (_0x1470fd === "User" || _0x1470fd === "Group" || _0x1470fd === "Unknown") && isNullableNumber(_0x2145ba.creator.targetId) && typeof _0x2145ba.creator.name === "string" && typeof _0x2145ba.creator.verified === "boolean" && isNullableNumber(_0x2145ba.price) && isNullableNumber(_0x2145ba.lowestPrice) && isNullableNumber(_0x2145ba.lowestResalePrice) && isNullableNumber(_0x2145ba.totalQuantity) && isNullableNumber(_0x2145ba.unitsAvailableForConsumption) && isNullableNumber(_0x2145ba.favoriteCount) && (_0x2145ba.collectibleItemId === null || typeof _0x2145ba.collectibleItemId === "string") && (_0x2145ba.saleLocationType === null || typeof _0x2145ba.saleLocationType === "string") && typeof _0x2145ba.attributes.legacyLimited === "boolean" && typeof _0x2145ba.attributes.collectible === "boolean" && typeof _0x2145ba.attributes.hasResellers === "boolean" && typeof _0x2145ba.attributes.offSale === "boolean" && typeof _0x2145ba.attributes.recolorable === "boolean" && typeof _0x2145ba.attributes.supportsHeadShapes === "boolean" && ["exact", "token", "prefix", "contains", "none"].includes(String(_0x2bbe70)) && typeof _0x2145ba.match.score === "number" && Number.isFinite(_0x2145ba.match.score);
}
function isItemChartDto(_0x1069d1) {
  if (!isRecord(_0x1069d1)) {
    return false;
  }
  return Number.isSafeInteger(_0x1069d1.assetId) && typeof _0x1069d1.name === "string" && isNullableNumber(_0x1069d1.rap) && isNullableNumber(_0x1069d1.originalPrice) && ["1w", "1m", "3m", "6m", "1y", "all"].includes(String(_0x1069d1.range)) && Number.isSafeInteger(_0x1069d1.pointCount) && isNullableNumber(_0x1069d1.minPrice) && isNullableNumber(_0x1069d1.maxPrice) && typeof _0x1069d1.imageBase64 === "string" && /^[A-Za-z0-9+/=]+$/.test(_0x1069d1.imageBase64);
}
function searchFailureFromError(_0x23d7bc) {
  if (isSearchFailure(_0x23d7bc)) {
    return _0x23d7bc;
  }
  if (!_0x23d7bc || typeof _0x23d7bc !== "object") {
    return null;
  }
  const _0x646038 = _0x23d7bc.response;
  if (isSearchFailure(_0x646038?.data)) {
    return _0x646038.data;
  } else {
    return null;
  }
}
function searchFailureMessage(_0x537064, _0x115161) {
  const _0x16b96c = searchFailureFromError(_0x537064);
  if (!_0x16b96c) {
    return _0x115161;
  }
  switch (_0x16b96c.code) {
    case "INVALID_ARGUMENT":
    case "INVALID_PLACE":
    case "INVALID_FILTER_COMBINATION":
      return _0x16b96c.message;
    case "SEARCH_CURSOR_INVALID":
    case "SEARCH_CURSOR_EXPIRED":
      return "分页已失效，请重新执行搜索。";
    case "UPSTREAM_UNAUTHORIZED":
      return "Roblox 搜索服务鉴权失败，请联系管理员检查后端配置。";
    case "UPSTREAM_RATE_LIMITED":
      return "Roblox 搜索请求过于频繁，请稍后重试" + (_0x16b96c.retryAfterSeconds ? "（约 " + _0x16b96c.retryAfterSeconds + " 秒）" : "") + "。";
    case "UPSTREAM_TIMEOUT":
      return "Roblox 搜索响应超时，本次不计费，请稍后重试。";
    case "UPSTREAM_UNAVAILABLE":
      return "Roblox 搜索服务暂时不可用，本次不计费，请稍后重试。";
    case "UPSTREAM_RESPONSE_INVALID":
      return "Roblox 返回的数据格式异常，本次不计费，请稍后重试。";
    case "AUDIT_UNAVAILABLE":
      return "内容审核服务暂时不可用，商品文本已停止展示。";
    default:
      return _0x115161;
  }
}
async function getSearchPage(_0x60c059, _0x4bbbcb) {
  const _0x18c587 = deps.config.bffAccessToken?.trim();
  const _0x380fae = await deps.robloxApi.get(_0x60c059, _0x18c587 ? {
    headers: {
      "x-bff-token": _0x18c587
    }
  } : undefined);
  if (isSearchFailure(_0x380fae)) {
    throw _0x380fae;
  }
  if (!isRecord(_0x380fae) || _0x380fae.success !== true || !isRecord(_0x380fae.data)) {
    throw {
      success: false,
      code: "UPSTREAM_RESPONSE_INVALID",
      message: "BFF 搜索响应格式异常"
    };
  }
  const _0x4fcaea = _0x380fae.data;
  if (!Array.isArray(_0x4fcaea.data) || !_0x4fcaea.data.every(_0x4bbbcb) || _0x4fcaea.nextPageCursor !== null && typeof _0x4fcaea.nextPageCursor !== "string" || _0x4fcaea.previousPageCursor !== null && typeof _0x4fcaea.previousPageCursor !== "string" || !Number.isSafeInteger(_0x4fcaea.matchedCount) || !Number.isSafeInteger(_0x4fcaea.scannedCount) || _0x4fcaea.sortScope !== "snapshot") {
    throw {
      success: false,
      code: "UPSTREAM_RESPONSE_INVALID",
      message: "BFF 搜索数据格式异常"
    };
  }
  return _0x4fcaea;
}
function serverSearchPath(_0x59227e, _0x51039f) {
  const _0x581f9d = new URLSearchParams();
  appendSearchParam(_0x581f9d, "onlyAvailable", _0x51039f.onlyAvailable);
  appendSearchParam(_0x581f9d, "minFree", _0x51039f.minFree);
  appendSearchParam(_0x581f9d, "minPlaying", _0x51039f.minPlaying);
  appendSearchParam(_0x581f9d, "maxPlaying", _0x51039f.maxPlaying);
  appendSearchParam(_0x581f9d, "minFps", _0x51039f.minFps);
  appendSearchParam(_0x581f9d, "maxPing", _0x51039f.maxPing);
  appendSearchParam(_0x581f9d, "sortBy", _0x51039f.sortBy);
  appendSearchParam(_0x581f9d, "sortOrder", _0x51039f.sortOrder);
  appendSearchParam(_0x581f9d, "limit", _0x51039f.limit || 5);
  return "/search-game-servers/" + _0x59227e + "?" + _0x581f9d.toString();
}
function catalogSearchPath(_0x4e629f, _0x4d3d0b) {
  const _0x36ba7f = new URLSearchParams();
  appendSearchParam(_0x36ba7f, "keyword", _0x4e629f?.trim());
  appendSearchParam(_0x36ba7f, "itemType", _0x4d3d0b.itemType);
  appendSearchParam(_0x36ba7f, "assetTypeIds", _0x4d3d0b.assetTypeIds);
  appendSearchParam(_0x36ba7f, "bundleTypeIds", _0x4d3d0b.bundleTypeIds);
  appendSearchParam(_0x36ba7f, "category", _0x4d3d0b.category);
  appendSearchParam(_0x36ba7f, "creatorType", _0x4d3d0b.creatorType);
  appendSearchParam(_0x36ba7f, "creatorId", _0x4d3d0b.creatorId);
  appendSearchParam(_0x36ba7f, "creatorName", _0x4d3d0b.creatorName);
  appendSearchParam(_0x36ba7f, "minPrice", _0x4d3d0b.minPrice);
  appendSearchParam(_0x36ba7f, "maxPrice", _0x4d3d0b.maxPrice);
  appendSearchParam(_0x36ba7f, "includeOffsale", _0x4d3d0b.includeOffsale);
  appendSearchParam(_0x36ba7f, "limited", _0x4d3d0b.limited);
  appendSearchParam(_0x36ba7f, "hasResellers", _0x4d3d0b.hasResellers);
  appendSearchParam(_0x36ba7f, "creatorVerified", _0x4d3d0b.creatorVerified);
  appendSearchParam(_0x36ba7f, "matchMode", _0x4d3d0b.matchMode);
  appendSearchParam(_0x36ba7f, "sortBy", _0x4d3d0b.sortBy);
  appendSearchParam(_0x36ba7f, "sortOrder", _0x4d3d0b.sortOrder);
  appendSearchParam(_0x36ba7f, "limit", _0x4d3d0b.limit || 5);
  return "/search-catalog?" + _0x36ba7f.toString();
}
function bffHeaders() {
  const _0x2c7aff = deps.config.bffAccessToken?.trim();
  if (_0x2c7aff) {
    return {
      headers: {
        "x-bff-token": _0x2c7aff
      }
    };
  } else {
    return undefined;
  }
}
async function fetchCatalogThumbnails(_0x13448a) {
  const _0x51d3a7 = new Map();
  if (!_0x13448a.length) {
    return _0x51d3a7;
  }
  try {
    const _0x564e18 = await deps.robloxApi.get("/asset-thumbnails?ids=" + _0x13448a.slice(0, 50).join(",") + "&size=150x150&format=Png", bffHeaders());
    if (!isRecord(_0x564e18) || _0x564e18.success !== true || !Array.isArray(_0x564e18.data)) {
      return _0x51d3a7;
    }
    for (const _0x17f4b9 of _0x564e18.data) {
      if (!isRecord(_0x17f4b9)) {
        continue;
      }
      const _0x41a5a4 = _0x17f4b9.targetId;
      const _0x40a762 = _0x17f4b9.imageUrl;
      if (typeof _0x41a5a4 === "number" && typeof _0x40a762 === "string" && /^https:\/\//.test(_0x40a762)) {
        _0x51d3a7.set(_0x41a5a4, _0x40a762);
      }
    }
    await Promise.all([..._0x51d3a7.entries()].map(async ([_0x4bb8bc, _0x295dd7]) => {
      const _0x35b181 = await deps.media.imageHosting(_0x295dd7);
      if (_0x35b181) {
        _0x51d3a7.set(_0x4bb8bc, _0x35b181);
      }
    }));
  } catch (_0x55efc1) {
    deps.ctx.logger("roblox-search").warn("缩略图获取失败，降级不展示：%s", String(_0x55efc1));
  }
  return _0x51d3a7;
}
function catalogSessionMeta(_0x16ac2e, _0x17d08f) {
  return (_0x16ac2e ? "1" : "0") + ":" + (_0x17d08f || "");
}
function parseCatalogSessionMeta(_0x5a8063) {
  if (!_0x5a8063) {
    return {
      marketMode: false
    };
  }
  const _0x32f9c5 = _0x5a8063.indexOf(":");
  if (_0x32f9c5 === -1) {
    return {
      marketMode: false
    };
  }
  return {
    marketMode: _0x5a8063.slice(0, _0x32f9c5) === "1",
    keyword: _0x5a8063.slice(_0x32f9c5 + 1) || undefined
  };
}
function pageSearchPath(_0x240917, _0xda7650) {
  return _0x240917 + "?cursor=" + encodeURIComponent(_0xda7650);
}
async function auditCatalogItems(_0x54f8b1, _0x82f20) {
  let _0x3aa4a4 = 0;
  let _0x27fdf0 = false;
  const _0x2acc6f = [];
  for (const _0x3b44aa of _0x82f20) {
    const _0x4e0edc = deps.truncateText(deps.media.delStrUrl(_0x3b44aa.name), 120);
    const _0x420883 = deps.truncateText(deps.media.delStrUrl(_0x3b44aa.creator.name), 80);
    const [_0x269e29, _0x2eb951] = await Promise.all([deps.imageAudit.checkText(_0x4e0edc), deps.imageAudit.checkText(_0x420883)]);
    const _0x303760 = await deps.outputAudit.auditFields({
      name: _0x269e29,
      creatorName: _0x2eb951
    });
    const _0x3694db = deps.outputAudit.isFlagged(_0x269e29) || deps.outputAudit.isFlagged(_0x2eb951) || !_0x303760.safe;
    if (_0x3694db) {
      _0x27fdf0 = true;
      if (deps.config.useRiskControl && _0x3aa4a4 < 3) {
        await deps.riskControl.onSensitiveOutput(_0x54f8b1, {
          targetId: String(_0x3b44aa.id),
          targetType: "catalog_item",
          targetName: _0x4e0edc,
          summary: ("商品名称：" + _0x4e0edc + "\n作者：" + _0x420883).slice(0, 500),
          reason: "Catalog 字段审核命中：" + (_0x303760.flaggedFields.join("、") || "name/creatorName"),
          auditSource: "output_audit"
        });
        _0x3aa4a4 += 1;
      }
    }
    _0x2acc6f.push({
      ..._0x3b44aa,
      name: _0x303760.audited.name || "****",
      description: "",
      creator: {
        ..._0x3b44aa.creator,
        name: _0x303760.audited.creatorName || "****"
      }
    });
  }
  return {
    items: _0x2acc6f,
    flagged: _0x27fdf0
  };
}
function createSearchSession(_0x2df84a, _0x226d9e, _0x273e61, _0x240a31, _0x16a8af) {
  if (!_0x273e61.nextPageCursor && !_0x273e61.previousPageCursor) {
    return undefined;
  }
  return searchSessions.create({
    userId: _0x2df84a.userId,
    type: _0x226d9e,
    nextCursor: _0x273e61.nextPageCursor,
    previousCursor: _0x273e61.previousPageCursor,
    page: 1,
    total: _0x273e61.matchedCount,
    pageSize: _0x240a31,
    resourceId: _0x16a8af
  });
}
async function sendWithAt(_0x24eb69, _0x17e9a9, _0x11cbac = _0x17e9a9) {
  await deps.Chat.send(_0x24eb69, "<@" + _0x24eb69.userId + "> " + _0x11cbac, _0x17e9a9);
}
async function throttleHint(_0x9bc290) {
  await sendWithAt(_0x9bc290, "请等待上一个查询请求完成...");
  return "";
}
async function sendServerPage(_0x35e3a5, _0xb57a5e, _0x4c6dde, _0x463f19 = 1, _0x50dafc = 5) {
  const _0x2bbd58 = {
    token: _0x4c6dde,
    currentPage: _0x463f19,
    pageSize: _0x50dafc,
    total: _0xb57a5e.matchedCount,
    hasNext: !!_0xb57a5e.nextPageCursor,
    hasPrevious: !!_0xb57a5e.previousPageCursor,
    callerId: _0x35e3a5.userId
  };
  await deps.Chat.send(_0x35e3a5, deps.renderServerResultsMarkdown(_0xb57a5e.data, _0x2bbd58), deps.renderServerResultsText(_0xb57a5e.data, _0x2bbd58));
}
async function sendCatalogPage(_0xd51dc8, _0x47c0b5, _0x5a072e, _0x2d7b21 = 1, _0x405303 = 5, _0x5c6e83 = {}) {
  const _0x19e47e = !!_0x5c6e83.marketMode;
  const [_0x3ec21e, _0x1a8cfc, _0x5d9dd8] = await Promise.all([auditCatalogItems(_0xd51dc8, _0x47c0b5.data), fetchCatalogThumbnails(_0x47c0b5.data.map(_0x52b5d8 => _0x52b5d8.id)), _0x19e47e ? deps.getRolimonsMarketData(deps.ctx) : Promise.resolve(new Map())]);
  const _0x15536b = {
    token: _0x5a072e,
    currentPage: _0x2d7b21,
    pageSize: _0x405303,
    total: _0x47c0b5.matchedCount,
    hasNext: !!_0x47c0b5.nextPageCursor,
    hasPrevious: !!_0x47c0b5.previousPageCursor,
    auditNotice: _0x3ec21e.flagged,
    callerId: _0xd51dc8.userId,
    keyword: _0x5c6e83.keyword,
    thumbnails: _0x1a8cfc,
    market: _0x5d9dd8,
    marketMode: _0x19e47e,
    marketAvailable: _0x5d9dd8.size > 0
  };
  await deps.Chat.send(_0xd51dc8, deps.renderCatalogResultsMarkdown(_0x3ec21e.items, _0x15536b), deps.renderCatalogResultsText(_0x3ec21e.items, _0x15536b), deps.kb.catalogPagination(_0x5a072e, _0x15536b.hasPrevious, _0x15536b.hasNext));
}
return { get _0x42f0a9() { return _0x42f0a9; },
get _0x4321e8() { return _0x4321e8; },
get searchSessions() { return searchSessions; },
get appendSearchParam() { return appendSearchParam; },
get isSearchFailure() { return isSearchFailure; },
get isRecord() { return isRecord; },
get isNullableNumber() { return isNullableNumber; },
get isGameServerDto() { return isGameServerDto; },
get isCatalogItemDto() { return isCatalogItemDto; },
get isItemChartDto() { return isItemChartDto; },
get searchFailureFromError() { return searchFailureFromError; },
get searchFailureMessage() { return searchFailureMessage; },
get getSearchPage() { return getSearchPage; },
get serverSearchPath() { return serverSearchPath; },
get catalogSearchPath() { return catalogSearchPath; },
get bffHeaders() { return bffHeaders; },
get fetchCatalogThumbnails() { return fetchCatalogThumbnails; },
get catalogSessionMeta() { return catalogSessionMeta; },
get parseCatalogSessionMeta() { return parseCatalogSessionMeta; },
get pageSearchPath() { return pageSearchPath; },
get auditCatalogItems() { return auditCatalogItems; },
get createSearchSession() { return createSearchSession; },
get sendWithAt() { return sendWithAt; },
get throttleHint() { return throttleHint; },
get sendServerPage() { return sendServerPage; },
get sendCatalogPage() { return sendCatalogPage; } };
};
