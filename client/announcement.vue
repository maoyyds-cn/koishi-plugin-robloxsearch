<template>
  <k-layout>
    <div :style="{ overflowY: 'auto', height: 'calc(100vh - 48px)' }">
      <div class="rbx-page">
        <header class="rbx-header">
          <div>
            <h2 class="rbx-header__title">公告管理</h2>
            <p class="rbx-header__sub">面向不同等级用户定向投放公告</p>
          </div>
          <div class="rbx-stats">
            <div class="rbx-stat"><b>{{ list.length }}</b><span>全部</span></div>
            <div class="rbx-stat"><b>{{ publishedCount }}</b><span>已发布</span></div>
          </div>
        </header>

        <!-- 编辑表单 -->
        <section v-if="editing" class="rbx-card">
          <div class="rbx-card__head">
            <h3>{{ form.id ? '编辑公告' : '创建公告' }}</h3>
            <span class="rbx-tag rbx-tag--info">原生 Markdown</span>
          </div>
          <div class="rbx-card__body">
            <div class="rbx-fields">
              <div class="rbx-field rbx-field--full">
                <label>标题</label>
                <input v-model="form.title" placeholder="公告标题" />
              </div>
              <div class="rbx-field rbx-field--full">
                <label>内容（原生 Markdown）</label>
                <textarea v-model="form.content" rows="8" placeholder="支持 # 标题、**粗体**、*斜体*、- 列表、[链接](url)、`代码` 等原生 Markdown 语法"></textarea>
              </div>
              <div class="rbx-field">
                <label>触发次数（0=不触发；1=首次使用触发一次；N=最多 N 次）</label>
                <input type="number" min="0" step="1" v-model.number="form.maxTriggers" />
              </div>
              <div class="rbx-field">
                <label>过期时间（留空 = 永不过期）</label>
                <input type="datetime-local" v-model="expiresLocal" />
              </div>
              <div class="rbx-field rbx-field--full">
                <label>定向等级（0 级 = 全体用户，默认）</label>
                <div class="rbx-levels">
                  <label v-for="lv in 8" :key="lv - 1" class="rbx-level">
                    <input type="checkbox" :checked="form.levels.includes(lv - 1)" @change="toggleLevel(lv - 1)" />
                    <span v-if="lv - 1 === 0">0 级（全体用户）</span>
                    <span v-else>{{ lv - 1 }} 级</span>
                  </label>
                </div>
                <p class="rbx-header__sub">投放范围：<template v-if="audience">符合条件用户 <b style="color: var(--rbx-accent)">{{ audience.count }}</b> / 已知用户 {{ audience.total }}</template><template v-else>计算中…</template></p>
              </div>
              <div class="rbx-field rbx-field--full">
                <label>预览</label>
                <div class="rbx-preview" v-html="previewHtml"></div>
              </div>
            </div>
            <div class="rbx-actions">
              <button class="rbx-btn rbx-btn--primary" :disabled="busy" @click="save">保存</button>
              <button class="rbx-btn" :disabled="busy" @click="cancelEdit">取消</button>
            </div>
          </div>
        </section>

        <!-- 公告列表 -->
        <section v-else class="rbx-card">
          <div class="rbx-card__head">
            <h3>公告列表</h3>
            <div class="rbx-toolbar" style="margin-bottom: 0">
              <button class="rbx-btn rbx-btn--primary" @click="startCreate">+ 新建公告</button>
            </div>
          </div>
          <div class="rbx-card__body">
            <table class="rbx-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>状态</th>
                  <th>定向等级</th>
                  <th>触发次数</th>
                  <th>已触达（人 / 次）</th>
                  <th>创建时间</th>
                  <th>发布时间</th>
                  <th>过期时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!list.length"><td colspan="10" class="rbx-empty-cell">暂无公告，点击「新建公告」创建</td></tr>
                <tr v-for="item in list" :key="item.id">
                  <td class="rbx-mono" :title="item.id">{{ item.id.slice(0, 12) }}…</td>
                  <td>{{ item.title }}</td>
                  <td><span class="rbx-tag" :class="statusTag(item.status)">{{ statusName(item.status) }}</span></td>
                  <td>{{ levelsLabel(item.levels) }}</td>
                  <td>{{ item.maxTriggers }}</td>
                  <td>{{ stats[item.id]?.users ?? 0 }} / {{ stats[item.id]?.triggers ?? 0 }}</td>
                  <td>{{ fmtTime(item.createdAt) }}</td>
                  <td>{{ item.publishedAt ? fmtTime(item.publishedAt) : '-' }}</td>
                  <td>{{ item.expiresAt ? fmtTime(item.expiresAt) : '永不过期' }}</td>
                  <td class="rbx-ops">
                    <button class="rbx-btn" :disabled="busy" @click="startEdit(item)">编辑</button>
                    <button v-if="item.status !== 'published'" class="rbx-btn rbx-btn--primary" :disabled="busy" @click="act('publish', item.id)">发布</button>
                    <button v-if="item.status === 'published'" class="rbx-btn" :disabled="busy" @click="act('expire', item.id)">设为过期</button>
                    <button class="rbx-btn rbx-btn--danger" :disabled="busy" @click="remove(item.id)">删除</button>
                  </td>
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
import { computed, ref, watch } from 'vue'
import { store, send, message } from '@koishijs/client'
import { renderMarkdown } from './markdown'

