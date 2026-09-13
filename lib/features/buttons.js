'use strict';

module.exports = function create(deps) {
var UNSUPPORT_TIPS = "请升级QQ版本";
function cmdButton(_0x53e654, _0x29b662, _0x5dd06f = 0, _0x1e1528 = {
  type: 2
}, _0x4871d6 = _0x53e654, _0x612aa0 = true) {
  return {
    render_data: {
      label: _0x53e654,
      visited_label: _0x4871d6,
      style: _0x5dd06f
    },
    action: {
      type: 2,
      permission: _0x1e1528,
      data: _0x29b662,
      enter: _0x612aa0,
      unsupport_tips: UNSUPPORT_TIPS
    }
  };
}
function callbackButton(_0x12fee6, _0x1c066e, _0x4bbd58 = 0, _0x2adb4d = {
  type: 2
}, _0x4cda3e = _0x12fee6) {
  return {
    render_data: {
      label: _0x12fee6,
      visited_label: _0x4cda3e,
      style: _0x4bbd58
    },
    action: {
      type: 1,
      permission: _0x2adb4d,
      data: _0x1c066e,
      unsupport_tips: UNSUPPORT_TIPS
    }
  };
}
function linkButton(_0x558dde, _0xe05a5d, _0x1cabe1 = 0) {
  return {
    render_data: {
      label: _0x558dde,
      visited_label: _0x558dde,
      style: _0x1cabe1
    },
    action: {
      type: 0,
      permission: {
        type: 2
      },
      data: _0xe05a5d,
      unsupport_tips: UNSUPPORT_TIPS
    }
  };
}
function keyboard(..._0x1ecc1a) {
  return {
    content: {
      rows: _0x1ecc1a.map(_0x7a8ddf => ({
        buttons: _0x7a8ddf
      }))
    }
  };
}
var searchRow = () => [cmdButton("搜用户", "用户名搜索"), cmdButton("搜游戏", "游戏名搜索"), cmdButton("搜群组", "群组名搜索")];
var catalogSearchRow = () => [cmdButton("搜物品", "物品搜索"), cmdButton("搜限量", "限量品搜索"), cmdButton("搜用户", "用户名搜索"), cmdButton("搜游戏", "游戏名搜索")];
var pointsRow = _0x49ca3d => [cmdButton("签到", "签到", _0x49ca3d, {
  type: 2
}, "已签到"), cmdButton("积分", "积分", _0x49ca3d), cmdButton("等级", "roblox/等级", _0x49ca3d), cmdButton("流水", "roblox/流水", _0x49ca3d)];
var adminRows = () => [[cmdButton("增减R点", "增减R点 id 数量"), cmdButton("增减经验", "增减经验 id 数量"), cmdButton("设定等级", "设定等级 id 等级")], [cmdButton("违规移除", "违规移除"), cmdButton("违规添加", "违规添加")], [cmdButton("风控等级", "调整风控等级 id 等级 时间", 0, {
  type: 2
}, "调整风控等级"), cmdButton("解除风控", "解除风控 id")]];
var kb = {
  menuSearch: () => keyboard([callbackButton("菜单", "菜单", 4)], searchRow()),
  searchNav: () => keyboard(searchRow()),
  catalogNav: () => keyboard(catalogSearchRow()),
  catalogPagination: (_0x5bfda6, _0x30fd94, _0x21e165) => {
    const _0xd55960 = [];
    if (_0x5bfda6 && _0x30fd94) {
      _0xd55960.push(cmdButton("上一页", "/物品搜索上一页 " + _0x5bfda6, 0, {
        type: 2
      }, "已翻页"));
    }
    if (_0x5bfda6 && _0x21e165) {
      _0xd55960.push(cmdButton("下一页", "/物品搜索下一页 " + _0x5bfda6, 4, {
        type: 2
      }, "已翻页"));
    }
    return keyboard(...(_0xd55960.length ? [_0xd55960] : []), catalogSearchRow());
  },
  chartRangeRow: _0x271645 => keyboard([cmdButton("1周", "/物品趋势 " + _0x271645 + " --range 1w"), cmdButton("1月", "/物品趋势 " + _0x271645 + " --range 1m"), cmdButton("3月", "/物品趋势 " + _0x271645 + " --range 3m", 4), cmdButton("1年", "/物品趋势 " + _0x271645 + " --range 1y")], [cmdButton("全部", "/物品趋势 " + _0x271645 + " --range all")]),
  pagination: (_0x12522e = false) => keyboard([cmdButton("上一页", "/上一页", 0, {
    type: 2
  }, "已翻页"), cmdButton("下一页", "/下一页", _0x12522e ? 4 : 0, {
    type: 2
  }, "已翻页")]),
  myInfo: () => keyboard([callbackButton("菜单", "菜单")], [callbackButton("积分流水", "流水", 0, {
    type: 2
  }, "积分"), cmdButton("绑定账号", "绑定Roblox账号")]),
  unbindLink: () => keyboard([linkButton("解除账号绑定（私聊状态）", "https://static.gamecenter.qq.com/social-web/add-bot-v2/index.html?id=122", 4)]),
  bindVerify: (_0x29d83e, _0x53e401) => keyboard([cmdButton("复制验证码", _0x53e401, 2, {
    type: 0,
    specify_user_ids: [_0x29d83e]
  }, "已复制", false), linkButton("查看教程", "https://pd.qq.com/s/8xuw4lcvz?b=2", 1)]),
  unbindConfirm: () => keyboard([cmdButton("确认解绑", "是", 3, {
    type: 2
  }, "已解绑"), cmdButton("取消", "取消", 0, {
    type: 2
  }, "已取消")]),
  pointsPanel: () => keyboard(pointsRow(4)),
  pointsPanelSecondary: () => keyboard(pointsRow(0)),
  pointsPanelExchange: () => keyboard(pointsRow(4), [cmdButton("兑换经验", "兑换经验")]),
  redeemAdmin: () => keyboard([cmdButton("添加兑换码（示例）", "/添加兑换码 WELCOME2026 100 50 30 新年欢迎礼包", 0, {
    type: 2
  }, "兑换码")], [cmdButton("添加兑换码", "/添加兑换码 ")], [cmdButton("查询兑换码", "/查询兑换码")]),
  musicAgain: () => keyboard([callbackButton("再来一首", "随机top音乐id", 4, {
    type: 2
  }, "随机top音乐id")]),
  appealLinks: () => keyboard([linkButton("官方频道", "https://pd.qq.com/s/a76gdqe0j"), linkButton("申诉链接", "https://doc.weixin.qq.com/forms/ACkANQdgAFsAcMAXgYSADUCNreAwhDS6f?page=1")]),
  adminPanel: () => keyboard(...adminRows()),
  auditList: _0x546f96 => keyboard(..._0x546f96.slice(0, 5).map(_0x3b3a1f => [cmdButton("违规 #" + _0x3b3a1f, "/审核处理 " + _0x3b3a1f + " 违规", 3, {
    type: 1
  }, "已裁决"), cmdButton("不违规 #" + _0x3b3a1f, "/审核处理 " + _0x3b3a1f + " 不违规", 0, {
    type: 1
  }, "已裁决")]))
};
return { get UNSUPPORT_TIPS() { return UNSUPPORT_TIPS; }, set UNSUPPORT_TIPS(value) { UNSUPPORT_TIPS = value; },
get cmdButton() { return cmdButton; },
get callbackButton() { return callbackButton; },
get linkButton() { return linkButton; },
get keyboard() { return keyboard; },
get searchRow() { return searchRow; }, set searchRow(value) { searchRow = value; },
get catalogSearchRow() { return catalogSearchRow; }, set catalogSearchRow(value) { catalogSearchRow = value; },
get pointsRow() { return pointsRow; }, set pointsRow(value) { pointsRow = value; },
get adminRows() { return adminRows; }, set adminRows(value) { adminRows = value; },
get kb() { return kb; }, set kb(value) { kb = value; } };
};
