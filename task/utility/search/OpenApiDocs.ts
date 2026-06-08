import fs from 'fs-extra'
import path from 'path'
import { findOpenApiSchemaName, isOpenApiReference, loadBungieOpenApi, openApiReferenceName, resolveOpenApiReference, type BungieOpenApi, type OpenAPIDefinition, type OpenAPIReference } from '../BungieOpenApi'

export interface OpenApiDocsOptions {
	tables: string[]
	docPath?: string
	docsDepth: number
}

export interface OpenApiDocsSelection {
	source: {
		table: string
	}
}

interface OpenApiDocEntry {
	path: string
	type: string
	description?: string
	required?: boolean
	nullable?: boolean
	ref?: string
	enumRef?: string
	mappedDefinition?: string
	enum?: {
		bitmask?: boolean
		values?: {
			name: string
			value: number
			description?: string
		}[]
	}
}

interface OpenApiTableDocs {
	table: string
	schema?: string
	path?: string
	docs?: OpenApiDocEntry[]
	error?: string
}

interface OpenApiDocsDocument {
	sections: OpenApiTableDocs[]
	moreSchemas: {
		schema: string
		propertyCount: number
	}[]
	nextDepth: number
}

interface DocsTarget {
	table: string
	schema: string
	definition: OpenAPIDefinition | OpenAPIReference
	path?: string
	pathParts: string[]
	depth: number
}

interface WalkContext {
	openapi: BungieOpenApi
	refStack: Set<string>
}

export async function printOpenApiDocs (options: OpenApiDocsOptions, loadedSelection?: OpenApiDocsSelection) {
	console.log(await getOpenApiDocsMarkdown(options, loadedSelection))
}

export async function getOpenApiDocsMarkdown (options: OpenApiDocsOptions, loadedSelection?: OpenApiDocsSelection) {
	const tables = options.tables.length ? options.tables
		: loadedSelection ? [loadedSelection.source.table]
			: undefined

	if (!tables)
		throw new Error('--docs requires --table <name> or --load')

	const openapi = await loadBungieOpenApi()
	return renderDocs(documentTables(openapi, tables, options), await manifestTables())
}

function documentTables (openapi: BungieOpenApi, tables: string[], options: OpenApiDocsOptions): OpenApiDocsDocument {
	const sections: OpenApiTableDocs[] = []
	const included = new Set<string>()
	const moreSchemas = new Map<string, number>()
	const queue: DocsTarget[] = []

	for (const table of tables) {
		const schema = findOpenApiSchemaName(openapi, table)
		if (!schema) {
			sections.push({ table, path: options.docPath, error: `No OpenAPI schema found for ${table}` })
			continue
		}

		let definition = openapi.components.schemas[schema]
		if (options.docPath) {
			const pathResult = definitionAtPath(openapi, definition, options.docPath)
			if ('error' in pathResult) {
				sections.push({ table, schema, path: options.docPath, error: pathResult.error })
				continue
			}

			definition = pathResult.definition
		}

		queue.push({ table, schema, definition, path: options.docPath, pathParts: options.docPath ? options.docPath.split('.') : [], depth: options.docsDepth })
	}

	for (let target = queue.shift(); target; target = queue.shift()) {
		if (included.has(target.schema))
			continue

		included.add(target.schema)

		const docs = collectDocs(target.definition, target.pathParts, target.depth, { openapi, refStack: new Set() })
		sections.push({
			table: target.table,
			schema: target.schema,
			path: target.path,
			docs,
		})

		for (const schema of linkedSchemas(docs)) {
			if (included.has(schema))
				continue

			if (target.depth > 1)
				queue.push({ table: shortSchemaName(schema), schema, definition: openapi.components.schemas[schema], pathParts: [], depth: target.depth - 1 })
			else
				moreSchemas.set(schema, propertyCount(openapi, schema))
		}
	}

	return {
		sections,
		moreSchemas: [...moreSchemas]
			.filter(([schema]) => !included.has(schema))
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([schema, propertyCount]) => ({ schema, propertyCount })),
		nextDepth: options.docsDepth + 1,
	}
}

