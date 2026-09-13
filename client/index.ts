import { Context } from '@koishijs/client'
import Page from './audit.vue'
import AnnouncementPage from './announcement.vue'
import community from './community'
import './index.scss'

export default (ctx: Context) => {
  ctx.page({
    name: 'Roblox 人工审核',
    path: '/roblox-audit',
    // 需要控制台登录用户具备 3 级及以上权限（配合 @koishijs/plugin-auth）
    authority: 3,
    fields: ['roblox-audit'],
    component: Page,
  })
  ctx.page({
    name: 'Roblox 公告管理',
    path: '/roblox-announcement',
    // 公告管理仅限管理员（4 级及以上权限，配合 @koishijs/plugin-auth）
    authority: 4,
    fields: ['roblox-announcement'],
    component: AnnouncementPage,
  })
  community(ctx)
}
