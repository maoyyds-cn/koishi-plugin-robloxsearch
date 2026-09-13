'use strict';

module.exports = function create(deps) {
var userLocal = {
  basePath: null,
  config: null,
  ctx: null,
  userList: {},
  async init(_0x3c9ec8, _0x15ef9b) {
    this.config = _0x15ef9b;
    this.ctx = _0x3c9ec8;
    if (!_0x15ef9b.useDatabase) {
      this.basePath = deps.import_path.default.join(_0x3c9ec8.localstorage.basePath, _0x15ef9b.basePath, "userSave");
      if (!deps.import_fs.default.existsSync(this.basePath)) {
        deps.import_fs.default.mkdirSync(this.basePath, {
          recursive: true
        });
      }
      const _0x239cee = await deps.import_promises.default.readdir(this.basePath);
      const _0x5166a6 = {};
      const _0x26f62b = {
        ok: 0,
        err: 0
      };
      const _0x3040f0 = _0x239cee.map(_0x58ab6e => {
        return new Promise(async _0x10aed8 => {
          try {
            _0x5166a6[_0x58ab6e] = JSON.parse(await _0x3c9ec8.localstorage.getItem(_0x15ef9b.basePath + "/userSave/" + _0x58ab6e));
            _0x26f62b.ok++;
            _0x10aed8(true);
          } catch (_0x46b130) {
            console.log(_0x46b130);
            _0x26f62b.err++;
            _0x10aed8(true);
          }
        });
      });
      await Promise.all(_0x3040f0);
      this.userList = _0x5166a6;
      console.log("roblox插件 用户数据加载完成，成功" + _0x26f62b.ok + "个，失败" + _0x26f62b.err + "个");
    } else {
      const _0x2429a4 = {};
      const _0x1cd87d = {
        ok: 0,
        err: 0
      };
      _0x3c9ec8.database.extend("smm_roblox_userLocal", {
        bindingId: "string",
        bindingName: "string",
        lastBindTime: "integer",
        siginTime: "string",
        translate: "boolean",
        userId: "string"
      }, {
        primary: "userId",
        autoInc: false
      });
      const _0x5f0ed9 = await _0x3c9ec8.database.get("smm_roblox_userLocal", {});
      _0x5f0ed9.forEach(_0x198c3d => {
        _0x2429a4[_0x198c3d.userId] = _0x198c3d;
        _0x1cd87d.ok++;
      });
      this.userList = _0x2429a4;
      console.log("roblox插件 从数据库加载用户数据完成，成功" + _0x1cd87d.ok + "个");
    }
  },
  async initUserInfo(_0x1a2876) {
    const _0x525e06 = {
      translate: false,
      bindingId: null,
      bindingName: null,
      lastBindTime: 0,
      siginTime: "0"
    };
    let _0x87f75 = false;
    if (!this.userList[_0x1a2876]) {
      this.userList[_0x1a2876] = _0x525e06;
      _0x87f75 = true;
    } else {
      Object.keys(_0x525e06).forEach(_0x541f1c => {
        if (this.userList[_0x1a2876][_0x541f1c] == undefined) {
          this.userList[_0x1a2876][_0x541f1c] = _0x525e06[_0x541f1c];
          _0x87f75 ||= true;
        }
      });
    }
    if (_0x87f75) {
      await this.setLocalStorageData(_0x1a2876);
    }
  },
  async openOrCloseTranslate(_0x1d5830, _0xb860d8) {
    const _0x46cd85 = _0x1d5830.userId;
    await this.initUserInfo(_0x46cd85);
    if (_0xb860d8) {
      if (this.userList[_0x46cd85].translate) {
        await deps.Chat.send(_0x1d5830, "<@" + _0x1d5830.userId + "> 您当前现在已经是开启自动翻译的状态。无需再次开启", "您现在已经是开启自动翻译的状态。无需再次开启");
      } else {
        this.userList[_0x46cd85].translate = true;
        this.setLocalStorageData(_0x46cd85);
        await deps.Chat.send(_0x1d5830, "<@" + _0x1d5830.userId + "> 开启翻译成功！", "开启成功！");
      }
    } else if (!this.userList[_0x46cd85].translate) {
      await deps.Chat.send(_0x1d5830, "<@" + _0x1d5830.userId + "> 您当前现在已经是关闭自动翻译的状态。无需再次关闭", "您现在已经是关闭自动翻译的状态。无需再次关闭");
    } else {
      this.userList[_0x46cd85].translate = false;
      this.setLocalStorageData(_0x46cd85);
      await deps.Chat.send(_0x1d5830, "<@" + _0x1d5830.userId + "> 关闭翻译成功！", "关闭成功！");
    }
  },
  async monetaryChartsList(_0x2a2d2e) {
    const _0x188891 = await userLocal.ctx.database.get("monetary", {}, {
      fields: ["uid", "value"],
      sort: {
        value: "desc"
      },
      limit: 10
    });
    const _0x436f37 = await userLocal.ctx.database.get("binding", {
      bid: _0x188891.map(_0x3f5ec0 => _0x3f5ec0.uid)
    });
    _0x188891.forEach(_0x582f58 => {
      const _0x1aa812 = _0x436f37.find(_0x4db773 => _0x4db773.aid == _0x582f58.uid);
      if (_0x1aa812?.pid) {
        _0x582f58.userid = _0x1aa812.pid;
        if (userLocal.userList[_0x1aa812.pid]?.bindingName) {
          _0x582f58.bindingName = userLocal.userList[_0x1aa812.pid].bindingName;
        }
      }
    });
    const _0x53029e = {
      0: "🥇",
      1: "🥈",
      2: "🥉"
    };
    const _0x200d43 = _0x188891.map((_0x4780f9, _0x20607f) => {
      return (_0x53029e[_0x20607f] || "🏅") + " " + (_0x4780f9.bindingName || "uid:" + (_0x4780f9.userid || "").slice(0, 5) + "...") + "   " + _0x4780f9.value + "R点" + (_0x4780f9.userid == _0x2a2d2e.userId ? " (你)" : "");
    }).join("\n");
    const _0x496c1e = _0x188891.map(_0x5972a8 => {
      const _0x576367 = _0x5972a8.bindingName || "uid:" + (_0x5972a8.userid || "").slice(0, 5) + "...";
      const _0x326162 = _0x5972a8.userid == _0x2a2d2e.userId ? " (你)" : "";
      const _0x40a7da = _0x5972a8.userid ? "![img #50px #50px](https://q.qlogo.cn/qqapp/102801826/" + _0x5972a8.userid + "/100)" : "—";
      return "| " + _0x40a7da + " | " + _0x576367 + " | " + _0x5972a8.value + _0x326162 + " |";
    }).join("\n");
    await deps.Chat.send(_0x2a2d2e, "获取成功！\n| 头像 | 用户 | R点 |\n|:---:|:---|---:|\n" + _0x496c1e + "\n> <@" + _0x2a2d2e.userId + "> tip: 若用户未绑定Roblox账号，默认展示该用户uid唯一标识", "获取成功！\n┌───积分排行榜───┐\n" + _0x200d43 + "\n└─────────────┘\ntip:若用户未绑定Roblox账号，默认展示该用户uid唯一标识", deps.kb.pointsPanel());
  },
  async _getUserInfoByUserId(_0x154f21, _0x1cfab3 = false) {
    try {
      const _0x112e28 = await deps.robloxApi.get("/query-userid/" + encodeURIComponent(_0x154f21) + "?update=" + _0x1cfab3);
      if (_0x112e28.data) {
        return {
          userId: _0x112e28.data.userId,
          userName: _0x112e28.data.username,
          blurb: _0x112e28.data.blurb,
          avatar: _0x112e28.data.avatar
        };
      } else {
        return null;
      }
    } catch (_0xd35954) {
      console.log(_0xd35954);
      return null;
    }
  },
  _getVerifyCode(_0x445b69 = 6) {
    const _0x2e2323 = [[19968, 25343], [25344, 30719], [13312, 19903]];
    let _0x15efc1 = "";
    for (let _0x58bf1c = 0; _0x58bf1c < _0x445b69; _0x58bf1c++) {
      const _0x5866b2 = _0x2e2323[Math.floor(Math.random() * _0x2e2323.length)];
      const [_0x1509e0, _0xf539d6] = _0x5866b2;
      const _0x34cef5 = Math.floor(Math.random() * (_0xf539d6 - _0x1509e0 + 1)) + _0x1509e0;
      _0x15efc1 += String.fromCharCode(_0x34cef5);
    }
    return _0x15efc1;
  },
  _getVerifyColorCode(_0x12a306 = 4) {
    const _0x596cb6 = ["red", "green", "blue", "yellow", "pink", "purple", "orange", "black", "white", "gray", "brown", "cyan", "magenta", "lime", "olive", "teal", "navy", "maroon", "silver", "gold"];
    const _0xcaef47 = [];
    for (let _0x2297c4 = 0; _0x2297c4 < _0x12a306; _0x2297c4++) {
      const _0x1fe561 = Math.floor(Math.random() * _0x596cb6.length);
      _0xcaef47.push(_0x596cb6[_0x1fe561]);
    }
    return _0xcaef47.join(" ");
  },
  _verifyBind(_0x394a78, _0x226147) {
    return _0x226147.includes(_0x394a78);
  },
  async _checkZHText(_0x4e22e0) {
    if (this.config.isExamine) {
      if (!_0x4e22e0 || !_0x4e22e0?.trim()) {
        return _0x4e22e0;
      }
      try {
        const _0xhdrs = { "Content-Type": "application/json" };
        const _0xtkn = (this.config?.textAuditToken || "").trim();
        if (_0xtkn) {
          _0xhdrs.Authorization = "Bearer " + _0xtkn;
        }
        const _0x27d15a = await this.ctx.http.post("https://uapis.cn/api/v1/text/profanitycheck", {
          text: _0x4e22e0
        }, {
          headers: _0xhdrs
        });
        if (_0x27d15a.status === "ok") {
          return _0x27d15a.masked_text;
        }
        return _0x4e22e0;
      } catch (_0x5de58f) {
        if (this.config.deBug) {
          console.log(_0x5de58f);
        }
        return _0x4e22e0;
      }
    } else {
      return _0x4e22e0;
    }
  },
  isTranslate(_0x222496) {
    this.initUserInfo(_0x222496);
    return this.userList[_0x222496]?.translate;
  },
  async giveUserPointsByUid(_0x1f3a31, _0x4ae283) {
    const [_0x5a0e87] = await this.ctx.database.get("monetary", {
      uid: _0x1f3a31
    });
    if (!_0x5a0e87) {
      await this.ctx.monetary.gain(_0x1f3a31, 0);
    }
    await this.ctx.monetary.gain(_0x1f3a31, _0x4ae283);
  },
  async setLocalStorageData(_0x11b637) {
    if (!userLocal.config.useDatabase) {
      const _0x2d642e = this.userList[_0x11b637];
      await deps.queuedSetItem(this.ctx, this.config.basePath + "/userSave/" + _0x11b637, JSON.stringify(_0x2d642e));
    } else {
      const _0x462197 = {
        ...this.userList[_0x11b637]
      };
      console.log(_0x462197);
      _0x462197.userId = _0x11b637;
      const [_0x3f4956] = await userLocal.ctx.database.get("smm_roblox_userLocal", {
        userId: _0x11b637
      });
      if (_0x3f4956) {
        delete _0x462197.userId;
        await userLocal.ctx.database.set("smm_roblox_userLocal", {
          userId: _0x11b637
        }, _0x462197);
      } else {
        await userLocal.ctx.database.create("smm_roblox_userLocal", _0x462197);
      }
    }
  }
};
return { get userLocal() { return userLocal; }, set userLocal(value) { userLocal = value; } };
};
