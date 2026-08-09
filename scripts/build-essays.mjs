#!/usr/bin/env node
// Rewrites the essay list in index.html from the Substack RSS feed.
// No dependencies. Run it by hand, on every Netlify build, and on a daily
// GitHub Action. If the feed is unreachable the file is left exactly as it is,
// so a flaky network can never blank the section or fail a deploy.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const FEED = 'https://wiktorloboda.substack.com/feed'
const PINNED = 'The Cognitive Forest'
const MAX = 10

const BEGIN = '<!-- essays:begin'
const END = '<!-- essays:end -->'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = join(root, 'index.html')

function unescapeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&')
    .trim()
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tag(item, name) {
  const match = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return match ? unescapeXml(match[1]) : ''
}

function parse(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => ({
      title: tag(item, 'title'),
      link: tag(item, 'link'),
      date: new Date(tag(item, 'pubDate')),
    }))
    .filter(essay => essay.title && essay.link && !Number.isNaN(essay.date.valueOf()))
}

function order(essays) {
  const rank = essay => (essay.title === PINNED ? 0 : 1)
  return essays
    .sort((a, b) => rank(a) - rank(b) || b.date - a.date)
    .slice(0, MAX)
}

function render(essays) {
  return essays
    .map(essay => {
      const when = `${MONTHS[essay.date.getUTCMonth()]} ${essay.date.getUTCFullYear()}`
      return [
        '    <article class="essay">',
        '      <p class="head">',
        `        <a href="${escapeHtml(essay.link)}" rel="noopener">${escapeHtml(essay.title)}</a>`,
        '        <span class="dots" aria-hidden="true"></span>',
        `        <span class="meta">${when}</span>`,
        '      </p>',
        '    </article>',
      ].join('\n')
    })
    .join('\n\n')
}

const html = await readFile(indexPath, 'utf8')
const begin = html.indexOf(BEGIN)
const end = html.indexOf(END)

if (begin === -1 || end === -1) {
  console.error(`build-essays: markers missing in ${indexPath}`)
  process.exit(1)
}

let xml
try {
  const response = await fetch(FEED, { headers: { 'user-agent': 'wiklob-portfolio' } })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  xml = await response.text()
} catch (error) {
  console.warn(`build-essays: feed unreachable (${error.message}), keeping the current list`)
  process.exit(0)
}

const essays = order(parse(xml))

if (essays.length === 0) {
  console.warn('build-essays: feed had no usable items, keeping the current list')
  process.exit(0)
}

const openingTagEnd = html.indexOf('-->', begin) + 3
const updated =
  html.slice(0, openingTagEnd) + '\n' + render(essays) + '\n    ' + html.slice(end)

if (updated === html) {
  console.log(`build-essays: ${essays.length} essays, already up to date`)
} else {
  await writeFile(indexPath, updated)
  console.log(`build-essays: wrote ${essays.length} essays`)
}
