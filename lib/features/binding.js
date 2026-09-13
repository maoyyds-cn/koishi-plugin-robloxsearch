'use strict';

module.exports = function create(deps) {
const bindingMethods = {
  async bindStatistics(_0x6fb393) {
    const _0x36e869 = Object.values(this.userList);
    const _0x811cac = _0x36e869.length;
    const _0x5dfbc4 = _0x36e869.filter(_0x1236ab => _0x1236ab.bindingId).length;
    const _0x295cbb = new Set(_0x36e869.map(_0x5c65ad => _0x5c65ad.bindingId).filter(_0x26c413 => _0x26c413)).size;
    const _0x3fe881 = _0x36e869.filter(_0x245683 => _0x245683.bindingId || _0x245683.lastBindTime > 0).length;
    await deps.Chat.send(_0x6fb393, "<@" + _0x6fb393.userId + "> 这是目前的统计数据：\n- 累计绑定用户数：**" + _0x5dfbc4 + "个**\n- 使用用户总数：**" + _0x811cac + "个**\n- 累计绑定Roblox账号数：**" + _0x295cbb + "个**\n- 累计绑定Roblox账号数（包含解绑）：**" + _0x3fe881 + "个**", "这是目前的统计数据：\n\n[累计绑定用户数]：" + _0x5dfbc4 + "个\n[使用用户总数]：" + _0x811cac + "个\n[累计绑定Roblox账号数]：" + _0x295cbb + "个\n[累计绑定Roblox账号数（包含解绑）]：" + _0x3fe881 + "个");
  },
  async startBindOperate(_0x1dbe37, _0x76bf59) {
    await this.initUserInfo(_0x1dbe37.userId);
    if (!deps.Roles.isAdmin(_0x1dbe37.userId)) {
      if (+new Date() - this.userList[_0x1dbe37.userId].lastBindTime < 86400000) {
        await deps.Chat.send(_0x1dbe37, "[×] 操作失败，不允许24小时内重新进行绑定操作");
        return;
      }
    }
    const _0x32101e = Object.values(this.userList).map(_0x717bd2 => _0x717bd2.bindingId).filter(_0x3fef47 => _0x3fef47);
    const _0x317622 = {};
    _0x32101e.forEach(_0x21c23d => {
      if (!_0x317622[_0x21c23d]) {
        _0x317622[_0x21c23d] = 0;
      }
      _0x317622[_0x21c23d]++;
    });
    if (_0x317622[_0x76bf59] >= 2) {
      if (deps.userLocal.config.useMd) {
        await deps.Chat.send(_0x1dbe37, "[×] 因超过上限绑定失败，该Roblox账号目前已经与2个QQ账号绑定。\n如若需要，可解除某个账号的绑定，或者联系我们的社区管理员进行解绑");
      } else {
        await deps.Chat.send(_0x1dbe37, "[×] 因超过上限绑定失败，该Roblox账号目前已经与2个QQ账号绑定。\n如若需要，可解除某个账号的绑定，或者联系我们的社区管理员进行解绑");
      }
      return;
    }
    const _0x5a24ab = deps.bindTemp.checkUse(_0x1dbe37);
    if (_0x5a24ab.code) {
      await deps.Chat.send(_0x1dbe37, _0x5a24ab.msg);
      return;
    }
    if (this.userList[_0x1dbe37.userId].bindingId) {
      if (deps.userLocal.config.useMd) {
        await deps.Chat.send(_0x1dbe37, "❗您的账号目前已经与 **" + this.userList[_0x1dbe37.userId].bindingId + "** 绑定。如需解绑，请发送 <qqbot-cmd-input text=\"/解除绑定\" show=\"解除绑定\"/>");
        return;
      } else {
        await deps.Chat.send(_0x1dbe37, "[×] 您的账号目前已经与 " + this.userList[_0x1dbe37.userId].bindingId + " 绑定。如需解绑，请发送 /解除绑定");
        return;
      }
    }
    if (deps.userLocal.config.useMd) {
      await deps.Chat.send(_0x1dbe37, "<@" + _0x1dbe37.userId + "> 请稍等，正在进行绑定操作...");
    } else {
      await deps.Chat.send(_0x1dbe37, "稍等，正在进行绑定操作...");
    }
    deps.bindTemp.startBind(_0x1dbe37);
    try {
      const _0x2445bd = await this._getUserInfoByUserId(_0x76bf59);
      if (!_0x2445bd) {
        await deps.Chat.send(_0x1dbe37, "[×] 未找到绑定的目标，请确认 userId 是否写对？\n可以使用 /用户ID搜索 来确认是否输入正确");
        deps.bindTemp.clearUse(_0x1dbe37);
        return;
      }
      const _0x1b3861 = (await this._checkZHText(deps.delStrUrl(_0x2445bd.userName))) || _0x2445bd.userName;
      const _0x5213f8 = 3;
      const _0xf6c9c1 = 3;
      let _0x54b66f = _0x5213f8 * 60000 / _0xf6c9c1;
      const _0x4ce953 = this._getVerifyColorCode();
      let _0x13ebe4 = false;
      if (deps.userLocal.config.useMd) {
        await deps.Chat.send(_0x1dbe37, "\n<@" + _0x1dbe37.userId + "> 您当前正在绑定账号：\n- 用户名：**" + _0x1b3861 + "**\n- 用户ID：**" + _0x2445bd.userId + "**\n请于**" + _0x5213f8 + "**分钟内在当前账号**Roblox个人简介**中添加下面验证码，用于完成账号的验证绑定。\n验证码：\n<qqbot-cmd-input text=\"" + _0x4ce953 + "\" show=\"" + _0x4ce953 + " （点击复制）\"/>\n[如不会操作请点此查看绑定教程](https://pd.qq.com/s/8xuw4lcvz?b=2)\n```添加验证码后请等待1-3分钟，机器人将自动完成绑定！```\n    ", undefined, deps.kb.bindVerify(_0x1dbe37.userId, _0x4ce953));
      } else {
        await deps.Chat.send(_0x1dbe37, "正在进行账号绑定业务，请于" + _0x5213f8 + "分钟内在Roblox个人简介中添加下行验证码，用于完成账号的验证绑定。");
        await deps.Chat.send(_0x1dbe37, "" + _0x4ce953);
        await deps.Chat.send(_0x1dbe37, "[当前待绑定的信息]\n账号名：" + _0x1b3861 + "\n账号ID：" + _0x2445bd.userId + "\n\n如不会操作请查看此教程：https://pd.qq.com/s/8xuw4lcvz?b=2\n\n[❗]添加验证码后请等待1-" + _0xf6c9c1 + "分钟，机器人将自动完成验证！");
      }
      for (let _0x2c9c6f = 0; _0x2c9c6f <= _0xf6c9c1; _0x2c9c6f++) {
        await deps.delay(_0x54b66f);
        const _0x2bf3bd = await this._getUserInfoByUserId(_0x76bf59, true);
        if (this._verifyBind(_0x4ce953, _0x2bf3bd?.blurb || "")) {
          this.userList[_0x1dbe37.userId].lastBindTime = +new Date();
          this.userList[_0x1dbe37.userId].bindingId = _0x2bf3bd.userId;
          this.userList[_0x1dbe37.userId].bindingName = _0x2bf3bd.userName;
          this.userList[_0x1dbe37.userId].userId = _0x76bf59;
          _0x13ebe4 = true;
          this.setLocalStorageData(_0x1dbe37.userId);
          break;
        }
      }
      if (deps.userLocal.config.useMd) {
        await deps.Chat.send(_0x1dbe37, _0x13ebe4 ? "<@" + _0x1dbe37.userId + "> ✅ 绑定成功，您当前绑定的账号ID为：**" + _0x2445bd.userId + "**" : "<@" + _0x1dbe37.userId + "> ❌ 绑定失败，**未检测到账号简介包含验证码**，请检查账号简介是否**正确**添加验证码。");
      } else {
        await deps.Chat.send(_0x1dbe37, _0x13ebe4 ? "[√] 绑定成功，您当前绑定的账号ID为：" + _0x2445bd.userId : "[×] 绑定失败，未检测到账号简介包含验证码");
      }
      deps.bindTemp.clearUse(_0x1dbe37);
    } catch (_0x1f53eb) {
      console.log(_0x1f53eb);
      deps.bindTemp.clearUse(_0x1dbe37);
    }
  },
  async startRemoveBind(_0x108218) {
    await this.initUserInfo(_0x108218.userId);
    if (!this.userList[_0x108218.userId].bindingId) {
      await deps.Chat.send(_0x108218, "<@" + _0x108218.userId + "> [×] 您还未绑定任何账号，如若需要绑定账号。请发送 <qqbot-cmd-input text=\"/绑定Roblox账号\" show=\"绑定账号\"/>", "[×] 您还未绑定过任何账号，如若需要绑定账号。请发送 /绑定Roblox账号");
      return;
    }
    const _0x14eece = deps.bindTemp.checkUse(_0x108218);
    if (_0x14eece.code) {
      await deps.Chat.send(_0x108218, _0x14eece.msg);
      return;
    }
    await deps.Chat.send(_0x108218, "<@" + _0x108218.userId + "> [?] 是否要移除 smm 的绑定信息？\n(20秒内回复 是 则进行解绑，否则任意回复内容)", "[?] 是否要移除 smm 的绑定信息？\n(20秒内回复 是 则进行解绑，否则任意回复内容)", deps.kb.unbindConfirm());
    const _0xb21171 = await _0x108218.prompt(20000);
    if (_0xb21171 === undefined) {
      return;
    }
    if (_0xb21171 !== "是") {
      await deps.Chat.send(_0x108218, "[×] 用户已取消解绑操作，解绑失败。");
      return;
    }
    this.userList[_0x108218.userId].bindingId = null;
    this.userList[_0x108218.userId].bindingName = null;
    this.setLocalStorageData(_0x108218.userId);
    await deps.Chat.send(_0x108218, "[√] 解绑成功！");
  }
};
return { get bindingMethods() { return bindingMethods; } };
};
