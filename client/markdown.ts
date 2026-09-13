/**
 * 轻量 Markdown 预览渲染（零依赖）
 *
 * 仅用于控制台公告编辑器的本地预览，覆盖公告常用语法：
 * 标题、粗体、斜体、行内代码、代码块、引用、无序/有序列表、链接、图片、分割线。
 * 所有文本先经 HTML 转义，链接协议仅放行 http/https，防止 XSS。
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : '#'
}

function renderInline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, url) => `<img src="${safeUrl(url)}" alt="${alt}" referrerpolicy="no-referrer" />`)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`)
  out = out.replace(/(\*\*|__)([^*_]+)\1/g, '<strong>$2</strong>')
  out = out.replace(/(\*|_)([^*_]+)\1/g, '<em>$2</em>')
  return out
}

export function renderMarkdown(content: string): string {
  const lines = (content || '').split(/\r?\n/)
  const html: string[] = []
  let inCode = false
  let codeBuffer: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }

  for (const line of lines) {
    if (/^```/.test(line)) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
        codeBuffer = []
        inCode = false
      } else {
        closeList()
        inCode = true
      }
      continue
    }
    if (inCode) {
      codeBuffer.push(line)
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeList()
      const depth = heading[1].length
      html.push(`<h${depth}>${renderInline(heading[2])}</h${depth}>`)
      continue
    }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      closeList()
      html.push('<hr />')
      continue
    }
    const quote = line.match(/^\s*>\s?(.*)$/)
    if (quote) {
      closeList()
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`)
      continue
    }
    const ulItem = line.match(/^\s*[-*+]\s+(.*)$/)
    if (ulItem) {
      if (listType !== 'ul') { closeList(); html.push('<ul>'); listType = 'ul' }
      html.push(`<li>${renderInline(ulItem[1])}</li>`)
      continue
    }
    const olItem = line.match(/^\s*\d+\.\s+(.*)$/)
    if (olItem) {
      if (listType !== 'ol') { closeList(); html.push('<ol>'); listType = 'ol' }
      html.push(`<li>${renderInline(olItem[1])}</li>`)
      continue
    }
    closeList()
    if (line.trim()) html.push(`<p>${renderInline(line)}</p>`)
  }
  if (inCode) html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
  closeList()
  return html.join('\n')
}
