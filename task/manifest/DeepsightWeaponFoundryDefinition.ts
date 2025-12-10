import { FoundryHashes, InventoryItemHashes, ItemCategoryHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightWeaponFoundryDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import { Log, Task } from 'task'
import Env from '../utility/Env'
import DestinyManifestReference from './DestinyManifestReference'
import { FoundryHashes as FoundryHashesRaw } from './enum/FoundryHashes'
import manifest from './utility/endpoint/DestinyManifest'

export default Task('DeepsightWeaponFoundryDefinition', async () => {
	interface FoundryDefinition extends Omit<DeepsightWeaponFoundryDefinition, 'hash' | 'displayProperties' | 'overlay'> {
		displayProperties: DestinyManifestReference.DisplayPropertiesDefinition
		overlay: DestinyManifestReference
	}

	const foundryDefinitions: Record<Exclude<FoundryHashes, FoundryHashes.Invalid>, FoundryDefinition> = {
		[FoundryHashes.FieldForged]: {
			displayProperties: {
				name: 'Field-Forged',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.FieldTestedOriginTraitPlug2120661319 },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.HawthornesFieldForgedShotgunShotgun731147177 },
		},
		[FoundryHashes.Cassoid]: {
			displayProperties: {
				name: 'Cassoid',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.WildCardOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.NoxPerennialVFusionRifle },
		},
		[FoundryHashes.Nadir]: {
			displayProperties: {
				name: 'Nadir',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.NadirFocusOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.GeodeticHsmSword },
		},
		[FoundryHashes.TexMechanica]: {
			displayProperties: {
				name: 'Tex Mechanica',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.TexBalancedStockOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.BoondoggleMk55SubmachineGun },
		},
		[FoundryHashes.SUROS]: {
			displayProperties: {
				name: 'SUROS',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.SurosSynergyOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.Cantata57HandCannon },
		},
		[FoundryHashes.Hakke]: {
			displayProperties: {
				name: 'Häkke',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.HakkeBreachArmamentsOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.PersesDScoutRifle },
		},
		[FoundryHashes.VEIST]: {
			displayProperties: {
				name: 'VEIST',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.VeistStingerOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.Suspectum4frLinearFusionRifle },
		},
		[FoundryHashes.Omolon]: {
			displayProperties: {
				name: 'Omolon',
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.OmolonFluidDynamicsOriginTraitPlug },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.AurvandilFr6FusionRifle },
		},
		[FoundryHashes.BlackArmory]: {
			displayProperties: {
				name: 'Black Armory',
				icon: { DestinyRecordDefinition: RecordHashes.EdzBlackArmorySmith },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.TataraGazeSniperRifle },
		},
		[FoundryHashes.BRAVE]: {
			displayProperties: {
				name: 'BRAVE',
				icon: { DestinyRecordDefinition: RecordHashes.BraveCollector },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.HammerheadMachineGun1896309757 },
		},
		[FoundryHashes.Daito]: {
			displayProperties: {
				name: 'Daito',
				icon: { DestinyInventoryItemDefinition: { hash: InventoryItemHashes.TheFateOfAllFoolsIntrinsicPlug, resolve: plug => `${Env.HOSTNAME}image/generated/${plug.displayProperties.iconHash}.png` } },
			},
			overlay: { DestinyInventoryItemDefinition: InventoryItemHashes.TheJadeRabbitScoutRifle },
		},
	}

	const DeepsightWeaponFoundryDefinition: Record<number, DeepsightWeaponFoundryDefinition> = await Promise.resolve(Object.entries(foundryDefinitions))
		.then(entries => Promise.all(entries
			.map(([hash, def]) => [+hash as FoundryHashes, def] as const)
			.map(async ([hash, def]): Promise<[FoundryHashes, DeepsightWeaponFoundryDefinition]> => [hash, {
				hash,
				displayProperties: await DestinyManifestReference.resolveAll(def.displayProperties),
				overlay: await DestinyManifestReference.resolve(def.overlay, 'secondaryIcon').then(icon => {
					if (!icon)
						throw new Error(`Unable to resolve foundry overlay icon for ${FoundryHashesRaw[hash]}`)
					return icon
				}),
			}])
		))
		.then(entries => Object.fromEntries(entries))

	const foundryImages = await manifest.DestinyInventoryItemDefinition
		.filter(i => true
			&& i.secondaryIcon
			&& i.itemCategoryHashes?.includes(ItemCategoryHashes.Weapon)
		)
		.map(i => i.secondaryIcon)
		.toSet()

	for (const foundryImage of foundryImages)
		if (!Object.values(DeepsightWeaponFoundryDefinition).some(def => def.overlay === foundryImage))
			if (Env.DEEPSIGHT_ENVIRONMENT === 'dev')
				Log.warn(`Foundry overlay image without definition: https://www.bungie.net${foundryImage}`)
			else
				throw new Error(`No foundry definition for overlay image https://www.bungie.net${foundryImage}`)

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightWeaponFoundryDefinition.json', DeepsightWeaponFoundryDefinition, { spaces: '\t' })
})
