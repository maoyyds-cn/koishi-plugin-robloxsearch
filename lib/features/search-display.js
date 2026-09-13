'use strict';

module.exports = function create(deps) {
const displayUnlockHint = "🔒 部分内容需更高等级解锁：2级+昵称 · 3级+游戏封面 · 4级+头像/完整展示";
const isDisplayAdmin = _0x23fba1 => deps.Roles.isStaff(_0x23fba1.userId);
function getDisplayPriv(_0x2e6b00) {
  return deps.getPrivilege(7);
}
function withDisplayUnlockHint(_0x2645dc, _0x279b4b) {
  if (!_0x279b4b) {
    return _0x2645dc;
  }
  return _0x2645dc.trimEnd() + "\n\n" + displayUnlockHint;
}
async function prepareSearchText(_0x3d4f89, _0x475855) {
  const _0x145d96 = deps.media.delStrUrl(_0x3d4f89);
  return deps.applySearchAudit(_0x145d96, _0x475855, _0x536e6c => deps.imageAudit.checkText(_0x536e6c));
}
async function prepareSearchImage(_0x385774, _0x5df331, _0x5cbec3) {
  if (!_0x385774) {
    return "";
  }
  const _0x11a209 = await deps.applySearchAudit(_0x385774, _0x5df331, _0x4df6ad => deps.imageAudit.checkImage(_0x4df6ad, _0x5cbec3));
  return deps.media.imageHosting(_0x11a209);
}
async function prepareUserImages(_0x917303, _0x5e8995, _0x22c505) {
  const _0x1dcafe = {
    ..._0x917303,
    avatar: "",
    bodyPic: ""
  };
  if (!_0x22c505.showAvatar) {
    return _0x1dcafe;
  }
  const _0xf31f9a = await deps.robloxApi.get("/get-user-avatar/" + encodeURIComponent(_0x917303.username));
  const _0x5b0793 = await deps.robloxApi.get("/get-user-body/" + encodeURIComponent(_0x917303.username));
  _0x1dcafe.avatar = _0xf31f9a?.data[0]?.imageUrl || "";
  _0x1dcafe.bodyPic = _0x5b0793?.data[0]?.imageUrl || "";
  if (deps.config.useMd) {
    const _0x403729 = deps.shouldBypassSearchAudit(_0x917303);
    const _0x43ea77 = {
      session: _0x5e8995,
      targetId: "" + _0x917303.userId,
      targetType: "user",
      targetName: _0x917303.username,
      reason: "虚拟形象图片命中敏感内容"
    };
    _0x1dcafe.avatar = (await prepareSearchImage(_0x1dcafe.avatar, _0x403729, _0x43ea77)) || "https://smmcat.cn/wp-content/uploads/2026/04/null.png";
    _0x1dcafe.bodyPic = (await prepareSearchImage(_0x1dcafe.bodyPic, _0x403729, _0x43ea77)) || "https://smmcat.cn/wp-content/uploads/2026/04/null.png";
  }
  return _0x1dcafe;
}
function renderUserDetail(_0x4a75cd, _0x1bfac9, _0x48d509) {
  const _0x1a5ae7 = _0x48d509.showNickname ? _0x4a75cd.displayName : "（2级解锁）";
  const _0x18510b = _0x48d509.showNickname ? "<qqbot-cmd-input text=\"" + _0x4a75cd.username + "\" show=\"" + _0x1a5ae7 + "(@" + _0x4a75cd.username + ")\"/>" : _0x1a5ae7 + " (@" + _0x4a75cd.username + ")";
  const _0x7d8633 = !_0x48d509.showNickname || !_0x48d509.showAvatar;
  const _0x2cd115 = {
    0: "离线",
    1: "在线",
    2: "游戏内",
    3: "工作室"
  };
  if (deps.config.useMd) {
    const _0x3c74ee = _0x48d509.showAvatar ? "\n| 头像 | 虚拟形象 |\n|:---:|:---:|\n| ![test #100px #100px](" + _0x4a75cd.avatar + ") | ![test #100px #100px](" + _0x4a75cd.bodyPic + ") |\n" : "";
    const _0x2056cf = "## 👤 玩家信息\n\n<qqbot-at-user id=\"" + _0x1bfac9.userId + "\" />\n**" + _0x18510b + "** " + (_0x48d509.showAvatar && _0x4a75cd.hasVerifiedBadge ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/fa05eaf9a732e1bb75c47200ad1c5effbf18aef5.png)" : "") + " " + (_0x48d509.showAvatar && _0x4a75cd.isRobloxStaff ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/e949fd7906a184f222cae1a2431cc4d82f93bf22.png)" : "") + " " + (_0x48d509.showAvatar && _0x4a75cd.isPremium ? "![test #19px #19px](https://i0.hdslb.com/bfs/openplatform/d7f8978b449f2b8078d8a2fa85360063c846e26f.png)" : "") + "\n" + _0x3c74ee + "\n<qqbot-cmd-input text=\"获取好友列表 " + _0x4a75cd.userId + "\" show=\"" + _0x4a75cd.friendCount + "\"/> 好友  |  <qqbot-cmd-input text=\"获取关注列表 " + _0x4a75cd.userId + "\" show=\"" + _0x4a75cd.followingCount + "\"/> 关注  |  <qqbot-cmd-input text=\"获取粉丝列表 " + _0x4a75cd.userId + "\" show=\"" + _0x4a75cd.followerCount + "\"/> 粉丝\n **用户ID**： <qqbot-cmd-input text=\"" + _0x4a75cd.userId + "\" show=\"" + _0x4a75cd.userId + "\"/>\n **用户简介**：\n```text\n" + (_0x4a75cd.blurb || "无") + "\n```\n **账号创建时间**： ```" + (_0x4a75cd.joinDate ? new Date(_0x4a75cd.joinDate).toLocaleDateString() : "已隐藏") + "```\n **注册天数**： ```" + (deps.media.getDateDiff(_0x4a75cd.joinDate).toString() || "已隐藏") + "```\n **在线状态**： " + (_0x4a75cd.presences?.userPresenceType !== undefined ? _0x2cd115[_0x4a75cd.presences.userPresenceType] : "离线") + "\n **最后在线地点**： " + (_0x4a75cd.presences?.lastLocation ? deps.media.delStrUrl(_0x4a75cd.presences.lastLocation) : "") + "\n **账号语言类型**： " + _0x4a75cd.language + "\n **账号是否被禁**： " + (_0x4a75cd.isBanned ? "是" : "否") + "\n> 💡 提示：点击蓝字可以快速复制消息\n> 调用者ID：<qqbot-cmd-input text=\"" + _0x1bfac9.userId + " \" show=\"" + _0x1bfac9.userId + "\"/>\n\n" + (deps.config.globalAdv || "") + "\n";
    return withDisplayUnlockHint(_0x2056cf, _0x7d8633);
  }
  const _0x53e2fd = _0x4a75cd.blurb || "";
  const _0x30aaa0 = (_0x48d509.showAvatar && _0x4a75cd.avatar ? deps.import_koishi2.h.image(_0x4a75cd.avatar) : "") + "获取到该玩家信息：\n[用户ID] " + _0x4a75cd.userId + "\n[昵称] " + _0x1a5ae7 + "\n[用户名] " + _0x4a75cd.username + "\n[注册天数] " + (deps.media.getDateDiff(_0x4a75cd.joinDate).toString() || "已隐藏") + "\n[朋友数量] " + (_0x4a75cd.friendCount !== undefined ? _0x4a75cd.friendCount + "位" : "已隐藏") + "\n[粉丝数量] " + (_0x4a75cd.followerCount !== undefined ? _0x4a75cd.followerCount + "位" : "已隐藏") + "\n[关注数量] " + (_0x4a75cd.followingCount !== undefined ? _0x4a75cd.followingCount + "个" : "已隐藏") + "\n[账号描述] " + (_0x53e2fd.length > 40 ? _0x53e2fd.slice(0, 40) + "..." : _0x53e2fd || "无") + "\n[是否删除] " + (_0x4a75cd.isBanned ? "是" : "否") + "\n[是否验证用户] " + (_0x4a75cd.hasVerifiedBadge ? "已验证" : "未验证") + "\n[账号创建时间] " + (_0x4a75cd.joinDate ? deps.media.formatDate(_0x4a75cd.joinDate) : "未知") + (_0x4a75cd.presences?.userPresenceType !== undefined ? "\n[在线状态] " + _0x2cd115[_0x4a75cd.presences.userPresenceType] + "\n" : "") + (_0x4a75cd.presences?.lastLocation ? "----------------------\n[最后停留位置] " + deps.media.delStrUrl(_0x4a75cd.presences.lastLocation) + "\n" : "") + (_0x4a75cd.presences?.placeId ? "[Roblox地图ID] " + _0x4a75cd.presences.placeId + "\n" : "") + (_0x4a75cd.presences?.rootPlaceId ? "[根地图ID] " + _0x4a75cd.presences.rootPlaceId + "\n" : "") + (_0x4a75cd.presences?.universeId ? "[宇宙ID] " + _0x4a75cd.presences.universeId + "\n" : "") + (_0x4a75cd.presences?.gameId ? "[游戏实例ID] " + _0x4a75cd.presences.gameId + "\n" : "");
  return withDisplayUnlockHint(_0x30aaa0, _0x7d8633);
}
return { get displayUnlockHint() { return displayUnlockHint; },
get isDisplayAdmin() { return isDisplayAdmin; },
get getDisplayPriv() { return getDisplayPriv; },
get withDisplayUnlockHint() { return withDisplayUnlockHint; },
get prepareSearchText() { return prepareSearchText; },
get prepareSearchImage() { return prepareSearchImage; },
get prepareUserImages() { return prepareUserImages; },
get renderUserDetail() { return renderUserDetail; } };
};
