'use strict';

module.exports = function create(deps) {
const legacySigninMethods = {
  async startSignin(_0x1a9c4d) {
    if (!(await deps.guardSignin(_0x1a9c4d, this.config))) return;
    await this.initUserInfo(_0x1a9c4d.userId);
    const _0x192c87 = new Date();
    const _0x1a4abe = _0x192c87.toLocaleDateString();
    const _0x7217d3 = this.userList[_0x1a9c4d.userId].siginTime;
    if (_0x1a4abe !== _0x7217d3) {
      this.userList[_0x1a9c4d.userId].siginTime = _0x1a4abe;
      const _0x3d8e92 = [6, 0];
      const _0x58d575 = _0x3d8e92.includes(_0x192c87.getDay()) ? 15 : 10;
      await this.giveUserPointsByUid(_0x1a9c4d.user.id, _0x58d575);
      await this.setLocalStorageData(_0x1a9c4d.userId);
      await deps.Chat.send(_0x1a9c4d, (_0x3d8e92.includes(_0x192c87.getDay()) ? "周末快乐！" : "") + "每日签到成功，奖励 " + _0x58d575 + "R点", undefined, deps.kb.pointsPanel());
    } else {
      await deps.Chat.send(_0x1a9c4d, "你已经签到过了，请明日再来");
    }
  }
};
return { get legacySigninMethods() { return legacySigninMethods; } };
};
