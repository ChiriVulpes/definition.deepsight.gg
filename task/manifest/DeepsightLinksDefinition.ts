import type { DeepsightComponentLinksDefinition, DeepsightDefinitionLinkDefinition, DeepsightEnumDefinition, DeepsightEnumLinkDefinition, DeepsightLinksDefinition, DeepsightManifestComponentsMap, LinksSourceComponentName, PopularityreportManifestComponentsMap } from '@deepsight.gg/Interfaces'
import type { AllDestinyManifestComponents } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import { Task } from 'task'
import { createOpenApiComponentNameMap, isOpenApiReference, loadBungieOpenApi, openApiReferenceName, resolveOpenApiReference, type OpenAPIDefinition, type OpenAPIReference } from '../utility/BungieOpenApi'
import getDestinyManifestComponents from './utility/endpoint/DestinyManifestComponents'

declare module 'bungie-api-ts/destiny2/manifest' {
	export interface AllDestinyManifestComponents {
		DestinyInventoryItemLiteDefinition: {
			[key: number]: DestinyInventoryItemLiteDefinition
		}
	}
}

const _ = undefined

export default Task('DeepsightLinksDefinition', async () => {
	type ComponentNames = keyof AllDestinyManifestComponents | keyof DeepsightManifestComponentsMap | keyof PopularityreportManifestComponentsMap | 'ClarityDescriptions'
	const components: Partial<Record<LinksSourceComponentName, DeepsightComponentLinksDefinition>> = {}
	const enums: Partial<Record<string, DeepsightEnumDefinition>> = {}

	////////////////////////////////////
	//#region Destiny

	const componentNames = await getDestinyManifestComponents()
	const openapi = await loadBungieOpenApi()

	const { foundComponents, names: componentNamesToDefNamesAndViceVersa } = createOpenApiComponentNameMap(openapi, componentNames)

	for (const [definitionName, definition] of Object.entries(openapi.components.schemas)) {
		const componentName = componentNamesToDefNamesAndViceVersa.get(definitionName) as ComponentNames | undefined
		if (!componentName)
			continue

		// console.log(componentName)
		// console.log(getOpenApiLinks(definition))
		const links = getOpenApiLinks(definition)
		if (links.length)
			components[componentName] = {
				component: componentName,
				links,
			}
	}

	const missingComponents = componentNames.filter(name => !foundComponents.has(name))
	if (missingComponents.length > 0) {
		console.log('\nMissing Components in openapi.json:')
		for (const componentName of missingComponents)
			console.log(`- ${componentName}`)
	}

	function addMissingDestinyComponentLink (inTable: ComponentNames, path: string, targetTable: ComponentNames) {
		if (components[inTable]?.links?.some(link => link.path === path))
			throw new Error(`Link already exists for ${inTable}:${path}`)

		components[inTable] ??= { component: inTable }
		components[inTable].links ??= []
		components[inTable].links.push({ component: targetTable, path })
	}

	// add missing ones
	addMissingDestinyComponentLink(
		'DestinyGlobalConstantsDefinition',
		'portalActivityGraphRootNodesWithIcons.{}',
		'DestinyFireteamFinderActivityGraphDefinition',
	)

	addVirtualOpenApiComponentLinks('profiles', getProfileSchema())
	addVirtualOpenApiComponentLinks('pgcrs', {
		type: 'object',
		properties: {
			profile: getProfileSchema(),
			activity: openApiReference('Destiny.HistoricalStats.DestinyHistoricalStatsPeriodGroup'),
			pgcr: openApiReference('Destiny.HistoricalStats.DestinyPostGameCarnageReportData'),
		},
	})

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
				bitmask: schema['x-enum-is-bitmask'] ? true : undefined,
			}
		}
	}

	function getOpenApiLinks (def?: OpenAPIDefinition | OpenAPIReference, path: string[] = [], mappedDef?: OpenAPIReference): (DeepsightDefinitionLinkDefinition | DeepsightEnumLinkDefinition)[] {
		if (!def)
			return []

		if (isOpenApiReference(def))
			return getOpenApiLinks(resolveOpenApiReference(openapi, def), path)

		if (def.type === 'number' || (def.type === 'integer' && !('enum' in def) && !('x-enum-reference' in def))) {
			mappedDef = def['x-mapped-definition'] ?? mappedDef
			const defName = mappedDef && openApiReferenceName(mappedDef)
			const componentName = defName && componentNamesToDefNamesAndViceVersa.get(defName) as ComponentNames | undefined
			return !componentName ? []
				: [{ component: componentName, path: path.join('.') }]
		}

		if (def.type === 'integer' && 'x-enum-reference' in def) {
			const enumSchemaName = openApiReferenceName(def['x-enum-reference']!)
			const enumName = enumSchemaName.split('.').pop()!
			addEnum(enumName)
			return [{ enum: enumName, path: path.join('.') }]
		}

		if (def.type !== 'object' && def.type !== 'array')
			return []

		if (def.type === 'array')
			return getOpenApiLinks(def.items, [...path, '[]'], def['x-mapped-definition'])

		const links: (DeepsightDefinitionLinkDefinition | DeepsightEnumLinkDefinition)[] = []

		if (def.properties)
			for (const [propName, propDef] of Object.entries(def.properties))
				links.push(...getOpenApiLinks(propDef, [...path, propName]))

		if (def.additionalProperties && def['x-dictionary-key'])
			links.push(...getOpenApiLinks(def['x-dictionary-key'], [...path, '{}'], def['x-mapped-definition']))

		if (isOpenApiReference(def.additionalProperties))
			links.push(...getOpenApiLinks(def.additionalProperties, [...path, '{}']))

		if (def.allOf)
			for (const subDef of def.allOf)
				links.push(...getOpenApiLinks(subDef, path))

		return links
	}

	function addVirtualOpenApiComponentLinks (component: LinksSourceComponentName, definition: OpenAPIDefinition) {
		const links = getOpenApiLinks(definition)
		if (links.length)
			components[component] = {
				component,
				links,
			}
	}

	function getProfileSchema (): OpenAPIDefinition {
		return {
			type: 'object',
			properties: {
				type: enumReference('BungieMembershipType'),
				classType: enumReference('Destiny.DestinyClass'),
				emblem: {
					type: 'object',
					properties: {
						hash: mappedDefinitionReference('Destiny.Definitions.DestinyInventoryItemDefinition'),
					},
				},
				characters: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							metadata: openApiReference('Destiny.Entities.Characters.DestinyCharacterComponent'),
							emblem: {
								type: 'object',
								properties: {
									hash: mappedDefinitionReference('Destiny.Definitions.DestinyInventoryItemDefinition'),
								},
							},
						},
					},
				},
			},
		}
	}

	function openApiReference (schema: string): OpenAPIReference {
		return { $ref: `#/components/schemas/${schema}` }
	}

	function mappedDefinitionReference (schema: string): OpenAPIDefinition {
		return {
			'type': 'integer',
			'format': 'uint32',
			'x-mapped-definition': openApiReference(schema),
		}
	}

	function enumReference (schema: string): OpenAPIDefinition {
		return {
			'type': 'integer',
			'format': 'int32',
			'x-enum-reference': openApiReference(schema),
			'x-enum-is-bitmask': false,
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

	addAugmentation('DestinyInventoryItemDefinition', 'DestinyInventoryItemLiteDefinition')

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
			{ path: 'sources.[]', component: 'DeepsightItemSourceDefinition' },
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

	// components.DeepsightImageAnalysisDefinition = {
	// 	component: 'DeepsightImageAnalysisDefinition',
	// 	links: [
	// 		{ path: 'analysis.{}', enum: 'DeepsightImageCategory' },
	// 	],
	// }
	// components.DeepsightImageCategoryDefinition = {
	// 	component: 'DeepsightImageCategoryDefinition',
	// 	links: [
	// 		{ path: 'hash', enum: 'DeepsightImageCategory' },
	// 	],
	// }
	// await addDeepsightEnum('DeepsightImageCategory')

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

	components.DeepsightWeaponTypeDefinition = {
		component: 'DeepsightWeaponTypeDefinition',
		links: [
			{ path: 'frames.[]', component: 'DestinyInventoryItemDefinition' },
		],
	}
	addAugmentation('DestinyItemCategoryDefinition', 'DeepsightWeaponTypeDefinition')

	components.DeepsightWeaponFrameDefinition = {
		component: 'DeepsightWeaponFrameDefinition',
		links: [
			{ path: 'weaponTypes.[]', component: 'DestinyItemCategoryDefinition' },
		],
	}
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightWeaponFrameDefinition')

	//#endregion
	////////////////////////////////////

	addAugmentation('DestinyInventoryItemDefinition', 'ClarityDescriptions')
	addAugmentation('DestinyInventoryItemDefinition', 'DeepsightFormattedClarityDescriptions')

	////////////////////////////////////
	//#region Popularityreport

	components.PopularityreportQuantilesDefinition = {
		component: 'PopularityreportQuantilesDefinition',
		links: [
			{ path: 'director_activity', component: 'DestinyActivityDefinition' },
			{ path: 'activity', component: 'DestinyActivityDefinition' },
		],
	}
	addAugmentation('DestinyActivityDefinition', 'PopularityreportQuantilesDefinition')

	//#endregion
	////////////////////////////////////

	const DeepsightLinksDefinition: DeepsightLinksDefinition = { components, enums }

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightLinksDefinition.json', DeepsightLinksDefinition, { spaces: '\t' })
})
