import { h, defineComponent, ref, resolveComponent } from 'vue'
import { send, message, type Context } from '@koishijs/client'

const CommunityComponent = defineComponent({
  setup() {
    const list = ref<any[]>([])
    const editing = ref(false)
    const form = ref<any>({})
    const saving = ref(false)

    async function load() {
      try {
        list.value = (await send('roblox-community/list')) || []
      } catch {
        list.value = []
      }
    }
    load()

    const enabledCount = () => list.value.filter((i: any) => i.enabled).length

    function addNew() {
      form.value = {
        id: '', name: '', icon: '', cover: '', intro: '',
        owner: '', qqGroupNumber: '', groupId: '', memberCount: 0,
        enabled: true, order: 0,
      }
      editing.value = true
    }

    function edit(item: any) {
      form.value = { ...item }
      editing.value = true
    }

    async function save() {
      const re = /^[\u4e00-\u9fa5A-Za-z0-9\s]+$/
      if (form.value.name && !re.test(form.value.name)) {
        message.error('社群名称仅支持中文、英文、数字，不能包含特殊符号')
        return
      }
      if (form.value.intro && !re.test(form.value.intro)) {
        message.error('社群介绍仅支持中文、英文、数字，不能包含特殊符号')
        return
      }
      saving.value = true
      try {
        const r = await send('roblox-community/save', form.value)
        if (r?.ok) {
          message.success(r.message)
          editing.value = false
          load()
        } else {
          message.error(r?.message || '保存失败')
        }
      } catch (e: any) {
        message.error(e?.message || '保存失败')
      } finally {
        saving.value = false
      }
    }

    async function remove(id: string) {
      if (!confirm('确认删除该社群？')) return
      try {
        const r = await send('roblox-community/delete', id)
        if (r?.ok) {
          message.success(r.message)
          load()
        } else {
          message.error(r?.message || '删除失败')
        }
      } catch {}
    }

    function setField(key: string) {
      return (e: Event) => {
        form.value[key] = (e.target as HTMLInputElement).value
      }
    }

    function setNum(key: string) {
      return (e: Event) => {
        form.value[key] = Number((e.target as HTMLInputElement).value) || 0
      }
    }

    function field(label: string, input: any, extraClass = '') {
      return h('div', { class: 'rbx-field ' + extraClass }, [
        h('label', null, label),
        input,
      ])
    }

    const toolbarBtn = (label: string, cls: string, onClick: any) =>
      h('button', { class: 'rbx-btn ' + cls, onClick }, label)

    return () => {
      const KLayout = resolveComponent('k-layout')
      return h(KLayout, null, {
        default: () => h('div', { class: 'rbx-page' }, [
          // 头部
          h('header', { class: 'rbx-header' }, [
            h('div', null, [
              h('h2', { class: 'rbx-header__title' }, editing.value
                ? (form.value.id ? '编辑社群' : '创建社群')
                : '社群推荐管理'),
              h('p', { class: 'rbx-header__sub' }, '管理 ROBLOX 社群推荐与排序'),
            ]),
            h('div', { class: 'rbx-stats' }, [
              h('div', { class: 'rbx-stat' }, [h('b', null, String(list.value.length)), h('span', null, '全部')]),
              h('div', { class: 'rbx-stat' }, [h('b', null, String(enabledCount())), h('span', null, '启用')]),
            ]),
          ]),

          editing.value
            ? h('section', { class: 'rbx-card' }, [
                h('div', { class: 'rbx-card__head' }, [
                  h('h3', null, form.value.id ? '编辑社群' : '创建社群'),
                ]),
                h('div', { class: 'rbx-card__body' }, [
                  h('div', { class: 'rbx-fields' }, [
                    field('社群名称（指令名，仅中文/英文/数字）',
                      h('input', { value: form.value.name, onInput: setField('name'), placeholder: '如：XXX社群' })),
                    field('图标 URL',
                      h('input', { value: form.value.icon, onInput: setField('icon'), placeholder: 'https://...' })),
                    field('介绍图片 URL',
                      h('input', { value: form.value.cover, onInput: setField('cover'), placeholder: 'https://...' })),
                    field('群主名称',
                      h('input', { value: form.value.owner, onInput: setField('owner'), placeholder: '群主昵称' })),
                    field('QQ 群号（用于复制）',
                      h('input', { value: form.value.qqGroupNumber, onInput: setField('qqGroupNumber'), placeholder: '如：123456789' })),
                    field('QQ 群 Guild ID（留空用兜底人数）',
                      h('input', { value: form.value.groupId, onInput: setField('groupId'), placeholder: 'QQ 群的 guildId' })),
                    field('兜底人数',
                      h('input', { type: 'number', min: '0', value: form.value.memberCount, onInput: setNum('memberCount') })),
                    field('排序（数字越小越靠前）',
                      h('input', { type: 'number', value: form.value.order, onInput: setNum('order') })),
                    field('社群介绍（仅中文/英文/数字）',
                      h('textarea', { value: form.value.intro, onInput: setField('intro'), rows: 3, placeholder: '社群介绍文字' }), 'rbx-field--full'),
                    field('启用',
                      h('input', { type: 'checkbox', checked: form.value.enabled, onChange: (e: Event) => form.value.enabled = (e.target as HTMLInputElement).checked }), 'rbx-field--full'),
                  ]),
                  h('div', { class: 'rbx-actions' }, [
                    toolbarBtn('保存', 'rbx-btn--primary', save),
                    toolbarBtn('取消', '', () => editing.value = false),
                  ]),
                ]),
              ])
            : h('section', { class: 'rbx-card' }, [
                h('div', { class: 'rbx-card__head' }, [
                  h('h3', null, `社群列表（共 ${list.value.length} 个）`),
                  h('div', { class: 'rbx-toolbar', style: 'margin-bottom:0' }, [
                    toolbarBtn('+ 新增社群', 'rbx-btn--primary', addNew),
                  ]),
                ]),
                h('div', { class: 'rbx-card__body' }, [
                  h('table', { class: 'rbx-table' }, [
                    h('thead', null, h('tr', null, [
                      h('th', null, '图标'),
                      h('th', null, '名称'),
                      h('th', null, '群号'),
                      h('th', null, '人数'),
                      h('th', null, '状态'),
                      h('th', null, '操作'),
                    ])),
                    h('tbody', null,
                      list.value.length === 0
                        ? h('tr', null, h('td', { colSpan: 6, class: 'rbx-empty-cell' }, '暂无社群，点击「新增社群」创建'))
                        : list.value.map((item: any) => h('tr', { key: item.id }, [
                            h('td', null, item.icon
                              ? h('img', { src: item.icon, class: 'rbx-icon', referrerpolicy: 'no-referrer' })
                              : h('span', null, '-')),
                            h('td', null, item.name || '-'),
                            h('td', null, item.qqGroupNumber || '-'),
                            h('td', null, String(item.memberCount || 0)),
                            h('td', null, h('span', { class: 'rbx-tag ' + (item.enabled ? 'rbx-tag--ok' : 'rbx-tag--muted') }, item.enabled ? '启用' : '禁用')),
                            h('td', { class: 'rbx-ops' }, [
                              h('button', { class: 'rbx-btn', onClick: () => edit(item) }, '编辑'),
                              h('button', { class: 'rbx-btn rbx-btn--danger', onClick: () => remove(item.id) }, '删除'),
                            ]),
                          ])),
                    ),
                  ]),
                ]),
              ]),
        ]),
      })
    }
  },
})

export default (ctx: Context) => {
  ctx.page({
    name: 'Roblox 社群管理',
    path: '/roblox-community',
    authority: 4,
    component: CommunityComponent,
  })
}