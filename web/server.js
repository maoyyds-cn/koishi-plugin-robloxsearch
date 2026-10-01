'use strict';

/*
 * 图床代理服务（复刻 smmcat-robloxservice 用到的 /proxy/image）
 *
 * 接口协议（与插件 lib/features/media.js 的 imageHosting / imageHostingBase64 完全一致）：
 *   POST /proxy/image        请求体：{ "url": "<原始图片URL>" }
 *     成功：{ "code": 0, "localUrl": "<转存后的公网地址>" }
 *     失败：{ "code": 1, "error": "<错误信息>" }
 *   POST /proxy/image-base64 请求体：{ "image": "<base64 图片内容，可带 data: URI 前缀>" }
 *     成功：{ "code": 0, "localUrl": "<转存后的公网地址>" }
 *     失败：{ "code": 1, "error": "<错误信息>" }
 *   GET  /healthz       健康检查：{ "ok": true }
 *
 * 运行环境要求：Node.js >= 18（使用内置 fetch）
 *
 * 部署步骤：
 *   1. npm install
 *   2. 复制 .env.example 为 .env 并按需修改（尤其 PUBLIC_BASE_URL 必须填公网可访问地址）
 *   3. npm start   （生产建议用 pm2 / systemd 守护，并用 Nginx 反代加 HTTPS）
 */

require('dotenv').config();

const express = require('express');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const dns = require('dns/promises');
const net = require('net');

// ---------------- 配置 ----------------
const PORT = Number(process.env.PORT || 3682);
const HOST = process.env.HOST || '0.0.0.0';
// 对外可访问基础地址，用于拼接 localUrl。公网部署必须设置为 https://xxx 之类的地址
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, '');
// 可选鉴权 token：设置后请求须携带 Authorization: Bearer <token>；留空则不做鉴权（兼容现有插件）
const AUTH_TOKEN = (process.env.AUTH_TOKEN || '').trim();
// 可选域名白名单（逗号分隔）：留空=允许任意公网域名（仍会拦截内网 IP，防 SSRF）
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const MAX_SIZE = Number(process.env.MAX_SIZE_MB || 10) * 1024 * 1024;
const KEEP_HOURS = Number(process.env.KEEP_HOURS || 24);
const MAX_REDIRECTS = 3;
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'));

// 允许转存的图片类型 -> 扩展名（刻意排除 svg，避免 XSS）
const EXT_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/x-icon': '.ico',
};

// ---------------- 工具函数 ----------------

// 判断是否为 IPv4 字面量
function isIPv4Literal(host) {
  return net.isIPv4(host);
}

// 判断是否为 IPv6 字面量
function isIPv6Literal(host) {
  return net.isIPv6(host);
}

// 把 IPv6 字面量统一压缩为标准小写形式，便于前缀判断
function normalizeIPv6(ip) {
  return ip.toLowerCase().split('%')[0]; // 去掉 zone id（如 fe80::1%eth0）
}