function definitionAtPath (openapi: BungieOpenApi, definition: OpenAPIDefinition | OpenAPIReference, docPath: string): { definition: OpenAPIDefinition | OpenAPIReference } | { error: string } {
	let current = definition
	const parts = docPath.split('.').filter(Boolean)

	for (const part of parts) {
		const currentDefinition = dereference(openapi, current).definition

		if (part === '[]') {
			if (currentDefinition.type !== 'array' || !currentDefinition.items)
				return { error: `${part} can only be used on an array` }

			current = currentDefinition.items
			continue
		}

		if (part === '{}') {
			if (currentDefinition.type !== 'object' || !currentDefinition.additionalProperties || currentDefinition.additionalProperties === true)
				return { error: `${part} can only be used on a dictionary object` }

			current = currentDefinition.additionalProperties
			continue
		}

		const property = propertyDefinition(openapi, currentDefinition, part)
		if (!property)
			return { error: `No OpenAPI property found at ${docPath}` }

		current = property
	}

	return { definition: current }
}

function propertyDefinition (openapi: BungieOpenApi, definition: OpenAPIDefinition | OpenAPIReference, property: string): OpenAPIDefinition | OpenAPIReference | undefined {
	definition = dereference(openapi, definition).definition
	if (definition.type === 'object' && definition.properties?.[property])
		return definition.properties[property]

	if (definition.allOf)
		for (const subDefinition of definition.allOf) {
			const found = propertyDefinition(openapi, subDefinition, property)
			if (found)
				return found
		}
}

function collectDocs (definition: OpenAPIDefinition | OpenAPIReference, path: string[], depth: number, context: WalkContext, required = false, mappedDefinition?: OpenAPIReference): OpenApiDocEntry[] {
	const resolved = dereference(context.openapi, definition)
	const refName = resolved.refName
	definition = resolved.definition
	mappedDefinition = mappedReference(definition) ?? mappedDefinition

	const entry = describeDefinition(definition, path, required, refName, mappedDefinition)
	const entries = [entry]

	if (depth <= 0)
		return entries

	if (refName) {
		if (context.refStack.has(refName))
			return entries

		context = { ...context, refStack: new Set([...context.refStack, refName]) }
	}

	entries.push(...collectChildDocs(definition, path, depth - 1, context, mappedDefinition))
	return entries
}

function collectChildDocs (definition: OpenAPIDefinition, path: string[], depth: number, context: WalkContext, mappedDefinition?: OpenAPIReference): OpenApiDocEntry[] {
	const entries: OpenApiDocEntry[] = []

	if (definition.allOf)
		for (const subDefinition of definition.allOf)
			entries.push(...collectChildDocs(dereference(context.openapi, subDefinition).definition, path, depth, context, mappedDefinition))

	if (definition.type === 'array' && definition.items)
		entries.push(...collectDocs(definition.items, [...path, '[]'], depth, context, false, definition['x-mapped-definition'] ?? mappedDefinition))

	if (definition.type === 'object') {
		for (const [property, propertyDefinition] of Object.entries(definition.properties ?? {}))
			entries.push(...collectDocs(propertyDefinition, [...path, property], depth, context, definition.required?.includes(property), mappedDefinition))

		if (definition.additionalProperties && definition.additionalProperties !== true)
			entries.push(...collectDocs(definition.additionalProperties, [...path, '{}'], depth, context, false, definition['x-mapped-definition'] ?? mappedDefinition))

		if (definition['x-dictionary-key'])
			entries.push(...collectDocs(definition['x-dictionary-key'], [...path, '{}'], depth, context, false, definition['x-mapped-definition'] ?? mappedDefinition))
	}

	return entries
}

function dereference (openapi: BungieOpenApi, definition: OpenAPIDefinition | OpenAPIReference): { definition: OpenAPIDefinition, refName?: string } {
	if (!isOpenApiReference(definition))
		return { definition }

	return {
		definition: resolveOpenApiReference(openapi, definition),
		refName: openApiReferenceName(definition),
	}
}

function describeDefinition (definition: OpenAPIDefinition, path: string[], required: boolean, refName?: string, mappedDefinition?: OpenAPIReference): OpenApiDocEntry {
	const entry: OpenApiDocEntry = {
		path: path.join('.'),
		type: definitionType(definition),
		required,
		nullable: definition.nullable,
		description: definition.description,
		ref: refName,
		enumRef: enumReferenceName(definition),
		mappedDefinition: mappedDefinition && openApiReferenceName(mappedDefinition),
		enum: enumDetails(definition),
	}

	return Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined)) as OpenApiDocEntry
}

function definitionType (definition: OpenAPIDefinition) {
	const format = 'format' in definition && definition.format ? `:${definition.format}` : ''
	if (definition.type)
		return `${definition.type}${format}`

	if (definition.allOf)
		return 'allOf'

	return 'unknown'
}

function mappedReference (definition: OpenAPIDefinition) {
	return 'x-mapped-definition' in definition ? definition['x-mapped-definition'] : undefined
}

