import { InventoryItemHashes, ItemCategoryHashes, SocketCategoryHashes } from '@deepsight.gg/Enums'
import type { DestinyInventoryItemDefinition, DestinyPowerCapDefinition } from 'bungie-api-ts/destiny2'
import manifest from './endpoint/DestinyManifest'

namespace ItemPreferred {

	export async function findPreferredCopy (item: string | number | DestinyInventoryItemDefinition) {
		const { DestinyInventoryItemDefinition, DestinyPowerCapDefinition } = manifest
		const items = await DestinyInventoryItemDefinition.all()
		const powerCaps = await DestinyPowerCapDefinition.all()

		if (typeof item !== 'string') {
			const definition = typeof item === 'object' ? item : items[item]
			if (!definition?.displayProperties.name)
				return undefined

			item = definition.displayProperties.name
		}

		const name = item
		const matching = Object.values(items).filter(item => item.displayProperties?.name === name)

		const [preferred] = matching.filter(item => !isEquippableDummy(item))
			.sort((a, b) => sortPreferredCopy(a, b, powerCaps))

		return preferred
	}

	export function isEquippableDummy (item: DestinyInventoryItemDefinition) {
		return !item.equippable
			|| item.itemCategoryHashes?.includes(ItemCategoryHashes.Dummies)
			|| !(item.itemCategoryHashes?.includes(ItemCategoryHashes.Weapon) || item.itemCategoryHashes?.includes(ItemCategoryHashes.Armor))
	}

	const IGNORED_ITEMS: number[] = [
	]

	export function isIgnored (item: InventoryItemHashes) {
		return IGNORED_ITEMS.includes(item)
	}

	const hasDeprecatedArmorPerksSocket = (item: DestinyInventoryItemDefinition) =>
		!!item.sockets?.socketCategories.some(socket => socket.socketCategoryHash === SocketCategoryHashes.ArmorPerks_CategoryStyle1)

	const hasDeepsightSocket = (item: DestinyInventoryItemDefinition) =>
		!!item.sockets?.socketEntries.some(socket => socket.singleInitialItemHash === InventoryItemHashes.EmptyDeepsightSocketPlug)

	// todo make this better
	const armorArchetypePlugset = 1315181101
	const hasArchetypeSocket = (item: DestinyInventoryItemDefinition) =>
		!!item.sockets?.socketEntries.some(socket => socket.randomizedPlugSetHash === armorArchetypePlugset)
	const powerCap = (item: DestinyInventoryItemDefinition, powerCaps: Record<number, DestinyPowerCapDefinition>) =>
		powerCaps[item.quality?.versions[item.quality.currentVersion]?.powerCapHash ?? 0]?.powerCap ?? 0
	const notPowerCapped = (item: DestinyInventoryItemDefinition, powerCaps: Record<number, DestinyPowerCapDefinition>) =>
		powerCap(item, powerCaps) > 900_000
	const TRAIT_RELEASE_VERSION_REGEX = /(?:\.|^)v(\d+)(?:\.|$)/
	const traitReleaseVersion = (item: DestinyInventoryItemDefinition) =>
		item.traitIds?.map(id => +id.match(TRAIT_RELEASE_VERSION_REGEX)?.[1]! || 0).splat(Math.max) || 0

	export function sortPreferredCopy (itemA: DestinyInventoryItemDefinition, itemB: DestinyInventoryItemDefinition, powerCaps: Record<number, DestinyPowerCapDefinition>) {
		return 0
			|| +IGNORED_ITEMS.includes(itemA.hash) - +IGNORED_ITEMS.includes(itemB.hash)
			|| +itemA.isHolofoil - +itemB.isHolofoil
			|| +!!itemB.collectibleHash - +!!itemA.collectibleHash
			|| +!itemB.plug - +!itemA.plug
			|| +hasArchetypeSocket(itemB) - +hasArchetypeSocket(itemA)
			|| +hasDeprecatedArmorPerksSocket(itemA) - +hasDeprecatedArmorPerksSocket(itemB)
			|| +notPowerCapped(itemB, powerCaps) - +notPowerCapped(itemA, powerCaps)
			|| +hasDeepsightSocket(itemB) - +hasDeepsightSocket(itemA)
			|| +traitReleaseVersion(itemB) - +traitReleaseVersion(itemA)
	}
}

export default ItemPreferred