// 从 IPv6 字面量中提取内嵌的 IPv4 地址，返回点分十进制或 null
// 覆盖 ::ffff:a.b.c.d（映射）、::a.b.c.d（兼容）、64:ff9b::a.b.c.d（NAT64）
function extractIPv4(ip) {
  const lower = normalizeIPv6(ip);
  // ::ffff:127.0.0.1 / ::127.0.0.1 形式
  const embedded = lower.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (embedded) return embedded[1];
  // ::ffff:7f00:1 / ::7f00:1 形式（后 32 位为十六进制 IPv4）
  const tail = lower.match(/:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (tail) {
    const hi = parseInt(tail[1], 16);
    const lo = parseInt(tail[2], 16);
    if (!Number.isNaN(hi) && !Number.isNaN(lo) && hi <= 0xffff && lo <= 0xffff) {
      return [hi >> 8, hi & 0xff, lo >> 8, lo & 0xff].join('.');
    }
  }
  return null;
}

// 判断单个 IP 是否为内网/保留地址，防止 SSRF
function isPrivateIP(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split('.').map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local / 云元数据 169.254.169.254
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a === 192 && b === 0 && c === 0) return true; // IETF 协议保留 192.0.0.0/24（含 192.0.0.170 NAT64 发现）
    if (a === 192 && b === 0 && c === 2) return true; // 文档 192.0.2.0/24
    if (a === 198 && (b === 18 || b === 19)) return true; // 基准测试 198.18.0.0/15
    if (a === 198 && b === 51 && c === 100) return true; // 文档 198.51.100.0/24
    if (a === 203 && b === 0 && c === 113) return true; // 文档 203.0.113.0/24
    if (a >= 224) return true; // 组播 224/4 + 保留 240/4
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = normalizeIPv6(ip);
    if (lower === '::' || lower === '::1') return true;
    // IPv4 映射 / 兼容 / NAT64：内嵌 IPv4 走同一套 IPv4 判定
    if (lower.startsWith('::ffff:') || lower.startsWith('::ffff:0:')) {
      const v4 = extractIPv4(lower);
      if (v4) return isPrivateIP(v4);
    }
    if (lower === '::' || /^::[0-9a-f]{0,4}:[0-9a-f]{0,4}$/.test(lower)) {
      const v4 = extractIPv4(lower);
      if (v4) return isPrivateIP(v4);
    }
    if (lower.startsWith('64:ff9b::')) { // NAT64 转换前缀
      const v4 = extractIPv4(lower);
      if (v4) return isPrivateIP(v4);
    }
    if (lower.startsWith('fe80') || lower.startsWith('fc') || lower.startsWith('fd')) return true; // 链路本地 / ULA
    if (lower.startsWith('fec0')) return true; // 站点本地（已废弃但仍应拦截）
    if (lower.startsWith('ff')) return true; // 组播
    if (lower.startsWith('2001:db8')) return true; // 文档
    if (lower.startsWith('100:') ) return true; // 100::/64 discard-only
    if (/^f[cd]/.test(lower)) return true; // 双保险：所有 fc/fd 开头
    // IPv4 兼容地址：除 :: 和 ::1 外，::x.x.x.x 形式一律按内嵌 IPv4 判定
    const compat = extractIPv4(lower);
    if (compat && lower.startsWith('::')) return isPrivateIP(compat);
    return false;
  }
  return true; // 无法识别的地址一律拦截（fail-closed）
}

// 校验一个 URL 是否安全（协议 + 域名白名单 + DNS 解析后的内网拦截）
// 返回已校验的 IP 列表，供 fetch 的 lookup 钉住使用（防 DNS Rebinding）
async function assertSafeUrl(u) {
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('仅支持 http/https 协议');
  }
  const hostname = u.hostname.toLowerCase();
  if (ALLOWED_HOSTS.length && !ALLOWED_HOSTS.includes(hostname)) {
    throw new Error('目标域名不在白名单内');
  }
  // 解析 IP：字面量直接使用；域名走 DNS 解析
  let ips;
  if (isIPv4Literal(hostname) || isIPv6Literal(hostname)) {
    // IPv6 字面量在 URL 中带方括号，去掉后交给 net 判定
    const bare = hostname.replace(/^\[|\]$/g, '');
    if (isPrivateIP(bare)) {
      throw new Error('目标地址为内网/保留地址，已拦截');
    }
    return [bare];
  }
  // 解析前先拦一次：CNAME / 通配返回内网地址的情况
  const records = await dns.lookup(hostname, { all: true, verbatim: true });
  ips = records.map((r) => r.address);
  if (!ips.length) {
    throw new Error('无法解析目标域名');
  }
  for (const ip of ips) {
    if (isPrivateIP(ip)) {
      throw new Error('目标地址为内网/保留地址，已拦截');
    }
  }
  return ips;
}

