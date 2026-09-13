'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveRobloxUrl, createRobloxHttp } = require('../lib/roblox-http');

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];

function makeHttp(result = Promise.resolve({ data: ['unchanged'] })) {
  const calls = [];
  function http(...args) {
    assert.equal(this, http);
    calls.push({ method: 'call', args });
    return result;
  }
  for (const method of methods) {
    http[method] = function (...args) {
      assert.equal(this, http);
      calls.push({ method, args });
      return result;
    };
  }
  http.defaults = { timeout: 1000 };
  Object.defineProperty(http, 'receiver', {
    get() {
      assert.equal(this, http);
      return this.defaults;
    }
  });
  http.other = function (...args) {
    assert.equal(this, http);
    calls.push({ method: 'other', args });
    return result;
  };
  return { http, calls, result };
}

test('maps all current API hosts and exact root domains in both directions', () => {
  for (const prefix of ['', 'users.', 'friends.', 'groups.', 'games.', 'thumbnails.', 'assetdelivery.', 'apis.', 'a.b.']) {
    const official = `https://${prefix}roblox.com/v1/a%2Fb?x=1&x=2&next=https://roblox.com/#part`;
    const proxy = official.replace(`${prefix}roblox.com`, `${prefix}rotunnel.com`);
    assert.equal(resolveRobloxUrl(official, true), proxy);
    assert.equal(resolveRobloxUrl(official), proxy);
    assert.equal(resolveRobloxUrl(proxy, false), official);
    assert.equal(resolveRobloxUrl(proxy, true), proxy);
    assert.equal(resolveRobloxUrl(official, false), official);
  }
});

test('preserves casing outside replaced domain, explicit ports and exact URL suffix', () => {
  assert.equal(
    resolveRobloxUrl('HTTP://USERS.ROBLOX.COM:80/a/../b?x=%2f&empty=#fragment'),
    'HTTP://USERS.rotunnel.com:80/a/../b?x=%2f&empty=#fragment'
  );
  assert.equal(resolveRobloxUrl('https://roblox.com'), 'https://rotunnel.com');
});

test('does not rewrite lookalike domains, third parties, credentials, relative or non-HTTP inputs', () => {
  const inputs = [
    'https://notroblox.com/v1/users',
    'https://roblox.com.evil.test/v1/users',
    'https://rotunnel.com.evil.test/',
    'https://evil-rotunnel.com/',
    'https://users.roblox.com@evil.test/',
    'https://evil.test@users.roblox.com/',
    'https://roblox.com\\@evil.test/',
    'https://users%2eroblox.com/',
    'https://.roblox.com/',
    'https://users.roblox.com:99999/',
    'https://uapis.cn/api/v1/text/profanitycheck',
    'https://api.rolimons.com/items/v1/itemdetails',
    'https://t0.rbxcdn.com/image.png',
    'https://4277980205320394.hostedstatus.com/1.0/status/id',
    'https://example.com/?url=https://users.rotunnel.com/v1/users#roblox.com',
    '/query-userid/123', '//users.roblox.com/v1/users',
    'ftp://roblox.com/file', '', null, undefined, 123,
    new URL('https://users.roblox.com/v1/users')
  ];
  for (const input of inputs) {
    assert.equal(resolveRobloxUrl(input, true), input);
    assert.equal(resolveRobloxUrl(input, false), input);
  }
});

test('music and keyword search continue through official apis host when disabled', () => {
  const { http, calls } = makeHttp();
  const wrapped = createRobloxHttp(http, { useProxyServer: false });
  for (const path of ['/music-discovery/v1/top-songs?pageToken=0&limit=100', '/search-api/omni-search?searchQuery=test&pageToken=']) {
    wrapped.get('https://apis.rotunnel.com' + path);
    assert.equal(calls.at(-1).args[0], 'https://apis.roblox.com' + path);
  }
});

test('methods preserve this, body/options identities and unmodified response promises', () => {
  for (const useProxyServer of [true, false]) {
    const { http, calls, result } = makeHttp();
    const wrapped = createRobloxHttp(http, { useProxyServer });
    const from = useProxyServer ? 'roblox.com' : 'rotunnel.com';
    const to = useProxyServer ? 'rotunnel.com' : 'roblox.com';
    const data = { usernames: ['test'], link: 'https://www.roblox.com/users/1/profile' };
    const options = { responseType: 'arraybuffer', timeout: 100, headers: { 'x-csrf-token': 'test-only' } };
    for (const method of methods) {
      const detached = wrapped[method];
      assert.equal(detached(`https://users.${from}/v1/users`, data, options), result);
      assert.deepEqual(calls.at(-1), { method, args: [`https://users.${to}/v1/users`, data, options] });
      assert.equal(calls.at(-1).args[1], data);
      assert.equal(calls.at(-1).args[2], options);
    }
    assert.equal(data.link, 'https://www.roblox.com/users/1/profile');
  }
});

test('get options and binary responses retain their exact types', () => {
  const binary = Buffer.from([0, 255, 1]);
  const { http, calls } = makeHttp(binary);
  const wrapped = createRobloxHttp(http);
  const options = { responseType: 'arraybuffer' };
  assert.equal(wrapped.get('https://assetdelivery.roblox.com/v1/asset?id=1', options), binary);
  assert.equal(calls[0].args[1], options);
});

