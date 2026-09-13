'use strict';

module.exports = function create(deps) {
const apiServer = deps.config.apiServer;
const useOfficialApi = !apiServer || String(apiServer).trim() === "";
const robloxApi = function () {
  const _0xorigGet = deps.robloxHttp.get.bind(deps.robloxHttp);
  const _0xorigPost = deps.robloxHttp.post ? deps.robloxHttp.post.bind(deps.robloxHttp) : null;
  async function _0xadapter(_0xurl) {
    for (let _0xretry = 0; _0xretry < 3; _0xretry++) {
      try {
        let _0xm;
        if (_0xm = _0xurl.match(/^\/query-username\/(.+)$/)) {
          const _0xname = decodeURIComponent(_0xm[1]);
          if (_0xorigPost) {
            const _0xsr = await _0xorigPost("https://users.rotunnel.com/v1/usernames/users", {
              usernames: [_0xname],
              excludeBannedUsers: true
            }, {
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Roblox-Windows/1.0"
              }
            });
            const _0xu = _0xsr?.data?.[0];
            if (!_0xu) {
              return {
                data: null
              };
            }
            const _0xd = await _0xorigGet("https://users.rotunnel.com/v1/users/" + _0xu.id);
            const _0xfr = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xu.id + "/friends/count");
            const _0xfw = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xu.id + "/followers/count");
            const _0xfg = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xu.id + "/followings/count");
            return {
              data: {
                userId: _0xu.id,
                username: _0xu.name,
                displayName: _0xu.displayName,
                blurb: _0xd?.description || "",
                hasVerifiedBadge: _0xu.hasVerifiedBadge || false,
                isBanned: false,
                age: _0xd?.age || 0,
                isPremium: false,
                isRobloxStaff: false,
                language: "en",
                joinDate: _0xd?.created || "",
                lastOnline: _0xd?.lastOnline || "",
                followerCount: _0xfw?.count || 0,
                followingCount: _0xfg?.count || 0,
                friendCount: _0xfr?.count || 0
              }
            };
          }
        }
        if (_0xm = _0xurl.match(/^\/query-userid\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://users.rotunnel.com/v1/users/" + _0xid);
          return {
            data: {
              userId: _0xr.id,
              username: _0xr.name,
              displayName: _0xr.displayName,
              blurb: _0xr.description || "",
              hasVerifiedBadge: _0xr.hasVerifiedBadge || false,
              isBanned: false,
              age: _0xr.age || 0,
              isPremium: false,
              isRobloxStaff: false,
              language: "en",
              joinDate: _0xr.created || "",
              lastOnline: _0xr.lastOnline || "",
              followerCount: 0,
              followingCount: 0,
              friendCount: 0
            }
          };
        }
        if (_0xm = _0xurl.match(/^\/get-user-avatar\/(.+)$/)) {
          const _0xname = decodeURIComponent(_0xm[1]);
          if (_0xorigPost) {
            const _0xsr = await _0xorigPost("https://users.rotunnel.com/v1/usernames/users", {
              usernames: [_0xname],
              excludeBannedUsers: true
            }, {
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Roblox-Windows/1.0"
              }
            });
            const _0xu = _0xsr?.data?.[0];
            if (!_0xu) {
              return {
                data: [],
                id: 0
              };
            }
            const _0xtr = await _0xorigGet("https://thumbnails.rotunnel.com/v1/users/avatar-headshot?userIds=" + _0xu.id + "&size=150x150&format=Png&isCircular=false");
            return {
              data: _0xtr?.data?.map(_0xi => ({
                imageUrl: _0xi.imageUrl
              })) || [],
              id: _0xu.id
            };
          }
          return null;
        }
        if (_0xm = _0xurl.match(/^\/get-user-body\/(.+)$/)) {
          const _0xname = decodeURIComponent(_0xm[1]);
          if (_0xorigPost) {
            const _0xsr = await _0xorigPost("https://users.rotunnel.com/v1/usernames/users", {
              usernames: [_0xname],
              excludeBannedUsers: true
            }, {
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Roblox-Windows/1.0"
              }
            });
            const _0xu = _0xsr?.data?.[0];
            if (!_0xu) {
              return {
                data: []
              };
            }
            const _0xtr = await _0xorigGet("https://thumbnails.rotunnel.com/v1/users/avatar?userIds=" + _0xu.id + "&size=420x420&format=Png&isCircular=false");
            return {
              data: _0xtr?.data?.map(_0xi => ({
                imageUrl: _0xi.imageUrl
              })) || []
            };
          }
          return null;
        }
        if (_0xm = _0xurl.match(/^\/query-past-names\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://users.rotunnel.com/v1/users/" + _0xid + "/username-history");
          return {
            data: _0xr?.data?.map(_0xi => _0xi.name) || []
          };
        }
        if (_0xm = _0xurl.match(/^\/query-group\/(.+)$/)) {
          const _0xname = decodeURIComponent(_0xm[1]);
          const _0xsr = await _0xorigGet("https://groups.rotunnel.com/v1/groups/search?keyword=" + encodeURIComponent(_0xname) + "&limit=10");
          const _0xg = _0xsr?.data?.[0];
          if (!_0xg) {
            return {
              data: null
            };
          }
          const _0xd = await _0xorigGet("https://groups.rotunnel.com/v1/groups/" + _0xg.id);
          return {
            data: {
              id: _0xd.id,
              name: _0xd.name,
              description: _0xd.description || "",
              memberCount: _0xd.memberCount || 0,
              hasVerifiedBadge: _0xd.hasVerifiedBadge || false,
              owner: {
                username: _0xd?.owner?.username || "",
                id: _0xd?.owner?.id || 0
              },
              publicEntryAllowed: _0xd.publicEntryAllowed || false,
              shout: _0xd.shout ? {
                body: _0xd.shout.body,
                poster: {
                  username: _0xd.shout.poster.username
                }
              } : null
            }
          };
        }
        if (_0xm = _0xurl.match(/^\/query-groupid\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://groups.rotunnel.com/v1/groups/" + _0xid);
          return {
            data: {
              id: _0xr.id,
              name: _0xr.name,
              description: _0xr.description || "",
              memberCount: _0xr.memberCount || 0,
              hasVerifiedBadge: _0xr.hasVerifiedBadge || false,
              owner: {
                username: _0xr?.owner?.username || "",
                id: _0xr?.owner?.id || 0
              },
              publicEntryAllowed: _0xr.publicEntryAllowed || false,
              shout: _0xr.shout ? {
                body: _0xr.shout.body,
                poster: {
                  username: _0xr.shout.poster.username
                }
              } : null
            }
          };
        }
        if (_0xm = _0xurl.match(/^\/get-group-icon\/(.+)$/)) {
          const _0xkey = decodeURIComponent(_0xm[1]);
          let _0xgid = _0xkey;
          let _0xgname = _0xkey;
          if (!/^\d+$/.test(_0xkey)) {
            const _0xsr = await _0xorigGet("https://groups.rotunnel.com/v1/groups/search?keyword=" + encodeURIComponent(_0xkey) + "&limit=10");
            const _0xg = _0xsr?.data?.[0];
            if (!_0xg) {
              return {
                data: null
              };
            }
            _0xgid = "" + _0xg.id;
            _0xgname = _0xg.name;
          }
          const _0xr = await _0xorigGet("https://thumbnails.rotunnel.com/v1/groups/icons?groupIds=" + _0xgid + "&size=150x150&format=Png&isCircular=false");
          const _0xit = _0xr?.data?.[0];
          return {
            data: {
              thumbnailUrl: _0xit?.imageUrl || "",
              groupId: _0xgid,
              groupName: _0xgname
            }
          };
        }
        if (_0xm = _0xurl.match(/^\/get-user-friend\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xid + "/friends?limit=100");
          return {
            data: _0xr?.data?.map(_0xi => ({
              id: _0xi.id,
              name: _0xi.name,
              displayName: _0xi.displayName
            })) || []
          };
        }
        if (_0xm = _0xurl.match(/^\/get-user-followers\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xid + "/followers?limit=100");
          return {
            data: _0xr?.data?.map(_0xi => ({
              id: _0xi.id,
              name: _0xi.name,
              displayName: _0xi.displayName
            })) || []
          };
        }
        if (_0xm = _0xurl.match(/^\/get-user-followings\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://friends.rotunnel.com/v1/users/" + _0xid + "/followings?limit=100");
          return {
            data: _0xr?.data?.map(_0xi => ({
              id: _0xi.id,
              name: _0xi.name,
              displayName: _0xi.displayName
            })) || []
          };
        }
        if (_0xm = _0xurl.match(/^\/get-game-pic\/(.+)$/)) {
          const _0xid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://thumbnails.rotunnel.com/v1/games/icons?universeIds=" + _0xid + "&size=512x512&format=Png&isCircular=false");
          return {
            success: true,
            data: _0xr?.data?.[0]?.imageUrl || ""
          };
        }
        if (_0xm = _0xurl.match(/^\/search-game\/(.+)$/)) {
          const _0xpid = decodeURIComponent(_0xm[1]);
          const _0xr = await _0xorigGet("https://games.rotunnel.com/v1/games?placeIds=" + _0xpid);
          return {
            data: _0xr?.data?.map(_0xi => ({
              id: _0xi.placeId,
              maxPlayers: _0xi.maxPlayers || 0,
              playing: _0xi.playing || 0,
              playerTokens: [],
              players: [],
              fps: 0,
              ping: 0
            })) || [],
            pic: ""
          };
        }
        return null;
      } catch (_0xe) {
        if (_0xretry < 2) {
          await new Promise(_0xr => setTimeout(_0xr, (_0xretry + 1) * 1000));
          continue;
        }
        console.log("[adapter] retry exhausted:", _0xe?.message);
        throw _0xe;
      }
    }
  }
  return {
    get: async function (_0xpath, ..._0xargs) {
      if (useOfficialApi) {
        const _0xad = await _0xadapter(_0xpath);
        if (_0xad !== null) {
          return _0xad;
        }
      }
      const options = _0xargs[0] || {};
      const token = deps.config.bffAccessToken?.trim();
      return deps.ctx.http.get(apiServer + _0xpath, {
        ...options,
        headers: {
          ...options.headers,
          ...(token ? {
            "x-bff-token": token
          } : {})
        }
      });
    }
  };
}();
return { get apiServer() { return apiServer; },
get useOfficialApi() { return useOfficialApi; },
get robloxApi() { return robloxApi; } };
};