// 根据 Content-Type 反推扩展名；必要时用魔数嗅探兜底
function sniffImageType(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length >= 8 && buf.toString('latin1', 0, 8) === '\x89PNG\r\n\x1a\n') return 'image/png';
  if (buf.length >= 6 && (buf.toString('latin1', 0, 6) === 'GIF87a' || buf.toString('latin1', 0, 6) === 'GIF89a')) return 'image/gif';
  if (buf.length >= 12 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

function resolveImageType(contentType, firstChunk) {
  const cType = (contentType || '').split(';')[0].trim().toLowerCase();
  if (EXT_BY_TYPE[cType]) return cType;
  const sniffed = sniffImageType(firstChunk);
  if (sniffed && EXT_BY_TYPE[sniffed]) return sniffed;
  return null;
}

// 流式读取上游响应，累计超过上限立即中断连接并抛错。
// 避免 arrayBuffer() 先把整个响应读进内存、之后才检查大小的做法（可被 chunked 大响应打爆进程）。
async function readUpstreamWithLimit(upstream, maxSize) {
  if (!upstream.body) {
    throw new Error('上游响应无内容');
  }
  const reader = upstream.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || !value.length) continue;
      total += value.length;
      // 先判超限再入数组，避免多占一份内存
      if (total > maxSize) {
        // 主动取消底层连接，阻止上游继续推送数据
        await reader.cancel('image too large').catch(() => {});
        throw new Error('图片超过大小限制');
      }
      chunks.push(Buffer.from(value));
    }
  } catch (err) {
    // read 抛错时同样要释放连接
    await reader.cancel(err && err.message).catch(() => {});
    throw err;
  } finally {
    try { reader.releaseLock(); } catch { /* 已释放 */ }
  }
  if (!total) {
    throw new Error('空图片内容');
  }
  return Buffer.concat(chunks, total);
}

// 处理重定向：手动跟随并逐跳校验
async function fetchFollowingRedirects(urlObj, maxRedirects) {
  let current = urlObj;
  for (let i = 0; i <= maxRedirects; i++) {
    const pinnedIps = await assertSafeUrl(current);
    // 从已校验的 IP 列表中取第一个作为本次连接目标。
    // 通过 fetch 的 lookup 钩子钉住它，避免 fetch 再次解析 DNS 造成 rebinding 绕过。
    const pinned = pinnedIps[0];
    const family = isIPv4Literal(pinned) ? 4 : 6;
    const res = await fetch(current.href, {
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (roblox-image-proxy)' },
      signal: AbortSignal.timeout(15000),
      lookup: (hostname, opts, callback) => {
        if (family === 4) {
          callback(null, pinned, 4);
        } else {
          callback(null, pinned, 6);
        }
      },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      current = new URL(res.headers.get('location'), current);
      continue;
    }
    return res;
  }
  throw new Error('重定向次数过多');
}

// ---------------- 中间件 ----------------

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20mb' }));

// 简单内存限流（按 IP）
const rateMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = Number(process.env.RATE_PER_MIN || 60);
  const rec = rateMap.get(ip);
  if (!rec || now - rec.start > windowMs) {
    rateMap.set(ip, { count: 1, start: now });
  } else {
    rec.count++;
    if (rec.count > limit) {
      res.status(429).json({ code: 1, error: '请求过于频繁' });
      return;
    }
  }
  next();
});

// 可选鉴权
function checkAuth(req, res, next) {
  if (!AUTH_TOKEN) return next();
  const header = req.headers.authorization || '';
  if (header === `Bearer ${AUTH_TOKEN}` || header === AUTH_TOKEN) {
    return next();
  }
  res.status(401).json({ code: 1, error: '未授权' });
}

// ---------------- 路由 ----------------

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

app.post('/proxy/image', checkAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
    if (!rawUrl) {
      return res.json({ code: 1, error: '缺少 url 参数' });
    }

    let urlObj;
    try {
      urlObj = new URL(rawUrl);
    } catch {
      return res.json({ code: 1, error: 'url 格式非法' });
    }

    const upstream = await fetchFollowingRedirects(urlObj, MAX_REDIRECTS);
    if (!upstream.ok) {
      return res.json({ code: 1, error: `上游请求失败：HTTP ${upstream.status}` });
    }

    // 先读内容长度做一次粗校验（可被 chunked 绕过，故仍需流式兜底）
    const contentLength = Number(upstream.headers.get('content-length') || 0);
    if (contentLength > MAX_SIZE) {
      return res.json({ code: 1, error: '图片超过大小限制' });
    }

    // 流式读取，边读边判超限，超限立即 cancel，避免大响应打爆内存
    const buf = await readUpstreamWithLimit(upstream, MAX_SIZE);

    const imageType = resolveImageType(upstream.headers.get('content-type'), buf);
    if (!imageType) {
      return res.json({ code: 1, error: '仅支持转存图片（jpg/png/gif/webp/avif/bmp/ico）' });
    }
    const ext = EXT_BY_TYPE[imageType];

    // 文件名用 url 哈希做去重缓存
    const filename = crypto.createHash('sha1').update(rawUrl).digest('hex') + ext;
    const finalPath = path.join(UPLOAD_DIR, filename);

    // 已存在则直接返回，避免重复下载
    if (!fs.existsSync(finalPath)) {
      const tmpPath = finalPath + '.tmp' + crypto.randomBytes(4).toString('hex');
      await fsp.writeFile(tmpPath, buf);
      await fsp.rename(tmpPath, finalPath);
    }

    return res.json({ code: 0, localUrl: `${PUBLIC_BASE_URL}/uploads/${filename}` });
  } catch (err) {
    return res.json({ code: 1, error: err && err.message ? err.message : '内部错误' });
  }
});

