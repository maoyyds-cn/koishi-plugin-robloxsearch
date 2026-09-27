'use strict';

module.exports = function create(deps) {
const RANGES = ["1w", "1m", "3m", "6m", "1y", "all"];
deps.ctx.command("roblox/物品趋势 <assetId:number>").option("range", "--range <range> 时间范围（1w|1m|3m|6m|1y|all），默认 all", { fallback: "all" }).userFields(["id"]).action(async ({
  session,
  options
}, assetId) => {
  if (await deps.legacyBan.verify(session)) {
    return;
  }
  if (deps.queryLock.isUse(session)) {
    return deps.throttleHint(session);
  }
  if (!Number.isSafeInteger(assetId) || assetId <= 0) {
    await deps.sendWithAt(session, "请输入正确的物品 ID。\n> 例如：/物品趋势 12345 --range all");
    return;
  }
  const range = String(options.range || "all");
  if (!RANGES.includes(range)) {
    await deps.sendWithAt(session, "时间范围只支持：1w|1m|3m|6m|1y|all");
    return;
  }
  const flow = await deps.queryFlow.begin(session, {
    scope: "query",
    targetType: "catalog_item",
    queryText: String(assetId)
  });
  if (!flow.ok) {
    return;
  }
  deps.queryLock.startUse(session);
  try {
    const res = await deps.robloxApi.get("/item-chart/" + assetId + "?range=" + range);
    const chart = res?.data;
    if (!deps.isItemChartDto(chart)) {
      await deps.queryFlow.cancel(session, flow.charge);
      await deps.sendWithAt(session, deps.searchFailureMessage(res, "价格趋势获取失败，请确认该物品为 Limited 收藏品且后端已配置。"));
      return;
    }
    const hostedImage = chart.imageBase64 ? await deps.media.imageHostingBase64(chart.imageBase64) : "";
    const markdown = deps.renderChartResultMarkdown(chart, hostedImage, session.userId);
    const plain = deps.renderChartResultText(chart);
    await deps.Chat.send(session, markdown, plain, deps.kb.chartRangeRow(assetId));
  } catch (err) {
    await deps.queryFlow.cancel(session, flow.charge);
    await deps.sendWithAt(session, deps.searchFailureMessage(err, "价格趋势获取失败，请稍后重试。"));
  } finally {
    deps.queryLock.clearUse(session);
  }
});
return {  };
};