function enumReferenceName (definition: OpenAPIDefinition) {
	if (!('x-enum-reference' in definition) || !definition['x-enum-reference'])
		return

	return openApiReferenceName(definition['x-enum-reference'])
}

function enumDetails (definition: OpenAPIDefinition): OpenApiDocEntry['enum'] {
	if (!('enum' in definition))
		return

	return {
		bitmask: definition['x-enum-is-bitmask'],
		values: definition['x-enum-values']?.map(value => ({
			name: value.identifier,
			value: Number(value.numericValue),
			description: value.description,
		})) ?? definition.enum?.map(value => ({
			name: String(value),
			value: Number(value),
		})),
	}
}

function linkedSchemas (docs: OpenApiDocEntry[]) {
	const schemas = new Set<string>()
	for (const doc of docs) {
		if (doc.ref)
			schemas.add(doc.ref)

		if (doc.mappedDefinition)
			schemas.add(doc.mappedDefinition)
	}

	return schemas
}

function propertyCount (openapi: BungieOpenApi, schema: string) {
	const definition = openapi.components.schemas[schema]
	if (!definition)
		return 0

	return Math.max(0, collectDocs(definition, [], 1, { openapi, refStack: new Set() }).length - 1)
}

async function manifestTables () {
	const files = await fs.readdir('static/testiny').catch(() => [])
	return new Set(files
		.filter(file => file.endsWith('.json'))
		.map(file => path.basename(file, '.json')))
}

function renderDocs (document: OpenApiDocsDocument, manifestTables: Set<string>) {
	const renderedSections = document.sections.map(table => {
		const lines = [`## ${table.table}`]
		const tableName = table.schema && manifestTables.has(shortSchemaName(table.schema)) ? shortSchemaName(table.schema)
			: manifestTables.has(table.table) ? table.table
				: undefined

		if (tableName)
			lines.push(`Table: --table ${tableName}`)

		if (table.schema)
			lines.push(`Schema: ${table.schema}`)

		if (table.path)
			lines.push(`Path: ${table.path}`)

		lines.push('')

		if (table.error)
			lines.push(`- Error: ${table.error}`)
		else {
			const docs = table.docs ?? []
			const [root, ...properties] = docs
			const rootDescription = formatDescription(root?.description)
			if (rootDescription)
				lines.push(rootDescription, '')

			for (const doc of properties)
				lines.push(renderDocEntry(doc))
		}

		return lines.join('\n')
	})

	if (document.moreSchemas.length) {
		renderedSections.push([
			`## More With --docs-depth ${document.nextDepth}`,
			...document.moreSchemas.map(({ schema, propertyCount }) => `- ${shortSchemaName(schema)} (${propertyCount} ${propertyCount === 1 ? 'property' : 'properties'})`),
		].join('\n'))
	}

	return renderedSections.join('\n\n')
}

function renderDocEntry (doc: OpenApiDocEntry) {
	const markers = [
		doc.nullable && 'nullable',
		doc.ref && `ref ${shortSchemaName(doc.ref)}`,
		doc.enumRef && `enum ${shortSchemaName(doc.enumRef)}`,
		doc.mappedDefinition && `mapped ${shortSchemaName(doc.mappedDefinition)}`,
		doc.enum?.bitmask && 'bitmask',
		doc.enum?.values?.length && `values ${renderEnumValues(doc.enum.values)}`,
	].filter(Boolean)

	const markerText = markers.length ? ` (${markers.join('; ')})` : ''
	const description = formatDescription(doc.description)
	const bullet = `- ${doc.path || '<root>'}${doc.path && doc.required === false ? '?' : ''}: ${doc.type}${markerText}`
	if (!description)
		return bullet

	return description.includes('\n') ? `${bullet}\n${indentDescription(description)}` : `${bullet} - ${description}`
}

function renderEnumValues (values: NonNullable<NonNullable<OpenApiDocEntry['enum']>['values']>) {
	const renderedValues = values.slice(0, 12).map(value => `${value.name}=${value.value}`)
	return values.length > renderedValues.length ? `${renderedValues.join(', ')}, ...` : renderedValues.join(', ')
}

function shortSchemaName (schemaName: string) {
	return schemaName.split('.').pop() ?? schemaName
}

function formatDescription (description: string | undefined) {
	if (!description)
		return

	return description
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => line.trimEnd())
		.join('\n')
		.trim()
}

function indentDescription (description: string) {
	return description.split('\n').map(line => line ? `  ${line}` : '').join('\n')
}
