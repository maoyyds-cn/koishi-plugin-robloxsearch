# koishi-plugin-robloxsearch

ROBLOX的搜索

## 搜索命令

- `/游戏服务器搜索 <Place ID>`：公开服务器过滤、排序和分页。
- `/商店物品搜索 <关键词>`：Asset/Bundle、作者、价格、类别和匹配模式筛选。
- `/Limited搜索 [关键词]`：默认只搜索 Limited/Collectible 商品。
- 搜索结果中的上一页、下一页令牌与发起查询的用户绑定，5 分钟后失效。

常用参数可通过 Koishi 的 `help` 命令查看。搜索功能使用 `apiServer` 指向 BFF；后端启用
`BFF_ACCESS_TOKEN` 时同时配置插件的 `bffAccessToken`。Catalog 文本审核需要配置
`textAuditAppId` 和 `textAudirobloxtToken`，缺少审核配置时文本会按 fail-closed 策略遮罩。

感谢[Koishi-plugin-smmcat-robloxservice - NPM的支持](https://www.npmjs.com/package/koishi-plugin-smmcat-robloxservice)
