import { ActivityHashes, InventoryItemHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
	hash: ActivityHashes.GhostsOfTheDeepStandard,
	displayProperties: {
		icon: './image/png/activity/gotd.png',
	},
	dropTable: {
		[InventoryItemHashes.NoSurvivorsSubmachineGun3262192268]: {},
		[InventoryItemHashes.ColdComfortRocketLauncher839786290]: {},
		[InventoryItemHashes.GauntletsOfTheTakenKingGauntletsPlug2977663932]: {},
		[InventoryItemHashes.GraspsOfTheTakenKingGauntletsPlug409820272]: {},
		[InventoryItemHashes.GlovesOfTheTakenKingGauntletsPlug587762963]: {},
	},
	encounters: [
		{
			traversal: true,
			displayProperties: {
				name: 'Locate the Ritual Site',
				description: 'Find the Lucent Hive ritual site.',
			},
		},
		{
			phaseHash: 160562459, // best guess
			displayProperties: {
				name: 'Break the Ritual',
				description: 'Unravel the Lucent Hive ritual.',
			},
			dropTable: {
				[InventoryItemHashes.NewPacificEpitaphGrenadeLauncher1125217994]: {},
				[InventoryItemHashes.HelmOfTheTakenKingHelmetPlug2324998093]: {},
				[InventoryItemHashes.GreavesOfTheTakenKingLegArmorPlug2363472582]: {},
				[InventoryItemHashes.MaskOfTheTakenKingHelmetPlug896458489]: {},
				[InventoryItemHashes.StridesOfTheTakenKingLegArmorPlug726878794]: {},
				[InventoryItemHashes.HoodOfTheTakenKingHelmetPlug540625098]: {},
				[InventoryItemHashes.BootsOfTheTakenKingLegArmorPlug322717029]: {},
			},
		},
		{
			phaseHash: 3491633841, // best guess
			traversal: true,
			displayProperties: {
				name: 'Explore the Arcology',
				description: 'Explore the New Pacific Arcology in search of the Lucent Hive.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Explore the Arcology',
				description: 'Continue deeper into the New Pacific Arcology.',
			},
		},
		{
			phaseHash: 2368968549, // best guess
			traversal: true,
			displayProperties: {
				name: 'Dive',
				description: 'Reach the seafloor.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Reach the Wreckage',
				description: 'Traverse the seafloor to reach the wrecked Lucent Hive ship.',
			},
		},
		{
			phaseHash: 3040454024, // best guess
			traversal: true,
			displayProperties: {
				name: 'Explore the Wreckage',
				description: 'Search the depths of the wrecked Lucent Hive ship.',
			},
		},
		{
			phaseHash: 3469402858, // best guess
			displayProperties: {
				name: 'Defeat the Shield of Savathûn',
				description: 'Defeat Ecthar, the Shield of Savathûn.',
			},
			dropTable: {
				[InventoryItemHashes.GreasyLuckGlaive1757202961]: {},
				[InventoryItemHashes.PlateOfTheTakenKingChestArmorPlug2978918436]: {},
				[InventoryItemHashes.MarkOfTheTakenKingTitanMarkPlug3722748537]: {},
				[InventoryItemHashes.VestOfTheTakenKingChestArmorPlug42941848]: {},
				[InventoryItemHashes.CloakOfTheTakenKingHunterCloakPlug2733403573]: {},
				[InventoryItemHashes.VestmentOfTheTakenKingChestArmorPlug457617725]: {},
				[InventoryItemHashes.BondOfTheTakenKingWarlockBondPlug1961182320]: {},
			},
		},
		{
			phaseHash: 3828564565, // best guess
			traversal: true,
			displayProperties: {
				name: 'Go Deeper',
				description: 'Continue exploring the wrecked Hive ship.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Reach the Ritual Heart',
				description: 'Find the source of the Lucent Hive ritual.',
			},
		},
		{
			phaseHash: 2189312851, // best guess
			displayProperties: {
				name: 'Defeat Šimmumah ur-Nokru',
				description: 'Defeat the lightforged necromancer, Šimmumah ur-Nokru.',
			},
			dropTable: {
				[InventoryItemHashes.NewPacificEpitaphGrenadeLauncher1125217994]: {},
				[InventoryItemHashes.GreasyLuckGlaive1757202961]: {},
				[InventoryItemHashes.TheNavigatorTraceRifle]: {},
				[InventoryItemHashes.HelmOfTheTakenKingHelmetPlug2324998093]: {},
				[InventoryItemHashes.GreavesOfTheTakenKingLegArmorPlug2363472582]: {},
				[InventoryItemHashes.MaskOfTheTakenKingHelmetPlug896458489]: {},
				[InventoryItemHashes.StridesOfTheTakenKingLegArmorPlug726878794]: {},
				[InventoryItemHashes.HoodOfTheTakenKingHelmetPlug540625098]: {},
				[InventoryItemHashes.BootsOfTheTakenKingLegArmorPlug322717029]: {},
				[InventoryItemHashes.PlateOfTheTakenKingChestArmorPlug2978918436]: {},
				[InventoryItemHashes.MarkOfTheTakenKingTitanMarkPlug3722748537]: {},
				[InventoryItemHashes.VestOfTheTakenKingChestArmorPlug42941848]: {},
				[InventoryItemHashes.CloakOfTheTakenKingHunterCloakPlug2733403573]: {},
				[InventoryItemHashes.VestmentOfTheTakenKingChestArmorPlug457617725]: {},
				[InventoryItemHashes.BondOfTheTakenKingWarlockBondPlug1961182320]: {},
			},
		},
	],
	master: {
		activityHash: ActivityHashes.GhostsOfTheDeepMaster,
	},
} satisfies DeepsightDropTableDefinition