test('wrapper is local, preserves unrelated interfaces and supports independent configurations', () => {
  const { http, calls, result } = makeHttp();
  const originalGet = http.get;
  const proxy = createRobloxHttp(http);
  const official = createRobloxHttp(http, { useProxyServer: false });
  assert.notEqual(proxy, http);
  assert.equal(http.get, originalGet);
  assert.equal(proxy.defaults, http.defaults);
  assert.equal(proxy.receiver, http.defaults);
  assert.equal(proxy.other('https://roblox.com/'), result);
  assert.equal(calls.at(-1).args[0], 'https://roblox.com/');
  proxy.get('https://users.roblox.com/v1/users');
  official.get('https://users.rotunnel.com/v1/users');
  http.get('https://users.roblox.com/v1/users');
  assert.deepEqual(calls.slice(-3).map(call => call.args[0]), [
    'https://users.rotunnel.com/v1/users',
    'https://users.roblox.com/v1/users',
    'https://users.roblox.com/v1/users'
  ]);
});

test('custom apiServer is excluded by origin and path boundary, not broad string prefix', () => {
  for (const useProxyServer of [true, false]) {
    const from = useProxyServer ? 'roblox.com' : 'rotunnel.com';
    const to = useProxyServer ? 'rotunnel.com' : 'roblox.com';
    const { http, calls } = makeHttp();
    const wrapped = createRobloxHttp(http, { useProxyServer, apiServer: ` https://users.${from}/custom/ ` });
    for (const suffix of ['/custom', '/custom/', '/custom/query-userid/123?update=true#part']) {
      const url = `https://users.${from}${suffix}`;
      wrapped.get(url);
      assert.equal(calls.at(-1).args[0], url);
    }
    for (const url of [`https://users.${from}/custom-other`, `https://friends.${from}/custom/query`, `https://users.${from}:8443/custom/query`]) {
      wrapped.get(url);
      assert.equal(calls.at(-1).args[0], url.replace(from, to));
    }
    const root = createRobloxHttp(http, { useProxyServer, apiServer: `https://users.${from}` });
    root.post(`https://users.${from}/query`, {});
    assert.equal(calls.at(-1).args[0], `https://users.${from}/query`);
  }
});

test('external and empty custom servers do not disable mapping of built-in API calls', () => {
  for (const apiServer of ['', '  ', 'https://custom.example/api']) {
    const { http, calls } = makeHttp();
    const wrapped = createRobloxHttp(http, { apiServer, useProxyServer: false });
    wrapped.get('https://users.rotunnel.com/v1/users/1');
    assert.equal(calls.at(-1).args[0], 'https://users.roblox.com/v1/users/1');
    wrapped.get('https://custom.example/api/query-userid/1');
    assert.equal(calls.at(-1).args[0], 'https://custom.example/api/query-userid/1');
  }
});

test('callable service supports URL-first and method-first without changing responses or options', () => {
  for (const useProxyServer of [true, false]) {
    const { http, calls, result } = makeHttp();
    const wrapped = createRobloxHttp(http, { useProxyServer });
    const from = useProxyServer ? 'roblox.com' : 'rotunnel.com';
    const to = useProxyServer ? 'rotunnel.com' : 'roblox.com';
    const url = `https://users.${from}/v1/users`;
    const options = { method: 'POST', data: { usernames: ['test'] }, responseType: 'json' };
    assert.equal(wrapped(url, options), result);
    assert.deepEqual(calls.at(-1).args, [`https://users.${to}/v1/users`, options]);
    assert.equal(calls.at(-1).args[1], options);
    assert.equal(wrapped('POST', url, options), result);
    assert.deepEqual(calls.at(-1).args, ['POST', `https://users.${to}/v1/users`, options]);
    assert.equal(calls.at(-1).args[2], options);
  }
});

test('extend returns another isolated mapped service and keeps extend receiver/options intact', () => {
  const original = makeHttp();
  const extended = makeHttp();
  const extensionOptions = { timeout: 2000 };
  original.http.extend = function (options) {
    assert.equal(this, original.http);
    assert.equal(options, extensionOptions);
    return extended.http;
  };
  const wrapped = createRobloxHttp(original.http, { useProxyServer: false });
  const child = wrapped.extend(extensionOptions);
  child.get('https://users.rotunnel.com/v1/users');
  assert.equal(extended.calls[0].args[0], 'https://users.roblox.com/v1/users');
  assert.notEqual(child, extended.http);
  assert.equal(original.calls.length, 0);
});

test('works with a non-callable HTTP object and does not swallow errors', async () => {
  const error = new Error('request failed');
  const http = {
    get(url) {
      assert.equal(this, http);
      assert.equal(url, 'https://users.rotunnel.com/v1/users');
      throw error;
    },
    post() { return Promise.reject(error); }
  };
  const wrapped = createRobloxHttp(http);
  assert.throws(() => wrapped.get('https://users.roblox.com/v1/users'), value => value === error);
  await assert.rejects(wrapped.post('https://users.roblox.com/v1/users'), value => value === error);
});