// 直接上传 base64 图片（用于价格趋势图等由上游直接返回 base64 的场景）
app.post('/proxy/image-base64', checkAuth, async (req, res) => {
  try {
    const body = req.body || {};
    let raw = typeof body.image === 'string' ? body.image.trim() : '';
    if (!raw) {
      return res.json({ code: 1, error: '缺少 image 参数' });
    }

    // 兼容 data URI 前缀：data:image/png;base64,xxxx
    const m = raw.match(/^data:[^;]+;base64,(.+)$/i);
    if (m) {
      raw = m[1];
    }

    // 剔除空白并做 base64 合法校验
    const clean = raw.replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 === 1) {
      return res.json({ code: 1, error: 'image 不是合法的 base64' });
    }

    let buf;
    try {
      buf = Buffer.from(clean, 'base64');
    } catch {
      return res.json({ code: 1, error: 'base64 解码失败' });
    }
    if (!buf.length) {
      return res.json({ code: 1, error: '空图片内容' });
    }
    if (buf.length > MAX_SIZE) {
      return res.json({ code: 1, error: '图片超过大小限制' });
    }

    const imageType = sniffImageType(buf);
    if (!imageType || !EXT_BY_TYPE[imageType]) {
      return res.json({ code: 1, error: '仅支持图片（jpg/png/gif/webp/avif/bmp/ico）' });
    }
    const ext = EXT_BY_TYPE[imageType];

    // 用内容哈希做去重缓存
    const filename = crypto.createHash('sha1').update(clean).digest('hex') + ext;
    const finalPath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(finalPath)) {
      const tmpPath = finalPath + '.tmp' + crypto.randomBytes(4).toString('hex');
      await fsp.writeFile(tmpPath, buf);
      await fsp.rename(tmpPath, finalPath);
    }

    return res.json({ code: 0, localUrl: `${PUBLIC_BASE_URL}/uploads/${filename}` });
  } catch (err) {
    return res.json({ code: 1, error: err && err.message ? err.message : '内部错误' });
  }
});

// 静态托管转存后的图片
app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '7d',
  immutable: true,
  fallthrough: false,
}));

// ---------------- 启动 ----------------

async function ensureUploadDir() {
  await fsp.mkdir(UPLOAD_DIR, { recursive: true });
}

// 定期清理过期图片，防止磁盘写满
async function cleanup() {
  try {
    const keepMs = KEEP_HOURS * 3600 * 1000;
    const files = await fsp.readdir(UPLOAD_DIR);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(UPLOAD_DIR, f);
      const st = await fsp.stat(p).catch(() => null);
      if (st && now - st.mtimeMs > keepMs) {
        await fsp.unlink(p).catch(() => {});
      }
    }
  } catch {
    /* 忽略清理失败 */
  }
}

ensureUploadDir().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`[proxy] 监听 http://${HOST}:${PORT}`);
    console.log(`[proxy] PUBLIC_BASE_URL = ${PUBLIC_BASE_URL}`);
    console.log(`[proxy] 上传目录 = ${UPLOAD_DIR}`);
    if (!AUTH_TOKEN) {
      console.log('[proxy] 提示：未设置 AUTH_TOKEN，接口未鉴权，请注意安全');
    }
  });
  setInterval(cleanup, 3600 * 1000).unref();
}).catch((err) => {
  console.error('[proxy] 启动失败：', err);
  process.exit(1);
});