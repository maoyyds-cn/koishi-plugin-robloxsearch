'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Linter } = require('eslint');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const featureRoot = path.join(root, 'lib/features');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

test('all shipped modules parse and have no unresolved JavaScript bindings', () => {
  const linter = new Linter();
  const globals = Object.fromEntries(['require', 'module', '__dirname', 'console', 'Buffer', 'process', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'URL', 'URLSearchParams', 'structuredClone'].map(name => [name, 'readonly']));
  const errors = [];
  for (const file of files(path.join(root, 'lib')).filter(file => file.endsWith('.js') && (file.includes(path.sep + 'features' + path.sep) || ['index.js', 'assemble.js', 'roblox-http.js'].includes(path.basename(file))))) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const source = fs.readFileSync(file, 'utf8');
    for (const message of linter.verify(source, [{ languageOptions: { sourceType: 'commonjs', ecmaVersion: 'latest', globals }, rules: { 'no-undef': 'error', 'no-const-assign': 'error' } }])) {
      errors.push(`${path.relative(root, file)}:${message.line} ${message.message}`);
    }
  }
  assert.deepEqual(errors, []);
});

function mockContext() {
  const events = [], commands = [], middlewares = [], injections = [];
  const ctx = {
    http: { get: async () => ({}), post: async () => ({}) },
    database: { extend() {}, get: async () => [] },
    before: (name, callback) => events.push({ name, callback }),
    on: (name, callback) => events.push({ name, callback }),
    middleware: callback => middlewares.push(callback),
    inject: (names, callback) => injections.push({ names, callback }),
    command(name, description, options) {
      const command = { name, description, options, aliases: [], actions: [], alias(...names) { this.aliases.push(...names); return this; }, action(callback) { this.actions.push(callback); return this; }, option() { return this; }, userFields() { return this; }, channelFields() { return this; }, shortcut() { return this; } };
      commands.push(command);
      return command;
    },
  };
  return { ctx, events, commands, middlewares, injections };
}

test('package entry loads real Koishi schema and registers every original static command', () => {
  const plugin = require('..');
  const mock = mockContext();
  assert.equal(plugin.name, 'smmcat-robloxservice');
  assert.equal(plugin.Config({}).useProxyServer, true);
  assert.deepEqual(plugin.inject.required, ['localstorage', 'monetary', 'database']);
  const originalGet = mock.ctx.http.get;
  plugin.apply(mock.ctx, plugin.Config({}));
  assert.equal(mock.ctx.http.get, originalGet);
  assert.deepEqual(mock.commands.map(command => command.name).sort(), require('./command-manifest.json').slice().sort());
  assert.ok(mock.events.some(event => event.name === 'ready'));
  assert.ok(mock.events.some(event => event.name === 'interaction/button'));
});

test('service instances are isolated and all declared feature dependencies exist', () => {
  const { createServices } = require('../lib/assemble');
  const { Config } = require('..');
  const first = createServices(mockContext().ctx, Config({}));
  const second = createServices(mockContext().ctx, Config({}));
  assert.notEqual(first.userLocal, second.userLocal);
  assert.notEqual(first.pointsStore, second.pointsStore);
  assert.notEqual(first.queues, second.queues);
  const missing = [];
  for (const file of files(featureRoot)) {
    const source = fs.readFileSync(file, 'utf8');
    const names = [...new Set([...source.matchAll(/\bdeps\.([\w$]+)/g)].map(match => match[1]))];
    for (const name of names) if (!(name in first)) missing.push([path.relative(featureRoot, file), name]);
    if (process.env.PRINT_DEPENDENCIES) console.log(JSON.stringify(path.relative(featureRoot, file).replaceAll('\\', '/').replace(/\.js$/, '')) + ': ' + JSON.stringify(names) + ',');
  }
  assert.deepEqual(missing, []);
});
module.exports = { mockContext };
