import fs from 'fs-extra'
import path from 'path'

export type SourceShape = 'records' | 'items' | 'value'

export interface SourceMeta {
	table: string
	shape: SourceShape
	keyField?: string
	file?: string
}

export interface QueryMeta {
	where?: string
}

export interface SelectionEnvelope {
	$schema: 'deepsight-query-selection/v1'
	source: SourceMeta
	query: QueryMeta
	records?: Record<string, unknown>
	items?: unknown[]
	value?: unknown
}

export interface SearchRecord {
	key: string
	value: any
}

export interface SearchSelection {
	source: SourceMeta
	query: QueryMeta
	records: SearchRecord[]
}

export interface CliOptions {
	tables: string[]
	load: boolean
	using: Record<string, string>
	where?: string
	count: boolean
	columns?: string[]
	raw: boolean
	save: boolean
}

export const LAST_RESULT_PATH = '.query/last.json'

const TABLE_ROOT = 'static/testiny'

export function parseArgs (args: string[]): CliOptions {
	const options: CliOptions = {
		tables: [],
		load: false,
		using: {},
		count: false,
		raw: false,
		save: false,
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]
		const next = () => {
			const value = args[++i]
			if (value === undefined)
				throw new Error(`Missing value for ${arg}`)

			return value
		}

		switch (arg) {
			case '--table':
				options.tables.push(next())
				break

			case '--load':
				options.load = true
				break

			case '--using': {
				const value = next()
				const index = value.indexOf('=')
				if (index === -1)
					throw new Error('--using must be name=source')

				const name = value.slice(0, index)
				if (!/^[A-Za-z_$][\w$]*$/.test(name))
					throw new Error(`Invalid --using name: ${name}`)

				options.using[name] = value.slice(index + 1)
				break
			}

			case '--where':
				options.where = next()
				break

			case '--count':
				options.count = true
				break

			case '--columns':
				options.columns = next().split(',').map(column => column.trim()).filter(Boolean)
				break

			case '--raw':
				options.raw = true
				break

			case '--save':
				options.save = true
				break

			default:
				throw new Error(`Unknown json_search argument: ${arg}`)
		}
	}

	if (options.count && options.columns)
		throw new Error('--count is incompatible with --columns')

	if (options.load && options.tables.length)
		throw new Error('--load is incompatible with --table')

	if (!options.load && !options.tables.length)
		throw new Error('Provide --table <name> or --load')

	return options
}

export async function loadMainSelection (options: CliOptions): Promise<SearchSelection> {
	if (options.load)
		return loadSource(LAST_RESULT_PATH)

	const selections = await Promise.all(options.tables.map(table => loadSource(table)))
	return mergeSelections(selections)
}

export async function loadUsingSources (sources: Record<string, string>): Promise<Record<string, SearchDataset>> {
	const entries = await Promise.all(Object.entries(sources)
		.map(async ([name, source]) => [name, new SearchDataset(await loadSource(source))] as const))

	return Object.fromEntries(entries)
}

export async function saveSelection (selection: SearchSelection, query: QueryMeta) {
	await fs.ensureDir(path.dirname(LAST_RESULT_PATH))
	await fs.writeFile(LAST_RESULT_PATH, JSON.stringify(toEnvelope({ ...selection, query }), undefined, '\t'))
}

export function filterSelection (selection: SearchSelection, where: string | undefined, using: Record<string, SearchDataset>): SearchSelection {
	if (!where)
		return selection

	const names = Object.keys(using)
	const values = names.map(name => using[name])
	const predicate = new Function('record', 'is', ...names, `
		with (record) {
			return Boolean(${where});
		}
	`) as (record: any, is: SemanticIs, ...using: SearchDataset[]) => boolean

	return {
		...selection,
		records: selection.records.filter(record => predicate(record.value, new SemanticIs(selection.source, record.value), ...values)),
	}
}

export function printSelection (selection: SearchSelection, options: CliOptions) {
	if (options.count) {
		console.log(selection.records.length)
		return
	}

	const value = options.columns ? projectColumns(selection.records, options.columns)
		: options.raw ? toPayload(selection)
			: toEnvelope(selection)

	console.log(JSON.stringify(value, undefined, '\t'))
}

function projectColumns (records: SearchRecord[], columns: string[]) {
	return records.map(record => Object.fromEntries(columns.map(column => [column, getPath(record.value, column)])))
}

async function loadSource (source: string): Promise<SearchSelection> {
	const file = resolveSourceFile(source)
	const json = await fs.readJson(file)

	if (isSelectionEnvelope(json))
		return fromEnvelope(json)

	const table = source.endsWith('.json') ? path.basename(source, '.json') : source
	if (isRecordObject(json))
		return {
			source: { table, shape: 'records', keyField: 'hash', file },
			query: {},
			records: Object.entries(json).map(([key, value]) => ({ key, value })),
		}

	if (Array.isArray(json))
		return {
			source: { table, shape: 'items', file },
			query: {},
			records: json.map((value, index) => ({ key: `${index}`, value })),
		}

	return {
		source: { table, shape: 'value', file },
		query: {},
		records: [{ key: 'value', value: json }],
	}
}

function resolveSourceFile (source: string) {
	if (source === 'last')
		return LAST_RESULT_PATH

	if (source.endsWith('.json') || source.includes('/') || source.includes('\\'))
		return source

	return path.join(TABLE_ROOT, `${source}.json`)
}

