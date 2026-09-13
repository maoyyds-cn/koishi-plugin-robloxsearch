'use strict';

module.exports = function create(deps) {
const queryLock = {
  userTemp: {},
  isUse(_0x37abf4) {
    return this.userTemp[_0x37abf4.userId];
  },
  clearUse(_0x107552) {
    delete this.userTemp[_0x107552.userId];
  },
  startUse(_0x2954a6) {
    this.userTemp[_0x2954a6.userId] = true;
  }
};
return { get queryLock() { return queryLock; } };
};
