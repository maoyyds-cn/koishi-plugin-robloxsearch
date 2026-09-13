'use strict';

module.exports = function create(deps) {
var GiftCode = {
  ctx: null,
  config: null,
  async init(_0x5e4f07, _0xc7f95e) {
    this.ctx = _0x5e4f07;
    this.config = _0xc7f95e;
    _0x5e4f07.model.extend("roblox_giftCode", {
      id: "unsigned",
      code: {
        type: "string",
        length: 255,
        nullable: false
      },
      note: {
        type: "string",
        length: 255,
        initial: ""
      },
      monetary: "integer",
      revision: {
        type: "unsigned",
        initial: 0,
        nullable: false
      },
      use: {
        type: "boolean",
        initial: true,
        nullable: false
      },
      validityDay: {
        type: "integer",
        initial: -1
      },
      total: {
        type: "integer",
        initial: Infinity
      },
      createdAt: {
        type: "timestamp",
        initial: new Date()
      },
      useTime: {
        type: "timestamp",
        initial: new Date()
      }
    }, {
      primary: "id",
      autoInc: true,
      unique: ["code"]
    });
    _0x5e4f07.model.extend("roblox_giftHistory", {
      id: "unsigned",
      code: {
        type: "string",
        length: 255,
        nullable: false
      },
      userid: {
        type: "string",
        length: 255
      },
      getTime: {
        type: "timestamp",
        initial: new Date()
      }
    }, {
      primary: "id",
      autoInc: true,
      foreign: {
        code: ["roblox_giftCode", "code"]
      }
    });
  },
  async addGiftCode(_0x39f316, _0x1482cd, _0x3a7bb4, _0xc91dd0, _0xed51e4, _0x5ed085) {
    if (!deps.Roles.isAdmin(_0x39f316.userId)) {
      await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> [×] 非常抱歉！您并非管理员，无法添加兑换码！", "[×] 非常抱歉！您并非管理员，无法添加兑换码！");
      return;
    }
    let _0x472b49 = 0;
    if (!_0x1482cd) {
      await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> 请输入要添加的兑换码（20s）：", "请输入要添加的兑换码（20s）：");
      _0x1482cd = await _0x39f316.prompt(20000);
      if (_0x1482cd == undefined) {
        return;
      }
      const [_0x30d739] = await GiftCode.ctx.database.get("roblox_giftCode", {
        code: _0x1482cd.toUpperCase()
      });
      if (_0x30d739) {
        await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> [×] 不能重复添加！目前已存在该兑换码，如需再次添加请删除该旧的兑换码信息。", "[×] 不能重复添加！目前已存在该兑换码，如需再次添加请删除该旧的兑换码信息。");
        return;
      }
    }
    if (!_0x3a7bb4) {
      await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> 请输入通过兑换码获得奖励的R点（20s）：", "请输入通过兑换码获得奖励的R点（20s）：");
      _0x3a7bb4 = await _0x39f316.prompt(20000);
      if (_0x3a7bb4 == undefined) {
        return;
      }
      _0x472b49 = Math.floor(Number(_0x3a7bb4));
      console.log(_0x472b49);
      if (isNaN(_0x472b49)) {
        await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> [×] 操作中断！请填入数值，参数不对。", "[×] 操作中断！请填入数值，参数不对。");
        return;
      }
    } else {
      _0x472b49 = Number(_0x3a7bb4);
    }
    const [_0x4f915e] = await GiftCode.ctx.database.get("roblox_giftCode", {
      code: _0x1482cd.toUpperCase()
    });
    if (_0x4f915e) {
      await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> [×] 不能重复添加！目前已存在该兑换码，如需再次添加请删除该旧的兑换码信息。", "[×] 不能重复添加！目前已存在该兑换码，如需再次添加请删除该旧的兑换码信息。");
      return;
    }
    const _0x3a4a79 = {
      code: _0x1482cd.toUpperCase(),
      monetary: _0x472b49,
      use: true,
      total: _0xc91dd0 ?? -1,
      validityDay: _0xed51e4 ?? -1,
      note: _0x5ed085 || "",
      createdAt: new Date(),
      useTime: new Date()
    };
    await this.ctx.database.create("roblox_giftCode", _0x3a4a79);
    await deps.Chat.send(_0x39f316, "<@" + _0x39f316.userId + "> 兑换码添加完成：\n\n" + this.giftFormatMd(_0x3a4a79), "兑换码添加完成：\n\n" + this.giftFormatText(_0x3a4a79), deps.kb.redeemAdmin());
  },
  giftFormatText(_0x57b3fa) {
    return "[兑换码] " + _0x57b3fa.code + "\n[奖励品] " + _0x57b3fa.monetary + " R点\n[有效期] " + (_0x57b3fa.validityDay == -1 ? "永久" : _0x57b3fa.validityDay + "天") + "\n[剩余数量] " + (_0x57b3fa.total == -1 ? "不限" : _0x57b3fa.total + "个") + "\n[创建时间] " + formatTime(_0x57b3fa.createdAt) + "\n[生效时间] " + formatTime(_0x57b3fa.useTime) + "\n" + (_0x57b3fa.note ? "\n\n" + _0x57b3fa.note : "");
  },
  giftFormatMd(_0x4d7683) {
    return "| 兑换说明 | 数据 |\n|---|---|\n| 兑换码 | `" + _0x4d7683.code + "` |\n| 奖励品 | `" + _0x4d7683.monetary + "` R点 |\n| 有效期 | `" + (_0x4d7683.validityDay == -1 ? "永久" : _0x4d7683.validityDay + "天") + "` |\n| 剩余数量 | `" + (_0x4d7683.total == -1 ? "不限" : _0x4d7683.total + "个") + "` |\n| 创建时间 | `" + formatTime(_0x4d7683.createdAt) + "` |\n| 生效时间 | `" + formatTime(_0x4d7683.useTime) + "` |" + (_0x4d7683.note ? "\n\n" + _0x4d7683.note : "");
  },
  async checkGiftCode(_0x15bd14, _0x5b33ff) {
    if (!deps.Roles.isAdmin(_0x15bd14.userId)) {
      await deps.Chat.send(_0x15bd14, "<@" + _0x15bd14.userId + "> [×] 非常抱歉！您并非管理员，无法添加兑换码！", "[×] 非常抱歉！您并非管理员，无法添加兑换码！");
      return;
    }
    if (!_0x5b33ff) {
      await deps.Chat.send(_0x15bd14, "<@" + _0x15bd14.userId + "> 请输入要查询的兑换码（20s）：", "请输入要查询的兑换码（20s）：");
      _0x5b33ff = await _0x15bd14.prompt(20000);
      if (_0x5b33ff == undefined) {
        return;
      }
    }
    const [_0x181cf7] = await GiftCode.ctx.database.get("roblox_giftCode", {
      code: _0x5b33ff
    });
    if (!_0x181cf7) {
      await deps.Chat.send(_0x15bd14, "<@" + _0x15bd14.userId + "> [×] 没有找到该兑换码！", "[×] 没有找到该兑换码！");
      return;
    }
    await deps.Chat.send(_0x15bd14, "<@" + _0x15bd14.userId + "> 获得兑换码信息如下：\n\n" + GiftCode.giftFormatMd(_0x181cf7), "获得兑换码信息如下：\n\n" + GiftCode.giftFormatText(_0x181cf7));
  },
  async getGiftByCode(_0x4643c5, _0x5c875a) {
    if (!_0x5c875a) {
      await deps.Chat.send(_0x4643c5, "<@" + _0x4643c5.userId + "> 请输入要进行兑换操作的兑换码（20s）：", "请输入要进行兑换操作的兑换码（20s）：");
      _0x5c875a = await _0x4643c5.prompt(20000);
      if (_0x5c875a == undefined) {
        return;
      }
    }
    const code = _0x5c875a.toUpperCase();
    const database = this.ctx.database;
    if (typeof database.withTransaction !== "function") {
      throw new Error("兑换码需要支持事务的数据库驱动");
    }
    const drivers = ["roblox_giftCode", "roblox_giftHistory", "monetary"].map(table => database.select(table).driver);
    if (drivers.some(driver => driver !== drivers[0])) {
      throw new Error("兑换码、领取历史和 monetary 必须使用同一数据库驱动");
    }
    const {
      id: uid
    } = await _0x4643c5.observeUser(["id"]);
    let _0x596ed4;
    const conflict = new Error("兑换码正在被领取，请重试");
    try {
      await database.withTransaction(async tx => {
        _0x596ed4 = null;
        const [gift] = await tx.get("roblox_giftCode", {
          code
        });
        if (!gift) {
          _0x596ed4 = {
            code: false,
            msg: "[×] 没有找到该兑换码！"
          };
          return;
        }
        const [history] = await tx.get("roblox_giftHistory", {
          userid: _0x4643c5.userId,
          code
        });
        if (history) {
          _0x596ed4 = {
            code: false,
            msg: "[×] 你已经领取过该兑换码，请不要重复领取！"
          };
          return;
        }
        _0x596ed4 = this.useGiftCode({
          ...gift
        });
        if (!_0x596ed4.code) return;
        if (!Number.isSafeInteger(gift.monetary) || gift.monetary < 0) {
          throw new Error("兑换码奖励数值无效");
        }
        const result = await tx.set("roblox_giftCode", {
          id: gift.id,
          revision: gift.revision,
          total: gift.total,
          use: true
        }, row => ({
          total: _0x596ed4.data.total,
          revision: deps.import_koishi2.$.add(row.revision, 1)
        }));
        if (result?.matched !== 1) throw conflict;
        await tx.create("roblox_giftHistory", {
          code,
          userid: _0x4643c5.userId,
          getTime: new Date()
        });
        await tx.upsert("monetary", row => [{
          uid,
          currency: "default",
          value: deps.import_koishi2.$.add(row.value, gift.monetary)
        }]);
      });
    } catch (error) {
      if (error !== conflict) throw error;
      _0x596ed4 = {
        code: false,
        msg: "[×] 兑换码正在被领取，请重试。"
      };
    }
    if (!_0x596ed4?.code) {
      const message = _0x596ed4?.msg || "[×] 兑换未完成，请稍后重试。";
      await deps.Chat.send(_0x4643c5, "<@" + _0x4643c5.userId + "> " + message, message);
      return;
    }
    await deps.Chat.send(_0x4643c5, "<@" + _0x4643c5.userId + "> 兑换成功！获得： **" + _0x596ed4.data.monetary + "**R点" + (_0x596ed4.data.note ? "\n\n\"" + _0x596ed4.data.note + "\"" : ""), "兑换成功！获得： " + _0x596ed4.data.monetary + "R点" + (_0x596ed4.data.note ? "\n\n\"" + _0x596ed4.data.note + "\"" : ""), deps.kb.pointsPanel());
  },
  useGiftCode(_0x72889c) {
    if (!_0x72889c.use) {
      return {
        code: false,
        msg: "[×] 该兑换码已被禁用。",
        data: null
      };
    }
    if (_0x72889c.total == 0) {
      return {
        code: false,
        msg: "[×] 该兑换码目前已经领取完毕。没有存货了！",
        data: null
      };
    }
    const _0x1f2ea1 = new Date(new Date(_0x72889c.useTime).toLocaleDateString());
    if (_0x1f2ea1.getTime() > +new Date()) {
      return {
        code: false,
        msg: "[×] 还未到该兑换码生效时间。请在 " + formatTime(new Date(_0x72889c.useTime)) + " 后使用。",
        data: null
      };
    }
    if (_0x72889c.validityDay !== -1 && +new Date(_0x1f2ea1.getTime() + _0x72889c.validityDay * 24 * 3600000) < +new Date()) {
      return {
        code: false,
        msg: "[×] 该兑换码已经过期...",
        data: null
      };
    }
    if (_0x72889c.total !== -1) {
      _0x72889c.total--;
    }
    return {
      code: true,
      msg: "兑换成功",
      data: _0x72889c
    };
  }
};
function formatTime(_0x3a1553) {
  return _0x3a1553.toLocaleDateString().replace(/\//g, "-");
}
return { get GiftCode() { return GiftCode; }, set GiftCode(value) { GiftCode = value; },
get formatTime() { return formatTime; } };
};
