import { ItemTierTypeHashes, type InventoryItemHashes } from '@deepsight.gg/Enums'
import { DeepsightAdeptDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
import type { PromiseOr } from '../utility/Type'
import { getDeepsightCollectionsDefinition } from './DeepsightCollectionsDefinition'
import ItemPreferred from './utility/ItemPreferred'
import manifest from './utility/endpoint/DestinyManifest'

let DeepsightAdeptDefinition: PromiseOr<Partial<Record<InventoryItemHashes, DeepsightAdeptDefinition>>> | undefined
export async function getDeepsightAdeptDefinition () {
	DeepsightAdeptDefinition ??= computeDeepsightAdeptDefinition()
	return DeepsightAdeptDefinition = await DeepsightAdeptDefinition
}

export default Task('DeepsightAdeptDefinition', async () => {
	const DeepsightAdeptDefinition = await getDeepsightAdeptDefinition()
	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightAdeptDefinition.json', DeepsightAdeptDefinition, { spaces: '\t' })
})

const NAME_OVERRIDES: Record<string, string> = {
	Judgement: 'Judgment',
}

function name (name: string) {
	return NAME_OVERRIDES[name] ?? name
}

export const REGEX_ADEPT = /^(.*?) \(.*?\)\s*$/

async function computeDeepsightAdeptDefinition () {
	const { DestinyInventoryItemDefinition } = manifest
	const invItems = await DestinyInventoryItemDefinition.all()
	const collections = Object.values(await getDeepsightCollectionsDefinition())
		.flatMap(collection => Object.values(collection.buckets))
		.flat()

	const DeepsightAdeptDefinition: Record<number, DeepsightAdeptDefinition> = {}

	for (const itemHash of collections) {
		const item = invItems[itemHash]
		if (!item.displayProperties.name)
			continue

		if (ItemPreferred.isEquippableDummy(item))
			continue

		if (item.inventory?.tierTypeHash !== ItemTierTypeHashes.Legendary)
			continue

		const [, adeptName] = item.displayProperties.name.match(REGEX_ADEPT) ?? []
		if (!adeptName)
			continue

		const adeptWatermark = item.iconWatermark
		const normalHash = collections
			?.find((itemHash, _1, _2, item = invItems[itemHash]) => true
				&& name(item.displayProperties.name) === name(adeptName)
				&& !ItemPreferred.isEquippableDummy(item)
				&& item.iconWatermark === adeptWatermark
			)

		if (!normalHash)
			continue

		DeepsightAdeptDefinition[itemHash] = { hash: itemHash, base: normalHash }
	}

	return DeepsightAdeptDefinition
}
