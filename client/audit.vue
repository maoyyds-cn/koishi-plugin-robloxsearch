<template>
  <k-layout>
    <div :style="{ overflowY: 'auto', height: 'calc(100vh - 48px)' }">
      <div class="rbx-page">
        <header class="rbx-header">
          <div>
            <h2 class="rbx-header__title">人工审核</h2>
            <p class="rbx-header__sub">Roblox 内容安全 · 待处理与历史裁定</p>
          </div>
          <div class="rbx-stats">
            <div class="rbx-stat"><b>{{ pending.length }}</b><span>待审</span></div>
            <div class="rbx-stat"><b>{{ log.length }}</b><span>日志</span></div>
          </div>
        </header>

        <section class="rbx-card">
          <div class="rbx-card__head">
            <h3>待审记录</h3>
            <span class="rbx-tag rbx-tag--warn">{{ pending.length }} 条待处理</span>
          </div>
          <div class="rbx-card__body">
            <div v-if="!pending.length" class="rbx-empty">暂无待审记录</div>
            <div v-else class="rbx-audit-grid">
              <article v-for="item in pending" :key="item.id" class="rbx-audit">
                <div class="audit-media">
                  <img v-if="item.pic" :src="item.pic" referrerpolicy="no-referrer" />
                  <div v-else class="audit-media__none">（无图片，文本命中）</div>
                </div>
                <div class="audit-main">
                  <div class="audit-meta"><b>记录 ID：</b>{{ item.id }}</div>
                  <div class="audit-meta"><b>调用者：</b>{{ item.reporterId }}<template v-if="item.reporterName && item.reporterName !== item.reporterId">（{{ item.reporterName }}）</template></div>
                  <div class="audit-meta"><b>目标：</b>{{ targetTypeName(item.targetType) }} {{ item.targetName || item.targetId || '-' }}<template v-if="item.targetId">（ID: {{ item.targetId }}）</template></div>
                  <div class="audit-meta"><b>违规类型：</b>{{ item.violationType }}</div>
                  <div class="audit-meta"><b>命中原因：</b>{{ item.reason || '-' }}</div>
                  <div class="audit-meta"><b>提交时间：</b>{{ fmtTime(item.createdAt) }}</div>
                  <div class="audit-summary">{{ item.summary }}</div>
                  <div class="audit-actions">
                    <button class="rbx-btn rbx-btn--danger" :disabled="busy === item.id" @click="resolve(item.id, 'violation')">违规</button>
                    <button class="rbx-btn rbx-btn--success" :disabled="busy === item.id" @click="resolve(item.id, 'ok')">不违规</button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section class="rbx-card">
          <div class="rbx-card__head">
            <h3>审核日志</h3>
            <span class="rbx-tag rbx-tag--muted">最近 {{ log.length }} 条</span>
          </div>
          <div class="rbx-card__body">
            <table class="rbx-table">
              <thead>
                <tr>
                  <th>记录 ID</th>
                  <th>调用者 ID</th>
                  <th>目标</th>
                  <th>命中原因</th>
                  <th>提交时间</th>
                  <th>审核前状态</th>
                  <th>审核后状态</th>
                  <th>裁定结果</th>
                  <th>处罚</th>
                  <th>审核时间</th>
                  <th>审核人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!log.length"><td colspan="11" class="rbx-empty-cell">暂无日志</td></tr>
                <tr v-for="item in log" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.reporterId }}</td>
                  <td>{{ targetTypeName(item.targetType) }} {{ item.targetName || item.targetId || '-' }}</td>
                  <td>{{ item.reason || '-' }}</td>
                  <td>{{ fmtTime(item.createdAt) }}</td>
                  <td>待审核</td>
                  <td><span class="rbx-tag" :class="statusTag(item.status)">{{ statusName(item.status) }}</span></td>
                  <td>{{ item.verdict === 'violation' ? '违规' : item.verdict === 'ok' ? '不违规' : '-' }}</td>
                  <td>{{ item.appliedLevel ? `${item.appliedLevel} / ${item.appliedDays ?? '-'} 天` : '-' }}</td>
                  <td>{{ item.resolvedAt ? fmtTime(item.resolvedAt) : '-' }}</td>
                  <td>{{ item.resolvedBy || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </k-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { store, send, message } from '@koishijs/client'

const busy = ref('')

const pending = computed(() => store['roblox-audit']?.pending ?? [])
const log = computed(() => store['roblox-audit']?.log ?? [])

function fmtTime(ts?: number) {
  if (!ts) return '-'
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function targetTypeName(type?: string) {
  return { user: '用户', game: '游戏', group: '群组' }[type ?? ''] || ''
}

function statusName(status?: string) {
  return { pending: '待审核', approved: '已裁定违规', rejected: '已裁定误判' }[status ?? ''] || status
}

function statusTag(status?: string) {
  return { pending: 'rbx-tag--warn', approved: 'rbx-tag--danger', rejected: 'rbx-tag--ok' }[status ?? ''] || 'rbx-tag--muted'
}

async function resolve(id: string, verdict: 'violation' | 'ok') {
  busy.value = id
  try {
    const r = await send('roblox-audit/resolve', id, verdict as any)
    if (r?.ok) message.success(r.message)
    else message.error(r?.message || '操作失败')
  } catch (e: any) {
    message.error(e?.message || '操作失败')
  } finally {
    busy.value = ''
  }
}
</script>