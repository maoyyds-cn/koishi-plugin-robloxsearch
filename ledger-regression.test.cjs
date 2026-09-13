const test = require('node:test');
const assert = require('node:assert/strict');
function load() {
  const messages = [];
  const context = {
    Chat: { send: async (session, message) => messages.push({ user: session.userId, message }) },
    kb: { pointsPanel() {} },
    Roles: { isAdmin: () => true },
    import_koishi2: { $: { add: (a, b) => ({ $add: [a, b] }) } },
    messages,
  };
  for (const name of ['storage-queue', 'gift-code', 'transactions', 'points-store', 'signin', 'legacy-signin']) {
    Object.assign(context, require(`./lib/features/${name}`)(context));
  }
  context.userLocal = context.legacySigninMethods;
  return context;
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
function localStore(context, storage) {
  context.transactionStore.ctx = { localstorage: storage };
  context.transactionStore.config = { basePath: 'test', useDatabase: false };
  return context.transactionStore;
}

test('cold record and list share one load, preserve prior history, await writes', async () => {
  const c = load();
  const read = deferred(), write = deferred();
  let reads = 0, saved;
  const store = localStore(c, {
    getItem: async () => { reads++; return read.promise; },
    setItem: async (_, data) => { saved = JSON.parse(data); await write.promise; },
  });
  const listing = store.list('u');
  let done = false;
  const recording = store.record({ userId: 'u', ledger: 'points', amount: 3 }).then(() => { done = true; });
  assert.equal(reads, 1);
  read.resolve(JSON.stringify([{ id: 'old', ledger: 'points' }]));
  await listing;
  await tick();
  assert.equal(done, false);
  assert.equal(saved.length, 2);
  assert.equal(saved[0].id, 'old');
  assert.equal(Object.keys(store._loading).length, 0);
  write.resolve();
  await recording;
  assert.equal((await store.list('u')).length, 2);
  assert.equal(Object.keys(c.queues).length, 0);
});

for (const bad of ['{broken', '{}', 'null', 'io']) {
  test(`history load failure ${bad} is propagated without writes and can retry`, async () => {
    const c = load();
    let fail = true, writes = 0;
    const store = localStore(c, {
      getItem: async () => { if (fail && bad === 'io') throw new Error('read failed'); return fail ? bad : '[]'; },
      setItem: async () => { writes++; },
    });
    await assert.rejects(store.record({ userId: 'u' }));
    assert.equal(writes, 0);
    assert.equal(store.cache.u, undefined);
    assert.equal(Object.keys(store._loading).length, 0);
    fail = false;
    await store.record({ userId: 'u' });
    assert.equal(writes, 1);
  });
}

test('empty localstorage sentinel, retention, filtering and save rejection', async () => {
  const c = load();
  let fail = true, saved;
  const store = localStore(c, {
    getItem: async () => '',
    setItem: async (_, data) => { if (fail) throw new Error('disk'); saved = JSON.parse(data); },
  });
  await assert.rejects(store.record({ userId: 'u', ledger: 'exp' }), /disk/);
  fail = false;
  await Promise.all(Array.from({ length: 205 }, (_, i) => store.record({ userId: 'u', ledger: 'points', amount: i })));
  assert.equal(saved.length, 200);
  assert.equal(saved[0].amount, 5);
  assert.equal((await store.list('u', 3, 'points'))[0].amount, 204);
  assert.equal((await store.list('u', 3, 'exp')).length, 0);
});

test('database ledger record waits and propagates failure', async () => {
  const c = load(), gate = deferred();
  c.transactionStore.config = { useDatabase: true };
  c.transactionStore.ctx = { database: { create: () => gate.promise } };
  const pending = c.transactionStore.record({ userId: 'u' });
  gate.reject(new Error('database unavailable'));
  await assert.rejects(pending, /database unavailable/);
  c.pointsStore.recordExp = c.pointsStore.recordExp.bind(c.pointsStore);
  await assert.rejects(c.pointsStore.recordExp({ userId: 'u' }, 1, 'test'), /database unavailable/);
});

test('both point APIs share ordering and clean queues after success and failure', async () => {
  const c = load(), store = c.pointsStore, gate = deferred();
  const calls = [];
  store.changePointsInner = async (_, amount) => { calls.push(amount); await gate.promise; throw new Error('first failed'); };
  store.changePointsByUserIdInner = async (_, amount) => { calls.push(amount); return amount; };
  const first = store.changePoints({ userId: 'u' }, 1);
  const failure = assert.rejects(first, /first failed/);
  const second = store.changePointsByUserId('u', 2);
  await tick();
  assert.deepEqual(calls, [1]);
  gate.resolve();
  await failure;
  assert.equal(await second, 2);
  assert.deepEqual(calls, [1, 2]);
  assert.equal(Object.keys(store.changeQueues).length, 0);
  store.changePointsInner = async () => 3;
  assert.equal(await store.changePoints({ userId: 'u' }, 3), 3);
  store.changePointsByUserIdInner = async () => { throw new Error('last failed'); };
  await assert.rejects(store.changePointsByUserId('u', 4), /last failed/);
  assert.equal(Object.keys(store.changeQueues).length, 0);
});

test('points balance queries select only default currency', async () => {
  const c = load(), store = c.pointsStore;
  store.save = async () => {};
  store.resolveUid = async () => 7;
  store.ctx = { database: { get: async (table, query) => {
    assert.equal(table, 'monetary');
    assert.equal(query.currency, 'default');
    return [{ value: 12 }];
  } } };
  assert.equal((await store.syncBalance({ userId: 'u', user: { id: 7 } })).currentPoints, 12);
  assert.equal(await store.changePointsByUserId('u', 0), 12);
});

// Contract double: snapshot reads, row-lock/CAS writes, staged changes and rollback.
// This tests orchestration, not any particular production driver's isolation implementation.
function giftDatabase(overrides = {}, options = {}) {
  const state = {
    gift: { id: 1, code: 'HELLO', monetary: 10, total: 1, revision: 0, use: true,
      validityDay: -1, useTime: new Date(0), note: '', ...overrides },
    history: options.history || [],
    balances: options.balances || [{ uid: 7, currency: 'other', value: 99 }],
  };
  const driver = {};
  let lock = Promise.resolve();
  let transactions = 0;
  const db = {
    state,
    select: table => ({ driver: options.split && table === 'monetary' ? {} : driver }),
    async withTransaction(callback) {
      transactions++;
      const snapshot = structuredClone(state);
      let draft, unlock;
      const tx = {
        async get(table, query) {
          if (table === 'roblox_giftCode') return snapshot.gift?.code === query.code ? [snapshot.gift] : [];
          assert.equal(table, 'roblox_giftHistory');
          return snapshot.history.filter(x => x.userid === query.userid && x.code === query.code);
        },
        async set(table, query, update) {
          assert.equal(table, 'roblox_giftCode');
          const previous = lock;
          const next = deferred();
          lock = next.promise;
          await previous;
          unlock = next.resolve;
          draft = structuredClone(state);
          const matched = Object.entries(query).every(([key, value]) => draft.gift[key] === value);
          if (!matched) return { matched: 0 };
          const patch = update({ revision: { field: 'revision' } });
          assert.equal(patch.revision.$add[0].field, 'revision');
          draft.gift.revision += patch.revision.$add[1];
          draft.gift.total = patch.total;
          return options.noMatched ? {} : { matched: 1 };
        },
        async create(table, row) {
          assert.equal(table, 'roblox_giftHistory');
          if (options.fail === 'history') throw new Error('history failed');
          draft.history.push(structuredClone(row));
        },
        async upsert(table, update) {
          assert.equal(table, 'monetary');
          const [row] = update({ value: { field: 'value' } });
          assert.equal(row.currency, 'default');
          assert.equal(row.value.$add[0].field, 'value');
          if (options.fail === 'balance') throw new Error('balance failed');
          let balance = draft.balances.find(x => x.uid === row.uid && x.currency === row.currency);
          if (!balance) draft.balances.push(balance = { uid: row.uid, currency: row.currency, value: 0 });
          balance.value += row.value.$add[1];
        },
      };
      try {
        await callback(tx);
        if (options.fail === 'commit') throw new Error('commit failed');
        if (draft) Object.assign(state, draft);
      } finally {
        unlock?.();
      }
    },
    get transactions() { return transactions; },
  };
  return db;
}
function giftSetup(overrides, options) {
  const c = load(), db = giftDatabase(overrides, options);
  c.GiftCode.ctx = { database: db, monetary: { gain() { assert.fail('must not call monetary service'); } } };
  const session = userId => ({ userId, observeUser: async () => ({ id: userId === 'v' ? 8 : 7 }), prompt: async () => 'hello' });
  return { c, db, session };
}

test('redemption uses transaction uid resolved outside, increments existing default only', async () => {
  const { c, db, session } = giftSetup({}, { balances: [
    { uid: 7, currency: 'other', value: 99 }, { uid: 7, currency: 'default', value: 20 },
  ] });
  const s = session('u');
  s.observeUser = async () => { assert.equal(db.transactions, 0); return { id: 7 }; };
  await c.GiftCode.getGiftByCode(s, 'hello');
  assert.equal(db.state.gift.total, 0);
  assert.equal(db.state.history.length, 1);
  assert.equal(db.state.balances[0].value, 99);
  assert.equal(db.state.balances[1].value, 30);
  assert.match(c.messages.at(-1).message, /兑换成功/);
});

for (const fail of ['history', 'balance', 'commit']) {
  test(`redemption ${fail} failure rolls back inventory, history and balance`, async () => {
    const { c, db, session } = giftSetup({}, { fail });
    const before = structuredClone(db.state);
    await assert.rejects(c.GiftCode.getGiftByCode(session('u'), 'HELLO'), new RegExp(fail));
    assert.deepEqual(db.state, before);
    assert.equal(c.messages.length, 0);
  });
}

for (const total of [1, -1]) {
  test(`concurrent same-user redemptions total=${total} cannot grant twice`, async () => {
    const { c, db, session } = giftSetup({ total });
    await Promise.all([c.GiftCode.getGiftByCode(session('u'), 'HELLO'), c.GiftCode.getGiftByCode(session('u'), 'HELLO')]);
    assert.equal(db.state.history.length, 1);
    assert.equal(db.state.balances.find(x => x.currency === 'default').value, 10);
    assert.equal(db.state.gift.total, total === -1 ? -1 : 0);
    assert.equal(db.state.gift.revision, 1);
    await c.GiftCode.getGiftByCode(session('u'), 'HELLO');
    assert.match(c.messages.at(-1).message, /不要重复领取/);
  });
}

test('two users cannot oversell the last code', async () => {
  const { c, db, session } = giftSetup();
  await Promise.all(['u', 'v'].map(u => c.GiftCode.getGiftByCode(session(u), 'HELLO')));
  assert.equal(db.state.history.length, 1);
  assert.equal(db.state.gift.total, 0);
});

test('unlimited stock permits different users and normalizes prompted code', async () => {
  const { c, db, session } = giftSetup({ total: -1 });
  await c.GiftCode.getGiftByCode(session('u'));
  await c.GiftCode.getGiftByCode(session('v'), 'hello');
  assert.equal(db.state.history.length, 2);
  assert.equal(db.state.gift.total, -1);
});

for (const overrides of [{ use: false }, { total: 0 }, { useTime: new Date(Date.now() + 86400000 * 2) }, { validityDay: 1 }]) {
  test(`unavailable gift ${JSON.stringify(overrides)} causes no writes`, async () => {
    const { c, db, session } = giftSetup(overrides);
    const before = structuredClone(db.state);
    await c.GiftCode.getGiftByCode(session('u'), 'HELLO');
    assert.deepEqual(db.state, before);
    assert.doesNotMatch(c.messages.at(-1).message, /兑换成功/);
  });
}

test('missing matched count rolls back rather than guessing success', async () => {
  const { c, db, session } = giftSetup({}, { noMatched: true });
  const before = structuredClone(db.state);
  await c.GiftCode.getGiftByCode(session('u'), 'HELLO');
  assert.deepEqual(db.state, before);
  assert.match(c.messages.at(-1).message, /重试/);
});

test('unsupported transactions and split drivers fail closed', async () => {
  for (const split of [true, false]) {
    const { c, db, session } = giftSetup({}, { split });
    if (!split) db.withTransaction = undefined;
    await assert.rejects(c.GiftCode.getGiftByCode(session('u'), 'HELLO'), /数据库驱动/);
    assert.equal(db.state.history.length, 0);
  }
});

test('schema keeps old history compatible without adding a destructive unique constraint', async () => {
  const c = load(), models = {};
  await c.GiftCode.init({ model: { extend: (name, fields, config) => { models[name] = { fields, config }; } } }, {});
  assert.equal(models.roblox_giftCode.fields.revision.initial, 0);
  assert.equal(models.roblox_giftHistory.config.unique, undefined);
  assert.equal(models.roblox_giftCode.config.unique[0], 'code');
});

test('disabled signin guards direct legacy/experience calls and both command modes', async () => {
  const c = load();
  c.pointsStore.config = { useSignin: false };
  c.userLocal.config = { useSignin: false };
  c.pointsStore.syncBalance = () => assert.fail('must not load balance');
  c.userLocal.initUserInfo = () => assert.fail('must not load profile');
  await c.doSignIn({ userId: 'u' });
  await c.userLocal.startSignin({ userId: 'u' });
  const commands = {};
  c.ctx = { command(name) { return { userFields() { return this; }, action(fn) { commands[name] = fn; } }; } };
  c.legacyBan = { verify: async () => false };
  for (const useExpSystem of [true, false]) {
    c.config = { useSignin: false, useExpSystem };
    require('./lib/features/commands/签到')(c);
    await commands['roblox/签到']({ session: { userId: 'u' } });
  }
  assert.equal(c.messages.length, 4);
  assert.ok(c.messages.every(x => /暂时未开放/.test(x.message)));
});

test('callback signin button executes the guarded command', async () => {
  const c = load();
  let handler, executed;
  c.ctx = { on: (_, fn) => { handler = fn; } };
  require('./lib/features/button-events')(c);
  await handler({ platform: 'qq', userId: 'u', event: { button: { data: '签到' } }, execute: async command => { executed = command; } });
  assert.equal(executed, 'roblox/签到');
});
