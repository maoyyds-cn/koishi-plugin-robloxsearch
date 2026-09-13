'use strict';

module.exports = function create(deps) {
function stripMarkdown(_0x320818) {
  return _0x320818.replace(/```[\s\S]*?```/g, _0x11d209 => _0x11d209.replace(/```\w*\n?/g, "").trim()).replace(/`([^`]*)`/g, "$1").replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1 ($2)").replace(/^#{1,6}\s+/gm, "").replace(/(\*\*|__)(.*?)\1/g, "$2").replace(/(\*|_)(.*?)\1/g, "$2").replace(/^\s*>\s?/gm, "").replace(/^\s*[-*+]\s+/gm, "· ").trim();
}
var MAX_PER_TRIGGER = 3;
var inFlight = new Set();
function formatAnnouncementMarkdown(_0x2f7d8a) {
  return "## 📢 " + _0x2f7d8a.title + "\n" + _0x2f7d8a.content;
}
function formatAnnouncementText(_0x4913aa) {
  return "【公告】" + _0x4913aa.title + "\n" + stripMarkdown(_0x4913aa.content);
}
function resolveUserLevel(_0x162d24) {
  return deps.pointsStore.get(_0x162d24)?.level ?? 0;
}
async function deliverAnnouncements(_0x5c61bf, _0xc31867) {
  const _0x4047ad = _0x5c61bf.userId;
  if (!_0x4047ad || inFlight.has(_0x4047ad)) {
    return;
  }
  inFlight.add(_0x4047ad);
  try {
    const _0x3d290a = resolveUserLevel(_0x4047ad);
    const _0x5dd408 = deps.announcementStore.pendingFor(_0x4047ad, _0x3d290a).slice(0, MAX_PER_TRIGGER);
    for (const _0x1e295f of _0x5dd408) {
      await deps.announcementStore.markTriggered(_0x1e295f.id, _0x4047ad);
      try {
        await deps.Chat.send(_0x5c61bf, formatAnnouncementMarkdown(_0x1e295f), formatAnnouncementText(_0x1e295f));
      } catch (_0x44092e) {
        if (_0xc31867.deBug) {
          console.log("[announcement] 发送失败", _0x1e295f.id, _0x44092e);
        }
      }
    }
  } finally {
    inFlight.delete(_0x4047ad);
  }
}
return { get stripMarkdown() { return stripMarkdown; },
get MAX_PER_TRIGGER() { return MAX_PER_TRIGGER; }, set MAX_PER_TRIGGER(value) { MAX_PER_TRIGGER = value; },
get inFlight() { return inFlight; }, set inFlight(value) { inFlight = value; },
get formatAnnouncementMarkdown() { return formatAnnouncementMarkdown; },
get formatAnnouncementText() { return formatAnnouncementText; },
get resolveUserLevel() { return resolveUserLevel; },
get deliverAnnouncements() { return deliverAnnouncements; } };
};
