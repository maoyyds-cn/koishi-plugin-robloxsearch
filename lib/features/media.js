'use strict';

module.exports = function create(deps) {
const media = {
  delStrUrl(_0xec0d5f) {
    return _0xec0d5f.replace(/(https?:\/\/|www\.|ftp:\/\/)[^\s]+/g, "(网页链接)");
  },
  formatDate(_0x1f75aa) {
    const _0x4436c0 = new Date(_0x1f75aa);
    const _0x47631e = _0x4436c0.getFullYear();
    const _0x2a0f70 = _0x4436c0.getMonth() + 1;
    const _0x421ec0 = _0x4436c0.getDate();
    return _0x47631e + "年" + _0x2a0f70 + "月" + _0x421ec0 + "日";
  },
  getDateDiff(_0x3da5e8, _0x5bddb9 = new Date()) {
    const _0x3c9ae2 = new Date(_0x3da5e8);
    const _0x495b68 = new Date(_0x5bddb9);
    if (isNaN(_0x3c9ae2.getTime())) {
      console.error("无效的目标日期:", _0x3da5e8);
      return null;
    }
    if (isNaN(_0x495b68.getTime())) {
      console.error("无效的基准日期:", _0x5bddb9);
      return null;
    }
    const [_0xa50d50, _0x3072c2] = _0x3c9ae2 < _0x495b68 ? [_0x3c9ae2, _0x495b68] : [_0x495b68, _0x3c9ae2];
    let _0x3e1734 = _0x3072c2.getFullYear() - _0xa50d50.getFullYear();
    let _0x402439 = _0x3072c2.getMonth() - _0xa50d50.getMonth();
    let _0x4ccc6a = _0x3072c2.getDate() - _0xa50d50.getDate();
    if (_0x4ccc6a < 0) {
      const _0x2c9ce2 = new Date(_0x3072c2.getFullYear(), _0x3072c2.getMonth(), 0).getDate();
      _0x4ccc6a += _0x2c9ce2;
      _0x402439--;
    }
    if (_0x402439 < 0) {
      _0x402439 += 12;
      _0x3e1734--;
    }
    const _0x3d4132 = _0x3072c2.getTime() - _0xa50d50.getTime();
    const _0x19a5ef = Math.floor(_0x3d4132 / 86400000);
    return {
      years: _0x3e1734,
      months: _0x402439,
      days: _0x4ccc6a,
      totalDays: _0x19a5ef,
      toString: () => _0x19a5ef + " 天"
    };
  },
  async getTranslateData(_0x5dce71, _0x533450 = "auto", _0x518ddc = "zh") {
    const _0x48ba06 = {
      text: _0x5dce71,
      from: _0x533450,
      to: _0x518ddc
    };
    try {
      const _0x51116b = await deps.ctx.http.post("https://tools.mgtv100.com/external/v1/baidu_translate", _0x48ba06);
      if (deps.config.isExamine) {
        return await deps.imageAudit.checkText(_0x51116b.data?.trans_result.join("\n"));
      } else {
        return _0x51116b.data?.trans_result.join("\n");
      }
    } catch (_0x7bd1ca) {
      console.log(_0x7bd1ca);
      return "";
    }
  },
  async imageHosting(_0x4cf53d) {
    const _0xbase = (deps.config.imageProxyUrl || "").trim();
    if (!_0xbase) {
      return _0x4cf53d;
    }
    const _0xendpoint = _0xbase.replace(/\/+$/, "") + "/proxy/image";
    const _0xheaders = {};
    const _0xtoken = (deps.config.imageProxyToken || "").trim();
    if (_0xtoken) {
      _0xheaders.Authorization = "Bearer " + _0xtoken;
    }
    try {
      const _0x1d8a71 = await deps.ctx.http.post(_0xendpoint, {
        url: _0x4cf53d
      }, {
        headers: _0xheaders
      });
      if (_0x1d8a71.code == 0) {
        return _0x1d8a71.localUrl;
      } else {
        console.log(_0x1d8a71.error);
        return "";
      }
    } catch (_0x2fb4a7) {
      console.log(_0x2fb4a7);
      return "";
    }
  }
};
return { get media() { return media; } };
};