const busy = ref(false)
const editing = ref(false)
const audience = ref<{ count: number; total: number } | null>(null)

const list = computed(() => store['roblox-announcement']?.list ?? [])
const stats = computed(() => store['roblox-announcement']?.stats ?? {})
const publishedCount = computed(() => list.value.filter((i: any) => i.status === 'published').length)

const emptyForm = () => ({ id: '', title: '', content: '', levels: [0] as number[], maxTriggers: 1, expiresAt: 0 })
const form = ref(emptyForm())
const expiresLocal = ref('')

const previewHtml = computed(() => renderMarkdown(form.value.content))

watch(() => form.value.levels.slice(), refreshAudience, { immediate: false })

async function refreshAudience() {
  audience.value = null
  try {
    audience.value = await send('roblox-announcement/audience', form.value.levels as any)
  } catch {
    audience.value = { count: 0, total: 0 }
  }
}

function toggleLevel(level: number) {
  const levels = form.value.levels
  const idx = levels.indexOf(level)
  if (idx >= 0) levels.splice(idx, 1)
  else levels.push(level)
  if (!levels.length) levels.push(0)
  levels.sort((a, b) => a - b)
}

function startCreate() {
  form.value = emptyForm()
  expiresLocal.value = ''
  editing.value = true
  refreshAudience()
}

function startEdit(item: any) {
  form.value = {
    id: item.id,
    title: item.title,
    content: item.content,
    levels: [...item.levels],
    maxTriggers: item.maxTriggers,
    expiresAt: item.expiresAt,
  }
  expiresLocal.value = item.expiresAt ? toLocalInput(item.expiresAt) : ''
  editing.value = true
  refreshAudience()
}

function cancelEdit() {
  editing.value = false
}

async function save() {
  busy.value = true
  try {
    const payload = {
      ...form.value,
      id: form.value.id || undefined,
      expiresAt: expiresLocal.value ? new Date(expiresLocal.value).getTime() : 0,
    }
    const r = await send('roblox-announcement/save', payload as any)
    if (r?.ok) {
      message.success(r.message)
      editing.value = false
    } else {
      message.error(r?.message || '保存失败')
    }
  } catch (e: any) {
    message.error(e?.message || '保存失败')
  } finally {
    busy.value = false
  }
}

async function act(action: 'publish' | 'expire', id: string) {
  busy.value = true
  try {
    const r = await send(`roblox-announcement/${action}` as any, id)
    if (r?.ok) message.success(r.message)
    else message.error(r?.message || '操作失败')
  } catch (e: any) {
    message.error(e?.message || '操作失败')
  } finally {
    busy.value = false
  }
}

async function remove(id: string) {
  if (!window.confirm('确认删除该公告？相关接收记录将一并删除。')) return
  busy.value = true
  try {
    const r = await send('roblox-announcement/delete', id)
    if (r?.ok) message.success(r.message)
    else message.error(r?.message || '删除失败')
  } catch (e: any) {
    message.error(e?.message || '删除失败')
  } finally {
    busy.value = false
  }
}

function statusName(status?: string) {
  return { draft: '草稿', published: '已发布', expired: '已过期' }[status ?? ''] || status
}

function statusTag(status?: string) {
  return { draft: 'rbx-tag--warn', published: 'rbx-tag--ok', expired: 'rbx-tag--muted' }[status ?? ''] || 'rbx-tag--muted'
}

function levelsLabel(levels: number[]) {
  if (levels.includes(0)) return '全体用户'
  return levels.map((v) => `${v} 级`).join('、')
}

function fmtTime(ts?: number) {
  if (!ts) return '-'
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function toLocalInput(ts: number) {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>