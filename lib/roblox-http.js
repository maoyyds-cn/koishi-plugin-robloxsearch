'use strict';

const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch', 'head', 'options']);

// Only pass API request URLs here, never display links or user-supplied download URLs.
function resolveRobloxUrl(url, useProxyServer = true) {
  if (typeof url !== 'string') return url;
  const parts = /^(https?:\/\/)([^/?#]*)([\s\S]*)$/i.exec(url);
  if (!parts) return url;
  const host = /^((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*)(roblox\.com|rotunnel\.com)(:\d+)?$/i.exec(parts[2]);
  if (!host) return url;
  try {
    new URL(url);
  } catch {
    return url;
  }
  const domain = useProxyServer === false ? 'roblox.com' : 'rotunnel.com';
  if (host[2].toLowerCase() === domain) return url;
  // Keep the original path, query, fragment and explicit port byte-for-byte.
  return parts[1] + host[1] + domain + (host[3] || '') + parts[3];
}

function isCustomApiUrl(url, apiServer) {
  if (typeof url !== 'string' || typeof apiServer !== 'string' || !apiServer.trim()) return false;
  try {
    const base = new URL(apiServer.trim());
    const request = new URL(url);
    const path = base.pathname.replace(/\/+$/, '');
    return request.origin === base.origin &&
      (request.pathname === path || request.pathname.startsWith(path + '/'));
  } catch {
    return false;
  }
}

function isRotunnelUrl(url) {
  return typeof url === 'string' && /^https?:\/\/(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*rotunnel\.com\b/i.test(url);
}

// Fallback only for network-level failures (no response) or server errors (5xx).
// 4xx (e.g. 用户不存在/无权限) 在官方域名下结果一致，不需要重复请求。
function shouldFallback(err) {
  if (!err) return true;
  if (!err.response) return true;
  const status = err.response.status;
  return typeof status === 'number' && status >= 500;
}

function attemptWithFallback(exec, resolved, config) {
  if (config.useProxyServer === false || !isRotunnelUrl(resolved)) {
    return exec(resolved);
  }
  return exec(resolved).catch(err => {
    if (!shouldFallback(err)) throw err;
    const official = resolveRobloxUrl(resolved, false);
    if (official === resolved) throw err;
    console.log('[roblox-http] 代理请求失败，回退官方域名:', official);
    return exec(official);
  });
}

function createRobloxHttp(http, config = {}) {
  const resolve = url => isCustomApiUrl(url, config.apiServer)
    ? url
    : resolveRobloxUrl(url, config.useProxyServer);

  return new Proxy(http, {
    get(target, property) {
      const value = Reflect.get(target, property, target);
      if (typeof value !== 'function') return value;
      if (HTTP_METHODS.has(property)) {
        return (url, ...args) => attemptWithFallback(
          u => Reflect.apply(value, target, [u, ...args]),
          resolve(url),
          config
        );
      }
      if (property === 'extend') {
        return (...args) => createRobloxHttp(Reflect.apply(value, target, args), config);
      }
      return value.bind(target);
    },
    apply(target, thisArg, args) {
      // Support both Koishi HTTP callable forms: (url, config) and (method, url, config).
      const index = typeof args[0] === 'string' && HTTP_METHODS.has(args[0].toLowerCase()) ? 1 : 0;
      const forwarded = args.slice();
      if (index < forwarded.length) {
        const resolved = resolve(forwarded[index]);
        return attemptWithFallback(
          u => {
            forwarded[index] = u;
            return Reflect.apply(target, target, forwarded);
          },
          resolved,
          config
        );
      }
      return Reflect.apply(target, target, forwarded);
    }
  });
}

module.exports = { resolveRobloxUrl, createRobloxHttp };