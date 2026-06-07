import fs from 'fs-extra'
import path from 'path'
import { Task } from 'task'
import Log from './utility/Log'

const WIKI_ROOT = 'https://github.com/ChiriVulpes/deepsight.gg/wiki'
const RAW_WIKI_ROOT = 'https://raw.githubusercontent.com/wiki/ChiriVulpes/deepsight.gg'
const OUTPUT_DIR = 'wiki'

async function readText (url: string) {
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'deepsight.gg:wiki-snapshot/0.0.0',
		},
	})

	if (!response.ok)
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)

	return await response.text()
}

function parseWikiPages (html: string) {
	const pages = new Set<string>(['Home'])
	const pageRegex = /href="\/ChiriVulpes\/deepsight\.gg\/wiki\/([^"#?]+)"/g

	for (const match of html.matchAll(pageRegex)) {
		const page = decodeURIComponent(match[1])
		if (!page.startsWith('_'))
			pages.add(page)
	}

	return [...pages].sort((a, b) => a.localeCompare(b))
}

export default Task('save_wiki', async () => {
	const pagesHtml = await readText(`${WIKI_ROOT}/_pages`)
	const pages = parseWikiPages(pagesHtml)

	if (pages.length <= 1)
		throw new Error('Failed to find wiki pages. GitHub may have changed the wiki pages markup.')

	await fs.mkdirp(OUTPUT_DIR)

	const expectedFiles = new Set(pages.map(page => `${page}.md`))
	for (const entry of await fs.readdir(OUTPUT_DIR).catch(() => [])) {
		// remove old files that no longer correspond to wiki pages, but ignore non-markdown files just in case
		if (entry.endsWith('.md') && !expectedFiles.has(entry))
			await fs.remove(path.join(OUTPUT_DIR, entry))
	}

	for (const page of pages) {
		const markdown = await readText(`${RAW_WIKI_ROOT}/${encodeURIComponent(page)}.md`)
		await fs.writeFile(path.join(OUTPUT_DIR, `${page}.md`), markdown)
		Log.info(`Saved wiki page ${page}.md`)
	}
})
