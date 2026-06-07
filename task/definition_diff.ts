import { spawn } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { Task } from 'task'

interface Options {
	oldRef: string
	oldPath: string
	newPath: string
	file?: string
	full: boolean
	includeAddedRemoved: boolean
	includeMetadata: boolean
}

function parseArgs (args: string[]): Options {
	const options: Options = {
		oldRef: 'definitions',
		oldPath: '',
		newPath: 'docs/definitions',
		full: false,
		includeAddedRemoved: false,
		includeMetadata: false,
	}

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case '--old-ref':
				options.oldRef = args[++i]
				break
			case '--old-path':
				options.oldPath = args[++i].replace(/\\/g, '/').replace(/^\/|\/$/g, '')
				break
			case '--new-path':
				options.newPath = args[++i]
				break
			case '--file':
				options.file = args[++i].replace(/\\/g, '/')
				break
			case '--full':
				options.full = true
				break
			case '--include-added-removed':
				options.includeAddedRemoved = true
				break
			case '--include-metadata':
				options.includeMetadata = true
				break
			default:
				throw new Error(`Unknown argument: ${args[i]}`)
		}
	}

	return options
}

function stable (value: unknown): unknown {
	if (Array.isArray(value))
		return value.map(stable)

	if (value && typeof value === 'object') {
		const result: Record<string, unknown> = {}
		for (const key of Object.keys(value).sort())
			result[key] = stable((value as Record<string, unknown>)[key])
		return result
	}

	return value
}

function stableJsonValue (value: unknown) {
	return `${JSON.stringify(stable(value), undefined, '\t')}\n`
}

function isPlainObject (value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

function runGit (args: string[], allowDifference = false) {
	return new Promise<string>((resolve, reject) => {
		const child = spawn('git', args, { stdio: ['ignore', 'pipe', 'pipe'] })
		let stdout = ''
		let stderr = ''
		child.stdout.on('data', data => stdout += data)
		child.stderr.on('data', data => stderr += data)
		child.on('error', reject)
		child.on('close', code => {
			if (code === 0 || (allowDifference && code === 1))
				resolve(stdout.trimEnd())
			else
				reject(new Error(stderr.trimEnd() || `git ${args.join(' ')} exited with ${code}`))
		})
	})
}

async function walkJsonFiles (root: string, dir = ''): Promise<string[]> {
	const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true }).catch(() => [])
	const files = await Promise.all(entries.map(async entry => {
		const relative = path.posix.join(dir.replace(/\\/g, '/'), entry.name)
		if (entry.isDirectory())
			return walkJsonFiles(root, relative)
		return entry.isFile() && entry.name.endsWith('.json') ? [relative] : []
	}))
	return files.flat()
}

function branchPath (options: Options, file: string) {
	return [options.oldPath, file].filter(Boolean).join('/')
}

async function listOldFiles (options: Options) {
	if (options.file)
		return [options.file]

	const allFiles = (await runGit(['ls-tree', '-r', '--name-only', options.oldRef]))
		.split(/\r?\n/g)
		.filter(Boolean)
		.filter(file => file.endsWith('.json'))

	if (!options.oldPath)
		return allFiles

	const prefix = `${options.oldPath}/`
	return allFiles
		.filter(file => file.startsWith(prefix))
		.map(file => file.slice(prefix.length))
}

async function readOldFile (options: Options, file: string) {
	return runGit(['show', `${options.oldRef}:${branchPath(options, file)}`])
}

async function writeStableJson (target: string, file: string, value: unknown) {
		const targetPath = path.join(target, file)
		await fs.mkdirp(path.dirname(targetPath))
		await fs.writeFile(targetPath, stableJsonValue(value))
}

function parseJson (text: string, label: string) {
	try {
		return JSON.parse(text) as unknown
	}
	catch (err) {
		throw new Error(`Failed to parse ${label}: ${(err as Error).message}`)
	}
}

async function loadDevelopmentMetadataFields () {
	const fields = new Set<string>()
	const plugCategorisation = await fs.readFile('task/manifest/plugtype/DeepsightPlugCategorisation.ts', 'utf8')
	for (const match of plugCategorisation.matchAll(/^\s+(_[a-zA-Z0-9_]+): context\.definition/gm))
		fields.add(match[1])
	return fields
}

function stripDevelopmentMetadata (value: unknown, fields: Set<string>): unknown {
	if (Array.isArray(value))
		return value.map(item => stripDevelopmentMetadata(item, fields))

	if (value && typeof value === 'object')
		return Object.fromEntries(Object.entries(value)
			.filter(([key]) => !fields.has(key))
			.map(([key, item]) => [key, stripDevelopmentMetadata(item, fields)]))

	return value
}

