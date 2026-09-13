'use strict';

module.exports = function create(deps) {
var queues = {};
function queuedSetItem(_0x54cd08, _0xa6c934, _0x4a7177) {
  const _0x3b88a1 = queues[_0xa6c934] ?? Promise.resolve();
  const _0x4a6549 = _0x3b88a1.catch(() => {}).then(() => _0x54cd08.localstorage.setItem(_0xa6c934, _0x4a7177));
  queues[_0xa6c934] = _0x4a6549;
  _0x4a6549.then(() => {
    if (queues[_0xa6c934] === _0x4a6549) {
      delete queues[_0xa6c934];
    }
  }, () => {
    if (queues[_0xa6c934] === _0x4a6549) {
      delete queues[_0xa6c934];
    }
  });
  return _0x4a6549;
}
return { get queues() { return queues; }, set queues(value) { queues = value; },
get queuedSetItem() { return queuedSetItem; } };
};
