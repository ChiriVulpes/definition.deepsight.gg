import { ItemCategoryHashes } from '@deepsight.gg/Enums'
import type { DeepsightWeaponTypeDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
import manifest from './utility/endpoint/DestinyManifest'

const _ = undefined

export default Task('DeepsightWeaponTypeDefinition', async () => {
	const excluded = new Set<ItemCategoryHashes>([
		ItemCategoryHashes.Weapon,
		ItemCategoryHashes.Dummies,
		ItemCategoryHashes.Inventory,
		ItemCategoryHashes.WeaponMods,
		ItemCategoryHashes.WeaponModsOrnaments,
		ItemCategoryHashes.Mods_Visiblefalse,
		ItemCategoryHashes.Mods_Visibletrue,
		ItemCategoryHashes.KineticWeapon,
		ItemCategoryHashes.EnergyWeapon,
		ItemCategoryHashes.PowerWeapon,
		ItemCategoryHashes.BreakerDisruption,
		ItemCategoryHashes.BreakerPiercing,
		ItemCategoryHashes.BreakerStagger,
	])
	const weaponDefs = await manifest.DestinyInventoryItemDefinition
		.filter(item => !!item.itemCategoryHashes?.includes(ItemCategoryHashes.Weapon))
	const categoryHashes = weaponDefs
		.flatMap(item => item.itemCategoryHashes ?? [])
		.filter(hash => !excluded.has(hash))
		.toSet()

	const orderDefs = await manifest.DestinyInventoryItemDefinition
		.filter(item => item.itemTypeDisplayName === 'Gunsmith Order')

	const iconDefs = await manifest.DestinyIconDefinition.filter(icon => orderDefs.some(def => def.displayProperties.iconHash === icon.hash))

	const DestinyItemCategoryDefinition = await manifest.DestinyItemCategoryDefinition.filter(category => categoryHashes.has(category.hash))
	const DeepsightWeaponTypeDefinition: Record<number, DeepsightWeaponTypeDefinition> = Object.values(DestinyItemCategoryDefinition)
		.toObject(category => {
			const catNameLength = category.displayProperties.name.length

			const order = orderDefs
				.filter(order => simplify(order.displayProperties.name).includes(simplify(category.displayProperties.name)))
				// get the closest match by name length
				.sort((a, b) => Math.abs(a.displayProperties.name.length - catNameLength) - Math.abs(b.displayProperties.name.length - catNameLength))
				.at(0)

			return [category.hash, {
				hash: category.hash,
				displayProperties: {
					...category.displayProperties,
					name: (_
						?? order?.displayProperties.name
						?? category.displayProperties.name
					),
					icon: (_
						?? iconDefs.find(icon => icon.hash === order?.displayProperties.iconHash)?.foreground
						?? order?.displayProperties.icon
						?? category.displayProperties.icon
					),
				},
			}]
		})

	if (DeepsightWeaponTypeDefinition[ItemCategoryHashes.HandCannon]?.displayProperties.name !== 'Hand Cannons')
		throw new Error('DeepsightWeaponTypeDefinition validation failed')

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightWeaponTypeDefinition.json', DeepsightWeaponTypeDefinition, { spaces: '\t' })
})

function simplify (name: string) {
	return name
		.toLowerCase()
		.replace(/\W+/g, '')
}