function summariseList (values: string[]) {
	const samples = values.slice(0, 8)
	const suffix = values.length > samples.length ? `, +${values.length - samples.length} more` : ''
	return `${values.length}: ${samples.join(', ')}${suffix}`
}

export default Task('definition_diff', async (_task, ...args: string[]) => {
	const options = parseArgs(args)
	const temp = '.query/definition_diff'
	const oldTarget = path.join(temp, 'old')
	const newTarget = path.join(temp, 'new')

	await fs.remove(temp)
	await fs.mkdirp(oldTarget)
	await fs.mkdirp(newTarget)

	const oldFiles = await listOldFiles(options)
	const newFiles = options.file
		? [options.file]
		: await walkJsonFiles(options.newPath)
	const metadataFields = options.includeMetadata ? new Set<string>() : await loadDevelopmentMetadataFields()
	const oldFileSet = new Set(oldFiles)
	const newFileSet = new Set(newFiles)
	const files = (options.includeAddedRemoved
		? [...new Set([...oldFiles, ...newFiles])]
		: [...oldFileSet].filter(file => newFileSet.has(file)))
		.sort()
	const oldOnlyFiles = oldFiles.filter(file => !newFileSet.has(file)).sort()
	const newOnlyFiles = newFiles.filter(file => !oldFileSet.has(file)).sort()
	const omitted: string[] = []

	for (const file of files) {
		const oldText = await readOldFile(options, file).catch(() => undefined)
		const newPath = path.join(options.newPath, file)
		const newText = await fs.readFile(newPath, 'utf8').catch(() => undefined)

		if (oldText === undefined) {
			if (options.includeAddedRemoved && newText !== undefined)
				await writeStableJson(newTarget, file, parseJson(newText, file))
			continue
		}

		if (newText === undefined) {
			if (options.includeAddedRemoved)
				await writeStableJson(oldTarget, file, parseJson(oldText, `${options.oldRef}:${branchPath(options, file)}`))
			continue
		}

		let oldValue = parseJson(oldText, `${options.oldRef}:${branchPath(options, file)}`)
		let newValue = parseJson(newText, file)

		if (!options.includeAddedRemoved && isPlainObject(oldValue) && isPlainObject(newValue)) {
			const oldKeys = Object.keys(oldValue).sort()
			const newKeys = Object.keys(newValue).sort()
			const newKeySet = new Set(newKeys)
			const oldKeySet = new Set(oldKeys)
			const commonKeys = oldKeys.filter(key => newKeySet.has(key))
			const oldOnlyKeys = oldKeys.filter(key => !newKeySet.has(key))
			const newOnlyKeys = newKeys.filter(key => !oldKeySet.has(key))

			if (oldOnlyKeys.length || newOnlyKeys.length)
				omitted.push(`${file}: old-only keys ${summariseList(oldOnlyKeys)}; new-only keys ${summariseList(newOnlyKeys)}`)

			oldValue = Object.fromEntries(commonKeys.map(key => [key, (oldValue as Record<string, unknown>)[key]]))
			newValue = Object.fromEntries(commonKeys.map(key => [key, (newValue as Record<string, unknown>)[key]]))
		}

		if (!options.includeMetadata) {
			oldValue = stripDevelopmentMetadata(oldValue, metadataFields)
			newValue = stripDevelopmentMetadata(newValue, metadataFields)
		}

		await writeStableJson(oldTarget, file, oldValue)
		await writeStableJson(newTarget, file, newValue)
	}

	if (!options.includeAddedRemoved) {
		const omittedSummary = [
			oldOnlyFiles.length ? `Files only in old: ${summariseList(oldOnlyFiles)}` : undefined,
			newOnlyFiles.length ? `Files only in new: ${summariseList(newOnlyFiles)}` : undefined,
			...omitted,
		].filter(Boolean)

		if (omittedSummary.length)
			console.log(`Omitted from common-object diff:\n${omittedSummary.map(line => `- ${line}`).join('\n')}\n`)
	}

	if (!options.full && !options.file) {
		const stat = await runGit(['diff', '--no-index', '--stat', oldTarget, newTarget], true)
		const status = await runGit(['diff', '--no-index', '--name-status', oldTarget, newTarget], true)
		console.log([stat, status].filter(Boolean).join('\n\n') || 'No generated definition differences found.')
	}
	else {
		const output = await runGit(['diff', '--no-index', oldTarget, newTarget], true)
		console.log(output || 'No generated definition differences found.')
	}

	console.log(`\nStable JSON snapshots written to ${temp.replace(/\\/g, '/')}`)
})