function mergeSelections (selections: SearchSelection[]): SearchSelection {
	const [first, ...rest] = selections
	if (!first)
		throw new Error('No selections to merge')

	for (const selection of rest)
		if (selection.source.table !== first.source.table || selection.source.shape !== first.source.shape)
			throw new Error(`Cannot merge ${first.source.table}/${first.source.shape} with ${selection.source.table}/${selection.source.shape}`)

	const records = new Map<string, SearchRecord>()
	for (const selection of selections)
		for (const record of selection.records)
			records.set(record.key, record)

	return {
		source: first.source,
		query: {},
		records: [...records.values()],
	}
}

function fromEnvelope (envelope: SelectionEnvelope): SearchSelection {
	if (envelope.records)
		return {
			source: envelope.source,
			query: envelope.query,
			records: Object.entries(envelope.records).map(([key, value]) => ({ key, value })),
		}

	if (envelope.items)
		return {
			source: envelope.source,
			query: envelope.query,
			records: envelope.items.map((value, index) => ({ key: `${index}`, value })),
		}

	return {
		source: envelope.source,
		query: envelope.query,
		records: [{ key: 'value', value: envelope.value }],
	}
}

function toEnvelope (selection: SearchSelection): SelectionEnvelope {
	const base = {
		$schema: 'deepsight-query-selection/v1' as const,
		source: selection.source,
		query: selection.query,
	}

	if (selection.source.shape === 'items')
		return { ...base, items: selection.records.map(record => record.value) }

	if (selection.source.shape === 'value')
		return { ...base, value: selection.records[0]?.value }

	return { ...base, records: Object.fromEntries(selection.records.map(record => [record.key, record.value])) }
}

function toPayload (selection: SearchSelection) {
	if (selection.source.shape === 'items')
		return selection.records.map(record => record.value)

	if (selection.source.shape === 'value')
		return selection.records[0]?.value

	return Object.fromEntries(selection.records.map(record => [record.key, record.value]))
}

function isSelectionEnvelope (value: unknown): value is SelectionEnvelope {
	return typeof value === 'object'
		&& value !== null
		&& (value as SelectionEnvelope).$schema === 'deepsight-query-selection/v1'
}

function isRecordObject (value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getPath (object: any, objectPath: string) {
	for (const key of objectPath.split('.'))
		object = object?.[key]

	return object
}

export class SearchDataset {

	public readonly source: SourceMeta
	private readonly records: SearchRecord[]
	private readonly keys: Set<string>
	private readonly hashes: Set<number>

	public constructor (selection: SearchSelection) {
		this.source = selection.source
		this.records = selection.records
		this.keys = new Set(selection.records.map(record => record.key))
		this.hashes = new Set(selection.records.map(record => record.value?.hash).filter((hash): hash is number => typeof hash === 'number'))
	}

	public has (value: unknown) {
		return this.keys.has(`${value}`) || typeof value === 'number' && this.hashes.has(value)
	}

	public some (predicate: (record: any) => boolean) {
		return this.records.some(record => predicate(record.value))
	}

	public find (predicate: (record: any) => boolean) {
		return this.records.find(record => predicate(record.value))?.value
	}

	public values () {
		return this.records.map(record => record.value)
	}

}

export class UnsupportedSemanticPredicateError extends Error {

	public constructor (predicate: string, table: string) {
		super(`${predicate} is not supported for ${table}`)
	}

}

export class SemanticIs {

	public constructor (
		private readonly source: SourceMeta,
		private readonly record: any,
	) { }

	public get fragment () {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.trait('item.plug.fragment')
					&& !!this.record.plug?.plugCategoryIdentifier
					&& !this.empty
					&& !this.dummy

			default:
				throw new UnsupportedSemanticPredicateError('is.fragment', this.source.table)
		}
	}

	public get stasis () {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.record.plug?.plugCategoryIdentifier?.includes('stasis')
					|| this.record.traitIds?.some((trait: string) => trait.includes('.stasis.'))
					|| this.record.displayProperties?.name?.toLowerCase().includes('stasis')
					|| this.record.itemTypeDisplayName?.toLowerCase().includes('stasis')

			default:
				throw new UnsupportedSemanticPredicateError('is.stasis', this.source.table)
		}
	}

	public get hunter () {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.record.classType === 1
					|| this.record.plug?.plugCategoryIdentifier?.includes('hunter')
					|| this.record.plug?.plugCategoryIdentifier === 'shared.stasis.trinkets'

			default:
				throw new UnsupportedSemanticPredicateError('is.hunter', this.source.table)
		}
	}

	public get empty () {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.record.displayProperties?.name?.toLowerCase().startsWith('empty ')
					|| this.record.plug?.plugCategoryIdentifier?.includes('empty')

			default:
				throw new UnsupportedSemanticPredicateError('is.empty', this.source.table)
		}
	}

	public get dummy () {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.record.displayProperties?.name?.toLowerCase().includes('dummy')
					|| this.record.traitIds?.includes('item.dummy')
					|| this.record.itemTypeDisplayName?.toLowerCase().includes('dummy')

			default:
				throw new UnsupportedSemanticPredicateError('is.dummy', this.source.table)
		}
	}

	public trait (trait: string) {
		switch (this.source.table) {
			case 'DestinyInventoryItemDefinition':
				return this.record.traitIds?.includes(trait)

			default:
				throw new UnsupportedSemanticPredicateError('is.trait', this.source.table)
		}
	}

	public named (name: string | RegExp) {
		const displayName = `${this.record.displayProperties?.name ?? this.record.name ?? ''}`
		return typeof name === 'string' ? displayName.toLowerCase().includes(name.toLowerCase()) : name.test(displayName)
	}

}
