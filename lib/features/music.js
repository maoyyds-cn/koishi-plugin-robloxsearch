'use strict';

module.exports = function create(deps) {
var delay2 = _0x43cef9 => new Promise(_0x174203 => setTimeout(_0x174203, _0x43cef9));
var temp = {};
var MusicCtx = {
  ctx: null,
  config: null,
  musicList: [],
  async init(_0x2d8745, _0x324f3d, _0x5ad339) {
    this.ctx = _0x2d8745;
    this.config = _0x324f3d;
    this.imageHosting = _0x5ad339;
    this.getMusicListData();
  },
  async getMusicListData() {
    try {
      const _0x43529e = await deps.robloxHttp.get("https://apis.rotunnel.com/music-discovery/v1/top-songs?pageToken=0&limit=100");
      if (_0x43529e.songs?.length) {
        const _0x52fb3a = _0x43529e.songs;
        const _0xa6bb5b = _0x52fb3a.map(_0x39b619 => _0x39b619.albumArtAssetId).filter(_0x11dc0d => _0x11dc0d);
        const _0x3100bc = _0xa6bb5b.splice(0, 50);
        const _0x25abe2 = _0xa6bb5b.splice(0, 50);
        const _0x42c0dc = await deps.robloxHttp.get("https://thumbnails.rotunnel.com/v1/assets?assetIds=" + _0x3100bc.join(",") + "&returnPolicy=PlaceHolder&size=512x512&format=webp");
        await delay2(3000);
        const _0x138999 = await deps.robloxHttp.get("https://thumbnails.rotunnel.com/v1/assets?assetIds=" + _0x25abe2.join(",") + "&returnPolicy=PlaceHolder&size=512x512&format=webp");
        const _0x36a1d6 = [...(_0x42c0dc.data ? _0x42c0dc.data : []), ...(_0x138999.data ? _0x138999.data : [])];
        _0x36a1d6.forEach(_0x1572a8 => {
          const _0x29aad4 = _0x52fb3a.find(_0x5e681b => _0x5e681b.albumArtAssetId == _0x1572a8.targetId);
          if (_0x29aad4) {
            _0x29aad4.imageUrl = _0x1572a8.imageUrl;
          }
        });
        console.log("获取音乐数据完成，一共" + _0x52fb3a.length + "条数据");
        MusicCtx.musicList = _0x52fb3a;
      }
    } catch (_0x182caf) {
      console.error(_0x182caf.message);
    }
  },
  async getMsuicDetail(_0x375f1e, _0x303493) {
    const _0x54d55f = await deps.robloxHttp.post("https://assetdelivery.roblox.com/v1/assets/batch", {
      requestId: _0x375f1e,
      assetId: _0x303493
    }, {
      headers: {
        "x-csrf-token": ""
      }
    });
  },
  async getRandomMsuicInfo(_0xc5d7b5) {
    const _0x5c7191 = MusicCtx.config?.useMd;
    if (temp[_0xc5d7b5.userId]) {
      await deps.Chat.send(_0xc5d7b5, _0x5c7191 ? "<@" + _0xc5d7b5.userId + "> **请等待上一个请求...**" : "请等待上一个请求...");
      return;
    }
    try {
      temp[_0xc5d7b5.userId] = true;
      const _0x4ff5ce = MusicCtx.musicList[random(0, MusicCtx.musicList.length)];
      console.log(_0x4ff5ce);
      await deps.Chat.send(_0xc5d7b5, _0x5c7191 ? "<@" + _0xc5d7b5.userId + "> **稍等，正在获取随机音乐...**" : "稍等，正在获取随机音乐...");
      if (_0x5c7191) {
        if (!_0x4ff5ce.imageUrl && _0x4ff5ce.albumArtAssetId) {
          try {
            const _0x18fef3 = await deps.robloxHttp.get("https://thumbnails.rotunnel.com/v1/assets?assetIds=" + _0x4ff5ce.albumArtAssetId + "&returnPolicy=PlaceHolder&size=512x512&format=webp");
            const _0x5267fb = _0x18fef3.data?.find(_0x383161 => _0x383161.targetId == _0x4ff5ce.albumArtAssetId);
            if (_0x5267fb?.imageUrl) {
              _0x4ff5ce.imageUrl = _0x5267fb.imageUrl;
            }
          } catch (_0x16afa4) {
            console.error(_0x16afa4.message);
          }
        }
        const _0x2f7f0d = _0x4ff5ce.imageUrl && MusicCtx.imageHosting ? await MusicCtx.imageHosting(_0x4ff5ce.imageUrl) : "";
        await deps.Chat.send(_0xc5d7b5, (_0x2f7f0d ? "![img #300px #300px](" + _0x2f7f0d + ")\n" : "") + "- 专辑名 **" + (_0x4ff5ce.album || "无") + "**\n- 歌曲名 **" + (_0x4ff5ce.title || "无") + "**\n- 音乐ID **<qqbot-cmd-input text=\"" + _0x4ff5ce.albumArtAssetId + "\" show=\"" + _0x4ff5ce.albumArtAssetId + "\"/>**\n- 播放时长 **" + Math.floor(_0x4ff5ce.duration / 60) + "分" + _0x4ff5ce.duration % 60 + "秒**\n- 作者 **" + _0x4ff5ce.artist + "**", undefined, deps.kb.musicAgain());
      } else {
        await _0xc5d7b5.send(deps.import_koishi.h.image(_0x4ff5ce.imageUrl) + ("" + (_0x4ff5ce.album ? "[专辑名] " + _0x4ff5ce.album + "\n" : "") + (_0x4ff5ce.title ? "[歌曲名] " + _0x4ff5ce.title + "\n" : "") + "[音乐ID] " + _0x4ff5ce.albumArtAssetId + "\n[播放时长] " + (Math.floor(_0x4ff5ce.duration / 60) + "分" + _0x4ff5ce.duration % 60 + "秒") + "\n[作者] " + _0x4ff5ce.artist + "\n"));
      }
      await deps.Chat.send(_0xc5d7b5, _0x5c7191 ? "<@" + _0xc5d7b5.userId + "> [×] 该音频暂时不支持播放，敬请期待" : "[×] 该音频暂时不支持播放，敬请期待");
    } catch (_0x115aac) {
      console.log(_0x115aac);
    } finally {
      delete temp[_0xc5d7b5.userId];
    }
  }
};
function random(_0xab480f, _0x1b5bb8) {
  return Math.floor(Math.random() * (_0x1b5bb8 - _0xab480f) + _0xab480f);
}
return { get delay2() { return delay2; }, set delay2(value) { delay2 = value; },
get temp() { return temp; }, set temp(value) { temp = value; },
get MusicCtx() { return MusicCtx; }, set MusicCtx(value) { MusicCtx = value; },
get random() { return random; } };
};
