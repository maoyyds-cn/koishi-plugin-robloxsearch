'use strict';

module.exports = function create(deps) {
deps.ctx.command("roblox/服务器状态").action(async ({
  session: svcSession
}) => {
  try {
    const svcUrl = "https://4277980205320394.hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d";
    const svcRaw = await deps.ctx.http.get(svcUrl, {
      responseType: "json",
      timeout: 10000
    });
    const svcData = svcRaw && svcRaw.result;
    if (!svcData || !svcData.status_overall) {
      await deps.Chat.send(svcSession, "服务器状态查询失败，请稍后重试。");
      return;
    }
    const svcMeta = {
      100: ["🟢", "正常"],
      200: ["🟡", "性能下降"],
      300: ["🟠", "部分中断"],
      400: ["🔴", "严重中断"]
    };
    const svcStatus = it => {
      const code = it && it.status_code || 100;
      const m = svcMeta[code] || svcMeta[100];
      return {
        code: code,
        emoji: m[0],
        text: m[1]
      };
    };
    const svcCat = {
      User: "User用户服务",
      Player: "Player玩家服务",
      Creator: "Creator创作者服务"
    };
    const svcContainer = {
      Website: "网页端",
      "Mobile App": "手机客户端",
      "Xbox App": "Xbox客户端",
      Avatar: "虚拟形象",
      Games: "游戏",
      Studio: "Studio",
      "Asset Delivery": "资产交付",
      "Data Store": "数据存储",
      "Game Join": "游戏加入",
      Dashboard: "仪表盘",
      Talent: "人才",
      Documentation: "文献资料",
      Forum: "论坛",
      Marketplace: "市场"
    };
    const svcOverall = svcStatus(svcData.status_overall);
    const svcTime = (() => {
      const d = new Date(svcData.status_overall.updated);
      if (isNaN(d)) {
        return "";
      }
      const pad = n => String(n).padStart(2, "0");
      const t = new Date(d.getTime() + 28800000);
      return t.getUTCFullYear() + "/" + pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCDate()) + " " + pad(t.getUTCHours()) + ":" + pad(t.getUTCMinutes()) + ":" + pad(t.getUTCSeconds());
    })();
    const svcRows = svcData.status && Array.isArray(svcData.status) ? svcData.status : [];
    const svcIncidents = svcData.incidents || [];
    const svcMaintenance = svcData.maintenance && svcData.maintenance.active || [];
    const svcLines = [];
    svcLines.push("![img #600px #183px](https://irt1.cn/Roblox.png)");
    svcLines.push(svcOverall.emoji + svcOverall.text + " Roblox 服务状态（" + svcTime + "）");
    svcLines.push("| 分类 | 服务 | 状态 |");
    svcLines.push("| :--- | :--- | :--: |");
    for (const svcRow of svcRows) {
      const svcCatName = svcCat[svcRow.name] || svcRow.name;
      const svcContainers = (svcRow.containers || []).map(c => svcContainer[c.name] || c.name).join("、");
      const svcSt = svcStatus(svcRow);
      svcLines.push("| " + svcCatName + " | " + svcContainers + " | " + svcSt.emoji + svcSt.text + " |");
    }
    svcLines.push("");
    if (svcOverall.code === 100 && svcIncidents.length === 0 && svcMaintenance.length === 0) {
      svcLines.push("🟢 当前无已知故障或维护");
    } else {
      svcLines.push(svcOverall.emoji + " 当前：" + svcOverall.text);
    }
    svcLines.push("💡 数据来源：Roblox 官方状态页（status.roblox.com）");
    await deps.Chat.send(svcSession, svcLines.join("\n"));
  } catch (svcErr) {
    await deps.Chat.send(svcSession, "服务器状态查询失败，请稍后重试。");
  }
});
return {  };
};
