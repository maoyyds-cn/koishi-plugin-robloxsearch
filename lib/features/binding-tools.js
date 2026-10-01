'use strict';

module.exports = function create(deps) {
function delay(_0x28a1d4) {
  return new Promise(_0x130e33 => setTimeout(_0x130e33, _0x28a1d4));
}
function delStrUrl(_0x3dbe77) {
  return _0x3dbe77.replace(/(https?:\/\/|www\.|ftp:\/\/)[^\s]+/g, "(网页链接)");
}
var bindTemp = {
  userList: {},
  waitTime: 60000,
  maxQueryNum: 5,
  initUse(_0x2909bf) {
    this.prune();
    if (!this.userList[_0x2909bf]) {
      this.userList[_0x2909bf] = {
        timer: 0,
        num: 0,
        use: false
      };
    }
  },
  // 清理长期不再活动的记录，避免 userList 随用户数无界增长。
  // 保留仍处于限流窗口内的记录（近期有活动），否则会削弱限流。
  prune() {
    const _0x1a2c7b = Object.keys(this.userList);
    if (_0x1a2c7b.length < 1000) {
      return;
    }
    const _0x2e8d19 = +new Date() - this.waitTime;
    for (const _0x3f6a2c of _0x1a2c7b) {
      const _0x5b1e73 = this.userList[_0x3f6a2c];
      if (_0x5b1e73 && !_0x5b1e73.use && _0x5b1e73.timer < _0x2e8d19) {
        delete this.userList[_0x3f6a2c];
      }
    }
  },
  startBind(_0x5c46e0) {
    // 统一以 userId 为键：initUse/checkUse/clearUse 均使用 userId，
    // 若此处用 username 建键会产生一条永不被使用的僵尸记录，
    // 且 userId 记录可能尚未初始化导致报错。
    this.initUse(_0x5c46e0.userId);
    this.userList[_0x5c46e0.userId].num++;
    this.userList[_0x5c46e0.userId].use = true;
  },
  checkUse(_0x4d3588) {
    const _0x3e5b9f = _0x4d3588.userId;
    this.initUse(_0x3e5b9f);
    if (+new Date() - this.userList[_0x3e5b9f].timer > this.waitTime) {
      this.userList[_0x3e5b9f].timer = +new Date();
      this.userList[_0x3e5b9f].num = 0;
    }
    if (this.userList[_0x3e5b9f].num >= 5) {
      return {
        code: true,
        msg: "您已经超过单时段最大请求绑定次数，请耐心等待.."
      };
    }
    if (this.userList[_0x4d3588.userId].use) {
      return {
        code: true,
        msg: "请等待当前验证完成。"
      };
    } else {
      return {
        code: false,
        msg: ""
      };
    }
  },
  clearUse(_0x5abe0b) {
    this.userList[_0x5abe0b.userId].use = false;
  }
};
return { get delay() { return delay; },
get delStrUrl() { return delStrUrl; },
get bindTemp() { return bindTemp; }, set bindTemp(value) { bindTemp = value; } };
};
