# koishi-plugin-robloxsearch

Roblox 综合查询机器人插件，覆盖玩家 / 游戏 / 群组 / 社群查询，内置商店物品、游戏公开服务器搜索，以及积分、等级、签到、风控、审核等完整运营体系。

> 感谢原项目 [koishi-plugin-smmcat-robloxservice](https://www.npmjs.com/package/koishi-plugin-smmcat-robloxservice) 的基础支持。

## 功能特性

- **玩家查询**：按用户名 / 用户 ID 查询，支持头像、虚拟形象、简介、好友 / 关注 / 粉丝列表、曾用名等。
- **游戏查询**：按游戏名 / 游戏 ID 搜索，支持精确匹配。
- **群组查询**：按群组名 / 群组 ID 搜索，支持群组图标。
- **商店物品搜索**：Asset / Bundle，按作者、价格、类别、类型过滤，支持 Limited 收藏品与价格趋势图。
- **游戏服务器搜索**：按 Place ID 过滤、排序、分页公开服务器。
- **音乐推荐**：随机 TOP 音乐 ID。
- **积分 / 等级 / 签到**：每日签到得 R 点与经验，等级与积分体系，积分排行榜，流水。
- **兑换码**：添加 / 查询 / 兑换兑换码（发放 R 点）。
- **账号绑定**：QQ 与 Roblox 账号绑定 / 解绑 / 统计。
- **权限体系**：开发者 / 管理员 / 协助管理员 / 赞助名单四级权限。
- **风控与审核**：敏感词与图片审核、违规库、限流、长期风控、操作日志。
- **公告与社群**：控制台公告管理、社群推荐列表。
- **翻译**：查询结果自动翻译（可一键开关）。
- **数据管理**：本地 / 数据库双存储，导入 / 导出 / 预览 / 迁移。
- **图床代理**：结果图片经可选的代理服务转存，保证稳定展示（也可直连原图）。

## 安装

### 方式一：插件市场（推荐）

在 Koishi 控制台的「插件市场」中搜索 `robloxsearch` 或 `roblox`，点击安装即可。

### 方式二：npm

```bash
npm install koishi-plugin-robloxsearch
# 到 Koishi 控制台配置插件
```

### 方式三：源码安装

```bash
git clone https://github.com/maoyyds-cn/koishi-plugin-robloxsearch.git
# 将目录拷贝到 Koishi 的 plugins 目录，或在控制台手动添加本地插件
```

## 依赖

本插件为纯 JavaScript 编译产物，`main` 指向 `lib/index.js`，无需二次构建。

### 必需服务（运行时注入）

插件运行依赖以下 Koishi 服务，请确保已启用对应插件：

| 服务             | 提供插件                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `database`     | 任意数据库插件（如 `@koishijs/plugin-database-sqlite`、`database-mysql` 等）                                     |
| `localstorage` | [koishi-plugin-smmcat-localstorage](https://www.npmjs.com/package/koishi-plugin-smmcat-localstorage) |
| `monetary`     | [koishi-plugin-monetary](https://www.npmjs.com/package/koishi-plugin-monetary)                       |

### npm 依赖

- **dependencies**：`@koishijs/console`（控制台扩展）
- **peerDependencies**：
  - `koishi`（^4.18.2，必装）
  - `@koishijs/plugin-console`（^5.30.4，可选）
  - `koishi-plugin-monetary`（^0.1.3）
  - `koishi-plugin-smmcat-localstorage`（^0.0.2）

## 配置

所有配置项在 Koishi 控制台的插件配置面板中均带说明，以下按类别列出。

### 基础与调试

| 配置项        | 说明                     | 默认       |
| ---------- | ---------------------- | -------- |
| `deBug`    | 日志查看更多信息               | `false`  |
| `useMd`    | 使用原生 Markdown 写法（QQ 端） | `false`  |
| `basePath` | 配置文件地址                 | `roblox` |

### 网络与 API

| 配置项              | 说明                                      | 默认           |
| ---------------- | --------------------------------------- | ------------ |
| `apiServer`      | 自定义 API 服务器地址（留空使用官方 Roblox 接口）         | \`\`         |
| `useProxyServer` | 经 `rotunnel.com` 代理访问 Roblox API（关闭则直连） | `true`       |
| `bffAccessToken` | BFF 后端 `x-bff-token` 鉴权（后端未启用鉴权时留空）     | \`\`（secret） |

### 签到与欢迎

| 配置项                             | 说明         | 默认          |
| ------------------------------- | ---------- | ----------- |
| `useSignin`                     | 开启每日签到     | `true`      |
| `useWelcome`                    | 开启进群欢迎     | `true`      |
| `signinGetMin` / `signinGetMax` | 签到获得 R 点区间 | `10` / `20` |

### 积分 / 经验 / 等级

| 配置项                   | 说明             | 默认     |
| --------------------- | -------------- | ------ |
| `useExpSystem`        | 开启经验 / 等级体系    | `true` |
| `dailyQueryExpCap`    | 每日计经验的查询次数上限   | `5`    |
| `signinExp`           | 每日签到获得经验       | `5`    |
| `pointsPerExp`        | 兑换 1 经验所需 R 点  | `5`    |
| `dailyConvertExpCap`  | 每日兑换经验上限（0=不限） | `0`    |
| `levelUpRewardPoints` | 每升 1 级奖励 R 点   | `100`  |

### 查询限流

| 配置项                | 说明        | 默认    |
| ------------------ | --------- | ----- |
| `rateLimitPerMin`  | 每分钟查询限流次数 | `20`  |
| `rateLimitPerHour` | 每小时查询限流次数 | `200` |

### 翻译

| 配置项            | 说明     | 默认     |
| -------------- | ------ | ------ |
| `useTranslate` | 开启自动翻译 | `true` |

### 权限名单

| 配置项                | 说明                                 | 默认   |
| ------------------ | ---------------------------------- | ---- |
| `developerList`    | 开发者名单（最高权限）                        | `[]` |
| `adminList`        | 管理员名单                              | `[]` |
| `assistAdminList`  | 协助管理员名单（审核 + 风控调整）                 | `[]` |
| `sponsorList`      | 赞助用户名单（身份外显）                       | `[]` |
| `foreverBanList`   | 永久禁止使用名单                           | `[]` |
| `delGetUserIdList` | 禁止指向查找的用户 ID                       | `[]` |
| `riskAdminList`    | （旧字段，兼容保留，建议迁移到 `assistAdminList`） | `[]` |

### 风控

| 配置项               | 说明          | 默认     |
| ----------------- | ----------- | ------ |
| `useRiskControl`  | 开启风控系统      | `true` |
| `violationLibTTL` | 违规库目标有效期（天） | `365`  |
| `riskKeywords`    | 风控敏感词补充     | `[]`   |
| `banMsg`          | 风控限制提示文案    | 见下     |

### 审核（文本 / 图片）

| 配置项                                    | 说明                        | 默认                   |
| -------------------------------------- | ------------------------- | -------------------- |
| `useTextAudit`                         | 开启文本审核（UApiPro 敏感词检测）     | `true`               |
| `textAuditToken`                       | UApiPro 文本审核 Bearer Token | \`\`（secret）         |
| `useImageAudit`                        | 开启图像审核                    | `true`               |
| `useFreeExamine`                       | 使用免费的内容审核                 | `false`              |
| `isExamine`                            | 开启腾讯云不良内容审核               | `false`              |
| `tencentSecretId` / `tencentSecretKey` | 腾讯云密钥（CI 审核）              | \`\`                 |
| `tencentBucket` / `tencentRegion`      | 腾讯云 COS 存储桶 / 地域          | \`\` / `ap-hongkong` |

### 图床代理

| 配置项               | 说明                        | 默认           |
| ----------------- | ------------------------- | ------------ |
| `imageProxyUrl`   | 图床代理服务地址（留空则直连原图、不经过代理）   | \`\`         |
| `imageProxyToken` | 图床代理鉴权 token（服务端未开启鉴权时留空） | \`\`（secret） |

### 公告 / 社群

| 配置项                 | 说明                                        | 默认      |
| ------------------- | ----------------------------------------- | ------- |
| `useAnnouncement`   | 开启公告系统                                    | `true`  |
| `useCommunityList`  | 开启社群推荐列表                                  | `false` |
| `communityDataPath` | 社群列表 JSON 路径（留空用 `data/communities.json`） | \`\`    |
| `globalAdv`         | 全局小广告                                     | \`\`    |

### 存储

| 配置项           | 说明            | 默认      |
| ------------- | ------------- | ------- |
| `useDatabase` | 使用数据库（否则本地存储） | `false` |

## 命令

所有命令均以父命名空间 `roblox/` 注册，可用完整路径（如 `/roblox/菜单`）或短名（如 `/菜单`）调用。带 `<参数>` 为必填，`[参数]` 为可选。

### 查询类

| 命令                               | 说明              |
| -------------------------------- | --------------- |
| `roblox/菜单`                      | 打开服务中心菜单        |
| `roblox/用户名搜索 <username>`        | 按用户名查询玩家        |
| `roblox/用户ID搜索 <userId:number>`  | 按用户 ID 查询       |
| `roblox/查询用户曾用名 <username>`      | 查询用户曾用名         |
| `roblox/获取用户头像 <username>`       | 获取用户头像          |
| `roblox/游戏名搜索 <keyword:text>`    | 按名称搜索游戏         |
| `roblox/游戏名精确搜索 <keyword:text>`  | 按名称精确搜索游戏       |
| `roblox/游戏ID搜索 <placeId:number>` | 按 Place ID 查询游戏 |
| `roblox/群组名搜索 <groupName:text>`  | 按名称搜索群组         |
| `roblox/群组ID搜索 <groupid>`        | 按 ID 查询群组       |
| `roblox/获取群组图标 <groupName>`      | 获取群组图标          |
| `roblox/获取好友列表 <userId:number>`  | 获取好友列表          |
| `roblox/获取关注列表 <userId:number>`  | 获取关注列表          |
| `roblox/获取粉丝列表 <userId:number>`  | 获取粉丝列表          |

### 账号绑定

| 命令                           | 说明           |
| ---------------------------- | ------------ |
| `roblox/绑定Roblox账号 <userId>` | 绑定 Roblox 账号 |
| `roblox/查看绑定`                | 查看当前绑定       |
| `roblox/解除绑定`                | 解除绑定         |
| `roblox/绑定统计`                | 绑定统计         |

### 积分 / 等级 / 签到

| 命令                         | 说明      |
| -------------------------- | ------- |
| `roblox/签到`                | 每日签到    |
| `roblox/积分`                | 查看积分    |
| `roblox/等级`                | 查看等级    |
| `roblox/积分排行榜`             | 积分排行榜   |
| `roblox/流水 [ledger]`       | 查看积分流水  |
| `roblox/兑换经验 <exp:number>` | R 点兑换经验 |

### 兑换码

| 命令                                                                | 说明         |
| ----------------------------------------------------------------- | ---------- |
| `roblox/兑换码 <giftCode>`                                           | 兑换兑换码      |
| `roblox/查询兑换码 <giftCode>`                                         | 查询兑换码      |
| `roblox/添加兑换码 <giftCode> <currency> <total> <validityDay> <note>` | 添加兑换码（管理员） |

### 音乐与翻译

| 命令                 | 说明           |
| ------------------ | ------------ |
| `roblox/随机TOP音乐ID` | 随机 TOP 音乐 ID |
| `roblox/开启翻译`      | 开启自动翻译       |
| `roblox/关闭翻译`      | 关闭自动翻译       |

### 个人信息

| 命令            | 说明     |
| ------------- | ------ |
| `roblox/我的信息` | 查看我的信息 |

### 社群

| 命令                  | 说明     |
| ------------------- | ------ |
| `roblox/ROBLOX社群列表` | 查看社群列表 |
| `roblox/社群推荐`       | 社群推荐   |
| `roblox/报名推荐社群`     | 报名推荐社群 |
| `roblox/刷新社群列表`     | 刷新社群列表 |

### 管理员 / 权限（需管理员及以上）

| 命令                                    | 说明          |
| ------------------------------------- | ----------- |
| `roblox/添加管理员 <userId>`               | 添加管理员       |
| `roblox/删除管理员 <userId>`               | 删除管理员       |
| `roblox/增减R点 <userId> <delta:number>` | 增减 R 点（开发者） |
| `roblox/增减经验 <userId> <delta:number>` | 增减经验（开发者）   |
| `roblox/设定等级 <userId> <level:number>` | 设定等级（开发者）   |

### 风控 / 违规（需管理员及以上）

| 命令                                                         | 说明                |
| ---------------------------------------------------------- | ----------------- |
| `roblox/给予风控限制 <userId>`                                   | 给予风控限制（别名 `给予封禁`） |
| `roblox/给予长期风控 <userId>`                                   | 给予长期风控（别名 `给予永封`） |
| `roblox/解除风控限制 <userId>`                                   | 解除风控限制（别名 `给予解封`） |
| `roblox/解除风控 <userId>`                                     | 解除风控              |
| `roblox/调整风控等级 <userId> <level> [days:number]`             | 调整风控等级            |
| `roblox/风控状态 <userId>`                                     | 查看风控状态            |
| `roblox/违规添加 <targetId> <targetType> [name] [reason:text]` | 添加违规              |
| `roblox/违规移除 <targetId> <targetType>`                      | 移除违规              |

### 审核

| 命令                           | 说明     |
| ---------------------------- | ------ |
| `roblox/审核列表`                | 查看审核列表 |
| `roblox/审核处理 <id> <verdict>` | 处理审核   |

### 数据 / 运维

| 命令                           | 说明                       |
| ---------------------------- | ------------------------ |
| `roblox/数据预览`                | 数据预览                     |
| `roblox/数据导出`                | 数据导出                     |
| `roblox/数据导入 [file]`         | 数据导入（`--overwrite` 覆盖已有） |
| `迁移至数据库`                     | 本地数据迁移至数据库（顶层命令）         |
| `roblox/操作日志 [count:number]` | 查看操作日志                   |
| `roblox/服务器状态`               | 查看服务器状态                  |

> 搜索类（商店物品搜索 / Limited 搜索 / 游戏服务器搜索 / 物品价格趋势）通过查询结果中的按钮与分页令牌交互，结果会以内联键盘提供「上一页 / 下一页」等操作。

## 许可

MIT

## 鸣谢

[Koishi-plugin-smmcat-robloxservice - NPM](https://www.npmjs.com/package/koishi-plugin-smmcat-robloxservice)
