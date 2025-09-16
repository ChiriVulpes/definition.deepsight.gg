import type { InventoryItemHashes } from '@deepsight.gg/Enums'
import type { DeepsightVariantDefinition, DeepsightVariantDefinitionEntry, DeepsightVariantTag } from '@deepsight.gg/Interfaces'
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import { Task } from 'task'
import { getDeepsightAdeptDefinition, REGEX_ADEPT } from './DeepsightAdeptDefinition'
import { getDeepsightCollectionsDefinition, getWatermarkToMomentHashLookupTable } from './DeepsightCollectionsDefinition'
import { getDeepsightSocketCategorisation } from './DeepsightSocketCategorisation'
import DestinyManifest from './utility/endpoint/DestinyManifest'
import ItemPreferred from './utility/ItemPreferred'

export default Task('DeepsightVariantDefinition', async () => {
	const DestinyInventoryItemDefinition = await DestinyManifest.DestinyInventoryItemDefinition.all()

	const DeepsightCollectionsDefinition = await getDeepsightCollectionsDefinition()
	const WatermarkToMomentHashLookupTable = await getWatermarkToMomentHashLookupTable()

	const DeepsightSocketCategorisation = await getDeepsightSocketCategorisation()
	const isArtifice = (itemHash: number) => {
		const artificeIndex = DeepsightSocketCategorisation[itemHash]?.categorisation.findIndex(socket => socket.fullName === 'Intrinsic/ArmorArtifice')
		if (artificeIndex === undefined || artificeIndex === -1)
			return false

		const singleInitialItemHash = DestinyInventoryItemDefinition[itemHash]?.sockets?.socketEntries[artificeIndex]?.singleInitialItemHash
		if (!singleInitialItemHash)
			return false

		return true
	}

	const DeepsightAdeptDefinition = await getDeepsightAdeptDefinition()
	const isAdept = (itemHash: number) => !!DeepsightAdeptDefinition?.[itemHash as InventoryItemHashes]

	const getDedupeName = (def: DestinyInventoryItemDefinition) => {
		const baseName = !isAdept(def.hash) ? def.displayProperties.name : def.displayProperties.name.match(REGEX_ADEPT)?.[1] ?? def.displayProperties.name
		return `${def.classType}: ${def.inventory?.bucketTypeHash}: ${baseName}`
	}

	function getType (def: DestinyInventoryItemDefinition): DeepsightVariantTag {
		if (ItemPreferred.isEquippableDummy(def)) return 'dummy'
		if (def.isHolofoil) return 'holofoil'
		if (isArtifice(def.hash)) return 'artifice'
		if (isAdept(def.hash)) return 'adept'
		return 'generic'
	}

	const collectionsItemHashes = Object.values(DeepsightCollectionsDefinition)
		.flatMap(moment => Object.values(moment.buckets))
		.flat()
		.toSet()

	const collectionsItemDefs = Array.from(collectionsItemHashes).map(item => DestinyInventoryItemDefinition[item])
	const variantGroups = collectionsItemDefs
		.groupBy(
			i => getDedupeName(i),
			(i): DeepsightVariantDefinitionEntry => ({
				hash: i.hash as InventoryItemHashes,
				type: getType(i),
				moment: WatermarkToMomentHashLookupTable[i.iconWatermark],
			})
		)
		.toMap()

	for (const itemHash in DestinyInventoryItemDefinition) {
		if (collectionsItemHashes.has(+itemHash))
			continue

		const itemDef = DestinyInventoryItemDefinition[itemHash]
		const type = getType(itemDef)
		if (type === 'generic' && !itemDef.collectibleHash)
			continue

		if (type !== 'dummy' && !itemDef.screenshot)
			continue

		const name = getDedupeName(itemDef)
		const group = variantGroups.get(name)
		if (!group)
			continue

		group.push({
			hash: itemDef.hash as InventoryItemHashes,
			type,
			moment: WatermarkToMomentHashLookupTable[itemDef.iconWatermark],
		})
	}

	const groups = Array.from(variantGroups.values()).filter(g => g.length > 1)
	const DeepsightVariantDefinition: DeepsightVariantDefinition = {
		variantGroupLookupTable: (groups
			.flatMap((group, i) => group.map(item => [item.hash, i] as const))
			.toObject()
		),
		groups,
	}

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightVariantDefinition.json', DeepsightVariantDefinition, { spaces: '\t' })
})
