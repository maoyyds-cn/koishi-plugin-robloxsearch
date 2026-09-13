'use strict';

module.exports = function create(deps) {
const imageAudit = {
  async checkImage(_0x22953e, _0x179e26) {
    if (!deps.config.useImageAudit) {
      return _0x22953e;
    }
    const _0x11f37e = await this._checkImage(_0x22953e);
    if (_0x11f37e !== _0x22953e && _0x179e26) {
      await deps.queryFlow.sensitive(_0x179e26.session, {
        targetId: _0x179e26.targetId,
        targetType: _0x179e26.targetType,
        targetName: _0x179e26.targetName,
        reason: _0x179e26.reason || "图像审核命中敏感内容",
        summary: ("图片拦截：" + (_0x179e26.targetType || "") + " " + (_0x179e26.targetName || _0x179e26.targetId || "")).trim(),
        pic: _0x22953e,
        auditSource: "image_audit"
      });
    }
    return _0x11f37e;
  },
  async _checkImage(_0x4ab57d) {
    if (deps.config.tencentSecretId && deps.config.tencentSecretKey && deps.config.tencentBucket) {
      return await this._checkImageOwn(_0x4ab57d);
    }
    try {
      const _0x329dd9 = await deps.ctx.http.get(_0x4ab57d, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });
      const _0x5aeb17 = ["ap-hongkong", "ap-chengdu"];
      let _0x44c3b1 = "";
      for (const _0x4e7f8a of _0x5aeb17) {
        try {
          const _0x21dab8 = await deps.ctx.http.get("https://ci-exhibition.cloud.tencent.com/samples/createUploadKey?ext=jpg&ciProcess=sensitive-content-recognition&region=" + _0x4e7f8a);
          const _0x2cd948 = _0x21dab8.data ?? _0x21dab8;
          if (!_0x2cd948) {
            continue;
          }
          const _0x45fd98 = "https://ci-h5-demo-1258125638.cos." + _0x4e7f8a + ".myqcloud.com/" + _0x2cd948.key;
          await deps.ctx.http.put(_0x45fd98, _0x329dd9, {
            headers: {
              Authorization: _0x2cd948.uploadAuthorization,
              "Content-Type": "image/jpeg",
              "x-cos-storage-class": "STANDARD"
            }
          });
          const _0x572a9b = new URL("https://ci-h5-demo-1258125638.cos." + _0x4e7f8a + ".myqcloud.com/" + _0x2cd948.key);
          _0x572a9b.searchParams.set("ci-process", "sensitive-content-recognition");
          _0x572a9b.searchParams.set("detect-type", "porn,terrorist,politics,ads");
          const _0x529085 = _0x572a9b.href + "&" + _0x2cd948.ciProcessAuthorization;
          const _0x2fdd57 = await deps.ctx.http.get(_0x529085, {
            responseType: "text"
          });
          if (/<Result>0<\/Result>/.test(_0x2fdd57)) {
            _0x44c3b1 = _0x4ab57d;
          } else {
            _0x44c3b1 = "https://smmcat.cn/wp-content/uploads/2026/06/5x5-err.png";
          }
          break;
        } catch (_0x5e1a2b) {}
      }
      return _0x44c3b1 || _0x4ab57d;
    } catch (_0x174c5) {
      deps.ctx.logger?.warn?.("图片审核异常：", _0x174c5);
      return _0x4ab57d;
    }
  },
  async _checkImageOwn(_0x4ab57d) {
    let _0xuploaded = false;
    let _0xcr;
    let _0xnl;
    let _0xsid;
    let _0xskey;
    let _0xkey;
    let _0xkt;
    let _0xcos;
    let _0xresult = _0x4ab57d;
    try {
      _0xcr = require("crypto");
      _0xnl = String.fromCharCode(10);
      _0xsid = deps.config.tencentSecretId;
      _0xskey = deps.config.tencentSecretKey;
      const _0xbkt = deps.config.tencentBucket;
      const _0xreg = deps.config.tencentRegion || "ap-hongkong";
      _0xkey = "audit/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
      const _0xbuf = await deps.ctx.http.get(_0x4ab57d, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });
      const _0xnow = Math.floor(Date.now() / 1000);
      const _0xexp = _0xnow + 600;
      _0xkt = _0xnow + ";" + _0xexp;
      const _0xsk = _0xcr.createHmac("sha1", _0xskey).update(_0xkt).digest("hex");
      const _0xsl = "put" + _0xnl + "/" + _0xkey + _0xnl + _0xnl + _0xnl;
      const _0xslh = _0xcr.createHash("sha1").update(_0xsl).digest("hex");
      const _0xsts = "sha1" + _0xnl + _0xkt + _0xnl + _0xslh + _0xnl;
      const _0xsig = _0xcr.createHmac("sha1", _0xsk).update(_0xsts).digest("hex");
      const _0xauth = "q-sign-algorithm=sha1&q-ak=" + _0xsid + "&q-sign-time=" + _0xkt + "&q-key-time=" + _0xkt + "&q-header-list=&q-url-param-list=&q-signature=" + _0xsig;
      _0xcos = "https://" + _0xbkt + ".cos." + _0xreg + ".myqcloud.com/" + _0xkey;
      await deps.ctx.http.put(_0xcos, Buffer.from(_0xbuf), {
        headers: {
          Authorization: _0xauth,
          "Content-Type": "image/jpeg"
        }
      });
      _0xuploaded = true;
      const _0xsk2 = _0xcr.createHmac("sha1", _0xskey).update(_0xkt).digest("hex");
      const _0xsl2 = "get" + _0xnl + "/" + _0xkey + _0xnl + "ci-process=sensitive-content-recognition&detect-type=porn%2Cterrorist%2Cpolitics%2Cads" + _0xnl + _0xnl;
      const _0xslh2 = _0xcr.createHash("sha1").update(_0xsl2).digest("hex");
      const _0xsts2 = "sha1" + _0xnl + _0xkt + _0xnl + _0xslh2 + _0xnl;
      const _0xsig2 = _0xcr.createHmac("sha1", _0xsk2).update(_0xsts2).digest("hex");
      const _0xauth2 = "q-sign-algorithm=sha1&q-ak=" + _0xsid + "&q-sign-time=" + _0xkt + "&q-key-time=" + _0xkt + "&q-header-list=&q-url-param-list=ci-process;detect-type&q-signature=" + _0xsig2;
      const _0xaurl = _0xcos + "?ci-process=sensitive-content-recognition&detect-type=porn%2Cterrorist%2Cpolitics%2Cads";
      const _0xxml = await deps.ctx.http.get(_0xaurl, {
        responseType: "text",
        headers: {
          Authorization: _0xauth2
        }
      });
      _0xresult = new RegExp("<Result>0</Result>").test(_0xxml) ? _0x4ab57d : "https://smmcat.cn/wp-content/uploads/2026/06/5x5-err.png";
    } catch (_0xerr) {
      console.log("[image audit] own credentials failed:", _0xerr?.message || String(_0xerr));
      _0xresult = _0x4ab57d;
    } finally {
      if (_0xuploaded) {
        try {
          const _0xdsk = _0xcr.createHmac("sha1", _0xskey).update(_0xkt).digest("hex");
          const _0xdsl = "delete" + _0xnl + "/" + _0xkey + _0xnl + _0xnl + _0xnl;
          const _0xdslh = _0xcr.createHash("sha1").update(_0xdsl).digest("hex");
          const _0xdsts = "sha1" + _0xnl + _0xkt + _0xnl + _0xdslh + _0xnl;
          const _0xdsig = _0xcr.createHmac("sha1", _0xdsk).update(_0xdsts).digest("hex");
          const _0xdauth = "q-sign-algorithm=sha1&q-ak=" + _0xsid + "&q-sign-time=" + _0xkt + "&q-key-time=" + _0xkt + "&q-header-list=&q-url-param-list=&q-signature=" + _0xdsig;
          await deps.ctx.http.delete(_0xcos, {
            headers: {
              Authorization: _0xdauth
            }
          });
        } catch (_0xcleanupErr) {
          console.log("[image audit] cleanup failed:", _0xcleanupErr?.message || String(_0xcleanupErr));
        }
      }
    }
    return _0xresult;
  },
  async checkText(_0x5b78bd) {
    const _0x348efa = await deps.outputAudit.auditText(_0x5b78bd);
    return _0x348efa.text;
  }
};
return { get imageAudit() { return imageAudit; } };
};
