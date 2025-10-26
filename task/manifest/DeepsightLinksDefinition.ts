import type { DeepsightComponentLinksDefinition, DeepsightDefinitionLinkDefinition, DeepsightEnumDefinition, DeepsightEnumLinkDefinition, DeepsightLinksDefinition, DeepsightManifestComponentsMap } from '@deepsight.gg/Interfaces'
import type { AllDestinyManifestComponents } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import { Task } from 'task'
import getDestinyManifestComponents from './utility/endpoint/DestinyManifestComponents'

const _ = undefined

export default Task('DeepsightLinksDefinition', async () => {
	type ComponentNames = keyof AllDestinyManifestComponents | keyof DeepsightManifestComponentsMap | 'ClarityDescriptions'
	const components: Partial<Record<ComponentNames, DeepsightComponentLinksDefinition>> = {}
	const enums: Partial<Record<string, DeepsightEnumDefinition>> = {}

	////////////////////////////////////
	//#region Destiny

	////////////////////////////////////
	//#region OpenAPI

	type OpenAPIDefinition =
		| OpenAPIEnumDefinition
		| OpenAPIObjectDefinition
		| OpenAPIArrayDefinition
		| OpenAPIStringDefinition
		| OpenAPINumberDefinition
		| OpenAPIBooleanDefinition

	const OPEN_API_REFERENCE_PREFIX = '#/components/schemas/'
	interface OpenAPIReference {
		$ref: `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
	}

	type OpenAPINumberFormat = 'byte' | 'int16' | 'int32' | 'int64' | 'float' | 'double'
	type OpenAPIStringFormat = 'date-time'

	interface OpenAPIBaseDefinition {
		type: string
		description?: string
		nullable?: boolean
	}

	////////////////////////////////////
	//#region Enum

	interface OpenAPIEnumDefinition extends OpenAPIBaseDefinition {
		'type': 'integer'
		'format': OpenAPINumberFormat
		'enum': `${number}`[]
		'x-enum-values'?: OpenAPIEnumValue[]
		'x-enum-is-bitmask'?: true
	}

	interface OpenAPIEnumValue {
		numericValue: `${number}`
		identifier: string
		description?: string
	}

	//#endregion
	////////////////////////////////////

	////////////////////////////////////
	//#region Object

	interface OpenAPIObjectDefinition extends OpenAPIBaseDefinition {
		'type': 'object'
		'properties'?: Record<string, OpenAPIDefinition | OpenAPIReference>
		'additionalProperties'?: {
			'$ref': `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
			'x-destiny-component-type-dependency'?: string
		}
		'allOf'?: (OpenAPIDefinition | OpenAPIReference)[]
		'x-destiny-component-type-dependency'?: string
		'x-dictionary-key'?: OpenAPINumberDefinition | OpenAPIStringDefinition
	}

	//#endregion
	////////////////////////////////////

	////////////////////////////////////
	//#region Array

	interface OpenAPIArrayDefinition extends OpenAPIBaseDefinition {
		'type': 'array'
		'items': OpenAPIDefinition | OpenAPIReference
		'x-mapped-definition'?: {
			$ref: `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
		}
	}

	//#endregion
	////////////////////////////////////

	////////////////////////////////////
	//#region String

	interface OpenAPIStringDefinition extends OpenAPIBaseDefinition {
		type: 'string'
		format?: OpenAPIStringFormat
	}

	//#endregion
	////////////////////////////////////

	////////////////////////////////////
	//#region Number

	interface OpenAPINumberDefinition extends OpenAPIBaseDefinition {
		'type': 'number' | 'integer'
		'format': OpenAPINumberFormat
		'x-enum-reference'?: {
			$ref: `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
		}
		'x-enum-is-bitmask'?: boolean
		'x-mapped-definition'?: {
			$ref: `${typeof OPEN_API_REFERENCE_PREFIX}${string}`
		}
	}

	//#endregion
	////////////////////////////////////

	////////////////////////////////////
	//#region Boolean

	interface OpenAPIBooleanDefinition extends OpenAPIBaseDefinition {
		type: 'boolean'
	}

	//#endregion
	////////////////////////////////////

	//#endregion
	////////////////////////////////////

	const componentNames = await getDestinyManifestComponents()
	const openapi = await fetch('https://raw.githubusercontent.com/Bungie-net/api/refs/heads/master/openapi.json').then(res => res.json() as Promise<{ components: { schemas: Record<string, OpenAPIDefinition | OpenAPIReference> } }>)

	const foundComponents = new Set<string>()
	const componentNamesToDefNamesAndViceVersa = new Map<string, string>()
	for (const definitionName of Object.keys(openapi.components.schemas)) {
		const componentName = componentNames.find(name => definitionName.endsWith(`.${name}`))
		if (!componentName)
			continue

		foundComponents.add(componentName)
		componentNamesToDefNamesAndViceVersa.set(componentName, definitionName)
		componentNamesToDefNamesAndViceVersa.set(definitionName, componentName)
	}

	for (const [definitionName, definition] of Object.entries(openapi.components.schemas)) {
		const componentName = componentNamesToDefNamesAndViceVersa.get(definitionName) as ComponentNames | undefined
		if (!componentName)
			continue

		// console.log(componentName)
		// console.log(getLinks(definition))
		const links = getLinks(definition)
		if (links.length)
			components[componentName] = {
				component: componentName,
				links,
			}

		function getLinks (def?: OpenAPIDefinition | OpenAPIReference, path: string[] = [], mappedDef?: OpenAPIReference): (DeepsightDefinitionLinkDefinition | DeepsightEnumLinkDefinition)[] {
			if (!def)
				return []

			if ('$ref' in def) {
				const ref = def.$ref.slice(OPEN_API_REFERENCE_PREFIX.length)
				return getLinks(openapi.components.schemas[ref], path)
			}

			if (def.type === 'number' || (def.type === 'integer' && !('enum' in def) && !('x-enum-reference' in def))) {
				mappedDef = def['x-mapped-definition'] ?? mappedDef
				const defName = mappedDef?.$ref.slice(OPEN_API_REFERENCE_PREFIX.length)
				const componentName = defName && componentNamesToDefNamesAndViceVersa.get(defName) as ComponentNames | undefined
				return !componentName ? []
					: [{ component: componentName, path: path.join('.') }]
			}

			if (def.type === 'integer' && 'x-enum-reference' in def) {
				const enumSchemaName = def['x-enum-reference']!.$ref.slice(OPEN_API_REFERENCE_PREFIX.length)
				const enumName = enumSchemaName.split('.').pop()!
				addEnum(enumName)
				return [{ enum: enumName, path: path.join('.') }]
			}

			if (def.type !== 'object' && def.type !== 'array')
				return []

			if (def.type === 'array')
				return getLinks(def.items, [...path, '[]'], def['x-mapped-definition'])

			const links: (DeepsightDefinitionLinkDefinition | DeepsightEnumLinkDefinition)[] = []

			if (def.properties)
				for (const [propName, propDef] of Object.entries(def.properties))
					links.push(...getLinks(propDef, [...path, propName]))

			if (def.additionalProperties && def['x-dictionary-key'])
				links.push(...getLinks(def['x-dictionary-key'], [...path, '{}']))

			if (def.additionalProperties && '$ref' in def.additionalProperties)
				links.push(...getLinks(def.additionalProperties, [...path, '{}']))

			if (def.allOf)
				for (const subDef of def.allOf)
					links.push(...getLinks(subDef, path))

			return links
		}
	}

	const missingComponents = componentNames.filter(name => !foundComponents.has(name))
	if (missingComponents.length > 0) {
		console.log('\nMissing Components in openapi.json:')
		for (const componentName of missingComponents)
			console.log(`- ${componentName}`)
	}

	//#endregion
	////////////////////////////////////

	function addEnum (enumName: string) {
		if (enums[enumName])
			return

		for (const [schemaName, schema] of Object.entries(openapi.components.schemas)) {
			if (!schemaName.includes(`.${enumName}`) || !('enum' in schema))
				continue

			const members = _
				?? schema['x-enum-values']?.map(ev => ({
					name: ev.identifier,
					value: Number(ev.numericValue),
					description: ev.description,
				}))
				?? schema.enum?.map(value => ({
					name: String(value),
					value: Number(value),
				}))

			if (!members?.length)
				continue

			enums[enumName] = {
				name: enumName,
				members,
				bitmask: schema['x-enum-is-bitmask'],
			}
		}
	}

	async function addDeepsightEnum (enumName: string, inFile = 'Interfaces.d.ts') {
		if (enums[enumName])
			return

		const dts = await fs.readFile(`static/definitions/${inFile}`, 'utf-8')
		const enumRegex = new RegExp(`export declare const enum ${enumName} \\{([\\s\\S]*?)\\}`, 'm')
		let lastValue = -1
		const members = dts.match(enumRegex)?.[1]
			?.split('\n')
			.map(line => line.trim())
			.filter(line => line && !line.startsWith('//'))
			.map(line => {
				const [name, value] = line.replace(',', '').split(' = ').map(part => part.trim())
				return { name, value: value === undefined ? ++lastValue : lastValue = Number(value) }
			})
		if (!members?.length) {
			console.warn(`Failed to extract Deepsight enum: ${enumName}`)
			return
		}

		enums[enumName] = {
			name: enumName,
			members,
		}
	}

	function addAugmentation (baseComponent: ComponentNames, augmentation: ComponentNames) {
		let component = components[baseComponent]
		if (!component)
			component = components[baseComponent] = { component: baseComponent }

		component.augmentations ??= []
		component.augmentations.push(augmentation)
	}

	////////////////////////////////////
	//#region Deepsight

	enums.TierType = {
		name: 'TierType',
		members: [
			{ name: 'BasicQuest', value: 0 },
			{ name: 'BasicCurrency', value: 1 },
			{ name: 'Common', value: 2 },
			{ name: 'Uncommon', value: 3 },
			{ name: 'Rare', value: 4 },
			{ name: 'Legendary', value: 5 },
			{ name: 'Exotic', value: 6 },
		],
	}

	components.DeepsightDropTableDefinition = {
		component: 'DeepsightDropTableDefinition',
		links: [
			{ path: 'rotationActivityHash', component: 'DestinyActivityDefinition' },
			{ path: 'displayProperties.iconHash', component: 'DestinyIconDefinition' },
			{ path: 'dropTable.{}', component: 'DestinyInventoryItemDefinition' },
			{ path: 'dropTable.{}.requiresQuest', component: 'DestinyInventoryItemDefinition' },
			{ path: 'dropTable.{}.requiresItems.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'encounters.[].dropTable.{}', component: 'DestinyInventoryItemDefinition' },
			{ path: 'encounters.[].dropTable.{}.requiresQuest', component: 'DestinyInventoryItemDefinition' },
			{ path: 'encounters.[].dropTable.{}.requiresItems.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'master.activityHash', component: 'DestinyActivityDefinition' },
			{ path: 'master.dropTable.{}', component: 'DestinyInventoryItemDefinition' },
			{ path: 'master.dropTable.{}.requiresQuest', component: 'DestinyInventoryItemDefinition' },
			{ path: 'master.dropTable.{}.requiresItems.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.drops.{}', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.drops.{}.requiresQuest', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.drops.{}.requiresItems.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.drops.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.masterDrops.{}', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.masterDrops.{}.requiresQuest', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.masterDrops.{}.requiresItems.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'rotations.masterDrops.[]', component: 'DestinyInventoryItemDefinition' },
			{ path: 'challenges.[]', component: 'DestinyActivityModifierDefinition' },
			{ path: 'typeDisplayProperties.iconHash', component: 'DestinyIconDefinition' },
		],
	}
	addAugmentation('DestinyActivityDefinition', 'DeepsightDropTableDefinition')

	components.DeepsightMomentDefinition = {
		component: 'DeepsightMomentDefinition',
		links: [
			{ path: 'displayProperties.iconHash', component: 'DestinyIconDefinition' },
			{ path: 'event', component: 'DestinyEventCardDefinition' },
			{ path: 'seasonHash', component: 'DestinySeasonDefinition' },
			{ path: 'itemHashes.[]', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DeepsightMomentDefinition', 'DeepsightWallpaperDefinition')

	components.DeepsightTierTypeDefinition = {
		component: 'DeepsightTierTypeDefinition',
		links: [
			{ path: 'displayProperties.iconHash', component: 'DestinyIconDefinition' },
			{ path: 'itemHash', component: 'DestinyInventoryItemDefinition' },
			{ path: 'tierType', enum: 'TierType' },
		],
	}
	addEnum('TierType')
	addAugmentation('DestinyItemTierTypeDefinition', 'DeepsightTierTypeDefinition')

	components.DeepsightStats = {
		component: 'DeepsightStats',
		links: [
			{ path: 'activeEvent', component: 'DestinyEventCardDefinition' },
		],
	}

	components.DeepsightCollectionsDefinition = {
		component: 'DeepsightCollectionsDefinition',
		links: [
			{ path: 'buckets.{}', component: 'DestinyInventoryBucketDefinition' },
			{ path: 'buckets.{}.[]', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DeepsightMomentDefinition', 'DeepsightCollectionsDefinition')

	components.DeepsightVariantDefinition = {
		component: 'DeepsightVariantDefinition',
		links: [
			{ path: 'hash', component: 'DestinyInventoryItemDefinition' },
			{ path: 'moment', component: 'DeepsightMomentDefinition' },
		],
	}

	components.DeepsightItemSourceListDefinition = {
		component: 'DeepsightItemSourceListDefinition',
		links: [
			{ path: 'sources.[]', enum: 'DeepsightItemSourceType' },
		],
	}
	await addDeepsightEnum('DeepsightItemSourceType')
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightItemSourceListDefinition')

	components.DeepsightItemSourceDefinition = {
		component: 'DeepsightItemSourceDefinition',
		links: [
			{ path: 'hash', enum: 'DeepsightItemSourceType' },
			{ path: 'category', enum: 'DeepsightItemSourceCategory' },
			{ path: 'event', component: 'DestinyEventCardDefinition' },
			{ path: 'displayProperties.iconHash', component: 'DestinyIconDefinition' },
		],
	}
	await addDeepsightEnum('DeepsightItemSourceCategory')

	components.DeepsightItemDamageTypesDefinition = {
		component: 'DeepsightItemDamageTypesDefinition',
		links: [
			{ path: 'damageTypes.[]', component: 'DestinyDamageTypeDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightItemDamageTypesDefinition')

	components.DeepsightBreakerTypeDefinition = {
		component: 'DeepsightBreakerTypeDefinition',
		links: [
			{ path: 'sources.[]', component: 'DeepsightBreakerSourceDefinition' },
			{ path: 'types.[]', component: 'DestinyBreakerTypeDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightBreakerTypeDefinition')

	components.DeepsightBreakerSourceDefinition = {
		component: 'DeepsightBreakerSourceDefinition',
		links: [
			{ path: 'hash', enum: 'BreakerSource' },
			{ path: 'trait', component: 'DestinyTraitDefinition' },
			{ path: 'appliesTraits.[]', component: 'DestinyTraitDefinition' },
			{ path: 'breakerTypes.[]', component: 'DestinyBreakerTypeDefinition' },
		],
	}
	await addDeepsightEnum('BreakerSource', 'DeepsightBreakerTypeDefinition.d.ts')

	components.DeepsightCatalystDefinition = {
		component: 'DeepsightCatalystDefinition',
		links: [
			{ path: 'record', component: 'DestinyRecordDefinition' },
			{ path: 'primaryObjectiveHashes.[]', component: 'DestinyObjectiveDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightCatalystDefinition')

	components.DeepsightSocketExtendedDefinition = {
		component: 'DeepsightSocketExtendedDefinition',
		links: [
			{ path: 'sockets.{}.rewardPlugItems.[].plugItemHash', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightSocketExtendedDefinition')

	components.DeepsightEmblemDefinition = {
		component: 'DeepsightEmblemDefinition',
		links: [
			{ path: 'displayProperties.iconHash', component: 'DestinyIconDefinition' },
			{ path: 'collectibleHash', component: 'DestinyCollectibleDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightEmblemDefinition')

	components.DeepsightAdeptDefinition = {
		component: 'DeepsightAdeptDefinition',
		links: [
			{ path: 'base', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightAdeptDefinition')

	components.DeepsightSocketCategorisation = {
		component: 'DeepsightSocketCategorisation',
		links: [
			{ path: 'categorisation.[].category', enum: 'DeepsightPlugCategory' },
		],
	}
	await addDeepsightEnum('DeepsightPlugCategory', 'DeepsightPlugCategorisation.d.ts')
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightSocketCategorisation')

	components.DeepsightPlugCategorisation = {
		component: 'DeepsightPlugCategorisation',
		links: [
			{ path: 'itemCategoryHashes', component: 'DestinyItemCategoryDefinition' },
			{ path: 'category', enum: 'DeepsightPlugCategory' },
			{ path: 'bucketHash', component: 'DestinyInventoryBucketDefinition' },
			{ path: 'stat', component: 'DestinyStatDefinition' },
			{ path: 'activityHash', component: 'DestinyActivityDefinition' },
			{ path: 'armourChargeStats.[].statTypeHash', component: 'DestinyStatDefinition' },
			{ path: 'damageType', component: 'DestinyDamageTypeDefinition' },
			{ path: 'subclasses.[]', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightPlugCategorisation')

	addAugmentation('DestinyInventoryItemDefinition', 'ClarityDescriptions')
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightFormattedClarityDescriptions')

	//#endregion
	////////////////////////////////////

	const DeepsightLinksDefinition: DeepsightLinksDefinition = { components, enums }

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightLinksDefinition.json', DeepsightLinksDefinition, { spaces: '\t' })
})
