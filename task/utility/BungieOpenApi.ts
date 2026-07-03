import fs from 'fs-extra'
import path from 'path'

export const OPEN_API_URL = 'https://raw.githubusercontent.com/Bungie-net/api/refs/heads/master/openapi.json'
export const OPEN_API_CACHE_PATH = '.query/openapi.json'
export const OPEN_API_REFERENCE_PREFIX = '#/components/schemas/'

export interface BungieOpenApi {
	components: {
		schemas: Record<string, OpenAPIDefinition | OpenAPIReference>
	}
}

export interface OpenAPIDefinition extends OpenAPIBaseDefinition {
	'type'?: string
	'format'?: string
	'enum'?: `${number}`[]
	'x-enum-values'?: OpenAPIEnumValue[]
	'x-enum-is-bitmask'?: boolean
	'properties'?: Record<string, OpenAPIDefinition | OpenAPIReference>
	'additionalProperties'?: OpenAPIDefinition | OpenAPIReference | boolean
	'allOf'?: (OpenAPIDefinition | OpenAPIReference)[]
	'items'?: OpenAPIDefinition | OpenAPIReference
	'x-destiny-component-type-dependency'?: string
	'x-dictionary-key'?: OpenAPINumberDefinition | OpenAPIStringDefinition
	'x-enum-reference'?: OpenAPIReference
	'x-mapped-definition'?: OpenAPIReference
}

export interface OpenAPIReference {
	$ref: `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
}

export type OpenAPINumberFormat = 'byte' | 'int16' | 'int32' | 'int64' | 'float' | 'double'
export type OpenAPIStringFormat = 'date-time'

export interface OpenAPIBaseDefinition {
	type?: string
	description?: string
	nullable?: boolean
	required?: string[]
}

export interface OpenAPIEnumDefinition extends OpenAPIBaseDefinition {
	'type': 'integer'
	'format': OpenAPINumberFormat
	'enum': `${number}`[]
	'x-enum-values'?: OpenAPIEnumValue[]
	'x-enum-is-bitmask'?: true
}

export interface OpenAPIEnumValue {
	numericValue: `${number}`
	identifier: string
	description?: string
}

export interface OpenAPIObjectDefinition extends OpenAPIBaseDefinition {
	'type': 'object'
	'properties'?: Record<string, OpenAPIDefinition | OpenAPIReference>
	'additionalProperties'?: (OpenAPIDefinition | OpenAPIReference | boolean) & {
		'x-destiny-component-type-dependency'?: string
	}
	'allOf'?: (OpenAPIDefinition | OpenAPIReference)[]
	'x-destiny-component-type-dependency'?: string
	'x-dictionary-key'?: OpenAPINumberDefinition | OpenAPIStringDefinition
	'x-mapped-definition'?: OpenAPIReference
}

export interface OpenAPIArrayDefinition extends OpenAPIBaseDefinition {
	'type': 'array'
	'items': OpenAPIDefinition | OpenAPIReference
	'x-mapped-definition'?: OpenAPIReference
}

export interface OpenAPIStringDefinition extends OpenAPIBaseDefinition {
	type: 'string'
	format?: OpenAPIStringFormat
}

export interface OpenAPINumberDefinition extends OpenAPIBaseDefinition {
	'type': 'number' | 'integer'
	'format': OpenAPINumberFormat
	'x-enum-reference'?: OpenAPIReference
	'x-enum-is-bitmask'?: boolean
	'x-mapped-definition'?: OpenAPIReference
}

export interface OpenAPIBooleanDefinition extends OpenAPIBaseDefinition {
	type: 'boolean'
}

export interface OpenAPIUnknownDefinition extends OpenAPIBaseDefinition {
	'allOf'?: (OpenAPIDefinition | OpenAPIReference)[]
	'properties'?: Record<string, OpenAPIDefinition | OpenAPIReference>
	'additionalProperties'?: OpenAPIDefinition | OpenAPIReference | boolean
	'items'?: OpenAPIDefinition | OpenAPIReference
	'x-enum-reference'?: OpenAPIReference
	'x-enum-is-bitmask'?: boolean
	'x-mapped-definition'?: OpenAPIReference
	'x-dictionary-key'?: OpenAPINumberDefinition | OpenAPIStringDefinition
}

export async function loadBungieOpenApi () {
	try {
		const response = await fetch(OPEN_API_URL)
		if (!response.ok)
			throw new Error(`${response.status} ${response.statusText}`)

		const openapi = await response.json() as BungieOpenApi
		await writeOpenApiCache(openapi)
		return openapi
	}
	catch (fetchError) {
		if (await fs.pathExists(OPEN_API_CACHE_PATH))
			return await fs.readJson(OPEN_API_CACHE_PATH) as BungieOpenApi

		throw new Error(`Failed to fetch ${OPEN_API_URL} and no cache exists at ${OPEN_API_CACHE_PATH}: ${errorMessage(fetchError)}`)
	}
}

async function writeOpenApiCache (openapi: BungieOpenApi) {
	await fs.ensureDir(path.dirname(OPEN_API_CACHE_PATH))

	const tempPath = `${OPEN_API_CACHE_PATH}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`
	try {
		await fs.writeJson(tempPath, openapi)
		await fs.rename(tempPath, OPEN_API_CACHE_PATH)
	}
	catch (error) {
		await fs.remove(tempPath).catch(() => undefined)
		throw error
	}
}

export function openApiReferenceName (reference: OpenAPIReference) {
	return reference.$ref.slice(OPEN_API_REFERENCE_PREFIX.length)
}

export function isOpenApiReference (definition: OpenAPIDefinition | OpenAPIReference | boolean | undefined): definition is OpenAPIReference {
	return typeof definition === 'object'
		&& definition !== null
		&& '$ref' in definition
}

export function resolveOpenApiReference (openapi: BungieOpenApi, reference: OpenAPIReference): OpenAPIDefinition {
	const definition = openapi.components.schemas[openApiReferenceName(reference)]
	if (!definition)
		throw new Error(`Unknown OpenAPI reference: ${reference.$ref}`)

	return isOpenApiReference(definition) ? resolveOpenApiReference(openapi, definition) : definition
}

export function findOpenApiSchemaName (openapi: BungieOpenApi, componentName: string) {
	return Object.keys(openapi.components.schemas)
		.find(schemaName => schemaName === componentName || schemaName.endsWith(`.${componentName}`))
}

export function createOpenApiComponentNameMap (openapi: BungieOpenApi, componentNames: readonly string[]) {
	const names = new Map<string, string>()
	const foundComponents = new Set<string>()

	for (const schemaName of Object.keys(openapi.components.schemas)) {
		const componentName = componentNames.find(name => schemaName.endsWith(`.${name}`))
		if (!componentName)
			continue

		foundComponents.add(componentName)
		names.set(componentName, schemaName)
		names.set(schemaName, componentName)
	}

	return { foundComponents, names }
}

function errorMessage (error: unknown) {
	return error instanceof Error ? error.message : String(error)
}
