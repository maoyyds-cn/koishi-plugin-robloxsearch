'use strict';

module.exports = function create(deps) {
async function runCatalogSearch(_0x1fdd74, _0x3fd277, _0x270d0a) {
  const _0x56bc84 = _0x3fd277?.trim();
  const _0x37d96c = !!_0x56bc84 || !!_0x270d0a.creatorId || !!_0x270d0a.creatorName?.trim() || !!_0x270d0a.category?.trim() || !!_0x270d0a.assetTypeIds?.trim() || !!_0x270d0a.bundleTypeIds?.trim() || !!_0x270d0a.limited && _0x270d0a.limited !== "none";
  if (!_0x37d96c) {
    await deps.Chat.send(_0x1fdd74, "<@" + _0x1fdd74.userId + "> 请至少提供关键词、作者、类别、具体类型或 Limited 条件之一。", "请至少提供关键词、作者、类别、具体类型或 Limited 条件之一。", deps.kb.catalogNav());
    return;
  }
  if (_0x270d0a.minPrice !== undefined && _0x270d0a.maxPrice !== undefined && _0x270d0a.minPrice > _0x270d0a.maxPrice) {
    await deps.sendWithAt(_0x1fdd74, "最低价格不能大于最高价格。");
    return;
  }
  const _0x329d7a = await deps.queryFlow.begin(_0x1fdd74, {
    scope: "query",
    targetType: "catalog_item",
    queryText: _0x56bc84 || _0x270d0a.creatorName || _0x270d0a.category || _0x270d0a.limited
  });
  if (!_0x329d7a.ok) {
    return;
  }
  deps.queryLock.startUse(_0x1fdd74);
  try {
    const _0x2ee563 = Math.max(1, Math.min(10, Math.trunc(_0x270d0a.limit || 5)));
    const _0xe916ce = await deps.getSearchPage(deps.catalogSearchPath(_0x56bc84, {
      ..._0x270d0a,
      limit: _0x2ee563
    }), deps.isCatalogItemDto);
    if (!_0xe916ce.data.length) {
      await deps.Chat.send(_0x1fdd74, "<@" + _0x1fdd74.userId + "> 未找到符合条件的商品。", "未找到符合条件的商品。", deps.kb.catalogNav());
      return;
    }
    const _0x4f9cbd = !!_0x270d0a.showMarket;
    const _0x5ad433 = deps.createSearchSession(_0x1fdd74, "catalog", _0xe916ce, _0x2ee563, deps.catalogSessionMeta(_0x4f9cbd, _0x56bc84));
    await deps.sendCatalogPage(_0x1fdd74, _0xe916ce, _0x5ad433?.token, 1, _0x2ee563, {
      marketMode: _0x4f9cbd,
      keyword: _0x56bc84
    });
  } catch (_0x4d65fc) {
    await deps.queryFlow.cancel(_0x1fdd74, _0x329d7a.charge);
    const _0x32f876 = deps.searchFailureMessage(_0x4d65fc, "物品搜索失败，本次不计费，请稍后重试。");
    await deps.sendWithAt(_0x1fdd74, _0x32f876);
  } finally {
    deps.queryLock.clearUse(_0x1fdd74);
  }
}
return { get runCatalogSearch() { return runCatalogSearch; } };
};
