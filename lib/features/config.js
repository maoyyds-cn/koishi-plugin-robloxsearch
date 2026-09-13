'use strict';

module.exports = function create(deps) {
var name = "smmcat-robloxservice";
var inject = {
  required: ["localstorage", "monetary", "database"]
};
var Config = deps.import_koishi2.Schema.object({
  deBug: deps.import_koishi2.Schema.boolean().default(false).description("日志查看更多信息"),
  useMd: deps.import_koishi2.Schema.boolean().default(false).description("使用原生MD写法"),
  apiServer: deps.import_koishi2.Schema.string().default("").description("自定义API服务器地址（留空使用官方Roblox接口）"),
  useProxyServer: deps.import_koishi2.Schema.boolean().default(true).description("代理服务器").comment("开启经 rotunnel.com 代理访问 Roblox API；关闭直连 roblox.com"),
  basePath: deps.import_koishi2.Schema.string().default("roblox").description("配置文件地址"),
  useSignin: deps.import_koishi2.Schema.boolean().default(true).description("开启每日签到"),
  useWelcome: deps.import_koishi2.Schema.boolean().default(true).description("开启进群欢迎"),
  signinGetMin: deps.import_koishi2.Schema.number().default(10).description("签到得到的R点最小值"),
  signinGetMax: deps.import_koishi2.Schema.number().default(20).description("签到得到的R点最大值"),
  developerList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("开发者名单（最高权限，含增减R点/增减经验、管理员任免）"),
  adminList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("管理员名单（除开发者专属权限外的全部管理功能；通过 /查自身信息 获取）"),
  assistAdminList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("协助管理员名单（仅人工审核指令 + 风控等级调整）"),
  sponsorList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("赞助用户名单（身份外显，功能与普通用户一致）"),
  foreverBanList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("永久禁止使用名单"),
  banMsg: deps.import_koishi2.Schema.string().default("你 %banCreateTime% 被风控限制使用，限制时间：%banNeedTime%").description("风控限制用户使用指令的提示"),
  delGetUserIdList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("禁止指向查找的用户ID"),
  isExamine: deps.import_koishi2.Schema.boolean().default(false).description("是否开启腾讯云不良内容审核"),
  useTranslate: deps.import_koishi2.Schema.boolean().default(true).description("开启自动翻译"),
  useDatabase: deps.import_koishi2.Schema.boolean().default(false).description("使用数据库"),
  useFreeExamine: deps.import_koishi2.Schema.boolean().default(false).description("使用免费的内容审核"),
  globalAdv: deps.import_koishi2.Schema.string().default("").description("全局小广告"),
  useExpSystem: deps.import_koishi2.Schema.boolean().default(true).description("开启经验/等级体系（积分 v2.0）"),
  dailyQueryExpCap: deps.import_koishi2.Schema.number().default(5).description("每日计经验的查询次数上限"),
  signinExp: deps.import_koishi2.Schema.number().default(5).description("每日签到获得经验"),
  pointsPerExp: deps.import_koishi2.Schema.number().default(5).description("兑换 1 经验所需 R点（5R=1经验）"),
  dailyConvertExpCap: deps.import_koishi2.Schema.number().default(0).description("每日兑换经验上限（0=不限）"),
  levelUpRewardPoints: deps.import_koishi2.Schema.number().default(100).description("每升 1 级奖励 R点"),
  useRiskControl: deps.import_koishi2.Schema.boolean().default(true).description("开启风控系统（v3.1）"),
  violationLibTTL: deps.import_koishi2.Schema.number().default(365).description("违规库目标有效期（天）"),
  rateLimitPerMin: deps.import_koishi2.Schema.number().default(20).description("每分钟查询限流次数"),
  rateLimitPerHour: deps.import_koishi2.Schema.number().default(200).description("每小时查询限流次数"),
  riskKeywords: deps.import_koishi2.Schema.array(String).role("table").default([]).description("风控敏感词补充（内置词库之外）"),
  riskAdminList: deps.import_koishi2.Schema.array(String).role("table").default([]).description("【旧字段·兼容保留】风控管理员名单：现等同于协助管理员，建议迁移到 assistAdminList"),
  bffAccessToken: deps.import_koishi2.Schema.string().role("secret").default("").description("BFF x-bff-token（后端未启用鉴权时留空）"),
  useTextAudit: deps.import_koishi2.Schema.boolean().default(true).description("开启文本审核（UApiPro 敏感词检测，关闭后文本原样展示）"),
  textAuditToken: deps.import_koishi2.Schema.string().role("secret").default("").description("UApiPro 文本审核 Bearer Token（留空则不附带鉴权头）"),
  useImageAudit: deps.import_koishi2.Schema.boolean().default(true).description("开启图像审核（关闭后图片原样展示）"),
  imageProxyUrl: deps.import_koishi2.Schema.string().default("").description("图床代理服务地址（留空则直连原图、不经过代理）"),
  imageProxyToken: deps.import_koishi2.Schema.string().role("secret").default("").description("图床代理鉴权 token（服务端未开启鉴权时留空）"),
  tencentSecretId: deps.import_koishi2.Schema.string().description("腾讯云 SecretId（开通自有CI审核时填写）").default(""),
  tencentSecretKey: deps.import_koishi2.Schema.string().description("腾讯云 SecretKey").default(""),
  tencentBucket: deps.import_koishi2.Schema.string().description("腾讯云 COS 存储桶名（如：my-bucket-1250000000）").default(""),
  tencentRegion: deps.import_koishi2.Schema.string().description("腾讯云 COS 地域（如：ap-hongkong）").default("ap-hongkong"),
  useAnnouncement: deps.import_koishi2.Schema.boolean().default(true).description("开启公告系统（控制台「Roblox 公告管理」页管理，用户使用机器人时自动附带）"),
  useCommunityList: deps.import_koishi2.Schema.boolean().default(false).description("开启社群推荐列表功能"),
  communityDataPath: deps.import_koishi2.Schema.string().default("").description("社群列表 JSON 文件路径（留空使用 data/communities.json）")
});
return { get name() { return name; }, set name(value) { name = value; },
get inject() { return inject; }, set inject(value) { inject = value; },
get Config() { return Config; }, set Config(value) { Config = value; } };
};
