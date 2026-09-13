'use strict';

module.exports = function create(deps) {
const _0xCOMM_PATH = deps.config.communityDataPath && String(deps.config.communityDataPath).trim() ? deps.config.communityDataPath : require("path").join(deps.pluginRoot, "data", "communities.json");
let _0xCOMM_DATA = [];
const _0xCOMM_CMDS = [];
async function _0xcommLoad() {
  try {
    deps.ctx.database.extend("roblox_community", {
      id: "string",
      name: "string",
      icon: "text",
      cover: "text",
      intro: "text",
      owner: "string",
      qqGroupNumber: "string",
      groupId: "string",
      memberCount: "integer",
      enabled: "boolean",
      order: "integer"
    }, {
      primary: "id",
      autoInc: false
    });
    const _0xrows = await deps.ctx.database.get("roblox_community", {});
    _0xCOMM_DATA = Array.isArray(_0xrows) ? _0xrows : [];
    const _0xdel = _0xCOMM_DATA.filter(_0xc => _0xc.name && _0xc.name.includes("/"));
    if (_0xdel.length) {
      for (const _0xd of _0xdel) {
        try {
          await deps.ctx.database.remove("roblox_community", {
            id: _0xd.id
          });
        } catch (_0xe) {}
      }
      _0xCOMM_DATA = _0xCOMM_DATA.filter(_0xc => !_0xc.name || !_0xc.name.includes("/"));
      console.log("[community] auto-deleted names with /:", _0xdel.map(_0xc => _0xc.name));
    }
    _0xCOMM_DATA.sort((a, b) => Number(a.order || 0) - Number(b.order || 0) || String(a.id || "").localeCompare(String(b.id || "")));
  } catch (_0xe) {
    console.log("[community] load error", _0xe && _0xe.message);
    _0xCOMM_DATA = [];
  }
}
function _0xcommDispose() {
  while (_0xCOMM_CMDS.length) {
    const _0xc = _0xCOMM_CMDS.pop();
    try {
      _0xc.dispose();
    } catch (_0xe) {}
  }
}
function _0xcommRegister() {
  _0xcommDispose();
  for (const _0xc of _0xCOMM_DATA) {
    if (!_0xc.enabled) {
      continue;
    }
    if (!_0xc.name || !/^.{1,50}$/.test(_0xc.name) || _0xc.name.includes("/")) {
      console.log("[community] skip invalid name:", _0xc.name);
      continue;
    }
    try {
      const _0xcmd = deps.ctx.command("roblox/" + _0xc.name).action(async ({
        session: _0xs
      }) => {
        return await _0xcommRenderDetail(_0xs, _0xc);
      });
      _0xCOMM_CMDS.push(_0xcmd);
    } catch (_0xe) {
      console.log("[community] register failed for", _0xc.name, _0xe && _0xe.message);
    }
  }
}
async function _0xcommGetCount(_0xs, _0xc) {
  try {
    if (_0xs.platform === "qq" && _0xc.groupId) {
      if (typeof _0xs.bot.getGuildMemberCount === "function") {
        const _0xn = await _0xs.bot.getGuildMemberCount(_0xc.groupId);
        if (typeof _0xn === "number") {
          return _0xn;
        }
      }
      if (typeof _0xs.bot.getGuildMemberList === "function") {
        const _0xlist = await _0xs.bot.getGuildMemberList(_0xc.groupId);
        if (_0xlist && _0xlist.length) {
          return _0xlist.length;
        }
      }
    }
  } catch (_0xe) {
    if (deps.config.deBug) {
      console.log("[community] get count failed", _0xe && _0xe.message);
    }
  }
  return _0xc.memberCount || 0;
}
async function _0xcommRenderDetail(_0xs, _0xc) {
  const _0xmdOn = deps.config.useMd;
  const _0xcnt = await _0xcommGetCount(_0xs, _0xc);
  const _0xplain = "【" + _0xc.name + "】\n" + (_0xc.cover ? "介绍图片：" + _0xc.cover + "\n" : "") + "社群人数：" + _0xcnt + "人\n社群介绍：" + (_0xc.intro || "暂无") + "\n加入方式：" + (_0xc.qqGroupNumber ? "发送「复制群号 " + _0xc.qqGroupNumber + "」" : "无");
  if (!_0xmdOn || _0xs.platform !== "qq") {
    await _0xs.send(_0xplain);
    return "";
  }
  let _0xmd = (_0xc.cover ? "![cover #768px #432px](" + _0xc.cover + ")\n\n" : "") + "## " + (_0xc.icon ? "![icon #50px #50px](" + _0xc.icon + ") " : "") + _0xc.name + "\n\n";
  _0xmd += "**社群人数：** " + _0xcnt + "人\n\n";
  _0xmd += "**社群介绍：**\n" + (_0xc.intro || "暂无") + "\n\n";
  _0xmd += "**加入方式：** " + (_0xc.qqGroupNumber ? "<qqbot-cmd-input text=\"复制群号 " + _0xc.qqGroupNumber + "\" show=\"点击复制群号\"/>" : "无");
  const _0xkb = deps.keyboard([deps.callbackButton("返回主页", "社群推荐")], [deps.callbackButton("报名推荐", "报名推荐社群"), deps.callbackButton("投诉该社群", "投诉社群 " + _0xc.name)]);
  await deps.Chat.send(_0xs, _0xmd, _0xplain, _0xkb);
  return "";
}
async function _0xcommRenderList(_0xs) {
  if (!_0xCOMM_DATA.length) {
    await _0xcommLoad();
  }
  const _0xlist = _0xCOMM_DATA.filter(_0xc => _0xc.enabled);
  if (!_0xlist.length) {
    await _0xs.send("暂无社群推荐");
    return "";
  }
  const _0xmdOn = deps.config.useMd;
  if (!_0xmdOn || _0xs.platform !== "qq") {
    let _0xp = "【社群推荐主页】\n";
    for (const _0xc of _0xlist) {
      _0xp += "\n· " + _0xc.name;
    }
    _0xp += "\n\n发送 社群推荐 查看详情";
    await _0xs.send(_0xp);
    return "";
  }
  let _0xmd = "## 社群推荐主页\n\n";
  for (const _0xc of _0xlist) {
    _0xmd += "· " + (_0xc.icon ? "![img #30px #30px](" + _0xc.icon + ") " : "") + "<qqbot-cmd-input text=\"" + _0xc.name + "\" show=\"" + _0xc.name + "\"/>\n";
  }
  let _0xplain = "【社群推荐主页】\n";
  for (const _0xc of _0xlist) {
    _0xplain += "\n· " + _0xc.name;
  }
  const _0xkb = deps.keyboard([deps.callbackButton("菜单", "菜单", 4)], [deps.callbackButton("报名推荐", "报名推荐社群", 0, {
    type: 2
  }), deps.callbackButton("投诉社群", "投诉社群", 0, {
    type: 2
  })]);
  await deps.Chat.send(_0xs, _0xmd, _0xplain, _0xkb);
  return "";
}
_0xcommLoad().then(() => _0xcommRegister());
deps.ctx.inject(["console"], _0xctx => {
  try {
    _0xctx.console.addListener("roblox-community/list", async () => {
      if (!_0xCOMM_DATA.length) {
        await _0xcommLoad();
      }
      return JSON.parse(JSON.stringify(_0xCOMM_DATA));
    }, {
      authority: 4
    });
    _0xctx.console.addListener("roblox-community/save", async _0xdata => {
      try {
        if (!_0xdata || typeof _0xdata !== "object") {
          return {
            ok: false,
            message: "数据格式错误"
          };
        }
        const _0xnameRe = /^[\u4e00-\u9fa5A-Za-z0-9\s]+$/;
        if (_0xdata.name && !_0xnameRe.test(_0xdata.name)) {
          return {
            ok: false,
            message: "社群名称仅支持中文、英文、数字，不能包含特殊符号"
          };
        }
        if (_0xdata.intro && !_0xnameRe.test(_0xdata.intro)) {
          return {
            ok: false,
            message: "社群介绍仅支持中文、英文、数字，不能包含特殊符号"
          };
        }
        if (!_0xdata.id) {
          _0xdata.id = String(Date.now());
        }
        await deps.ctx.database.upsert("roblox_community", [_0xdata], ["id"]);
        await _0xcommLoad();
        _0xcommRegister();
        return {
          ok: true,
          message: "保存成功，已刷新 " + _0xCOMM_DATA.length + " 个社群"
        };
      } catch (_0xe) {
        return {
          ok: false,
          message: _0xe.message || "保存失败"
        };
      }
    }, {
      authority: 4
    });
    _0xctx.console.addListener("roblox-community/delete", async _0xid => {
      try {
        await deps.ctx.database.remove("roblox_community", {
          id: _0xid
        });
        await _0xcommLoad();
        _0xcommRegister();
        return {
          ok: true,
          message: "删除成功"
        };
      } catch (_0xe) {
        return {
          ok: false,
          message: _0xe.message || "删除失败"
        };
      }
    }, {
      authority: 4
    });
    console.log("[community] 控制台数据API已注册 (roblox-community)");
  } catch (_0xe) {
    console.log("[community] 控制台注册失败", _0xe && _0xe.message);
  }
});
return { get _0xCOMM_PATH() { return _0xCOMM_PATH; },
get _0xCOMM_DATA() { return _0xCOMM_DATA; }, set _0xCOMM_DATA(value) { _0xCOMM_DATA = value; },
get _0xCOMM_CMDS() { return _0xCOMM_CMDS; },
get _0xcommLoad() { return _0xcommLoad; },
get _0xcommDispose() { return _0xcommDispose; },
get _0xcommRegister() { return _0xcommRegister; },
get _0xcommGetCount() { return _0xcommGetCount; },
get _0xcommRenderDetail() { return _0xcommRenderDetail; },
get _0xcommRenderList() { return _0xcommRenderList; } };
};
