import { ActivityHashes, ActivityModifierHashes, InventoryItemHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const episodeHeresyItemSet = await getMomentCollectionsItemSet(MomentHashes.EpisodeHeresy)
	const seasonOfTheSplicerItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheSplicer)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, episodeHeresyItemSet, seasonOfTheSplicerItemSet).byName

	return {
		hash: ActivityHashes.VaultOfGlassStandard,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.VaultOfGlass_Scope1 },
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Enter the Vault of Glass',
					description: 'Enter the Vault of Glass and face what lies within.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Raise the Spire',
					description: 'Find a way to open the Vault of Glass.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Delve Further',
					description: 'Delve further into the Vault of Glass.',
				},
			},
			{
				phaseHash: 1327839050,
				displayProperties: {
					name: 'Confluxes',
					directive: 'Defend all three Confluxes',
					description: 'Do not let the Vex reach the confluxes.',
				},
				dropTable: {
					[itemByName('Vision of Confluence').hash]: {},
					[itemByName('Found Verdict').hash]: {},
					[itemByName('Corrective Measure').hash]: {},
					[itemByName('Kabr\'s Brazen Grips').hash]: {},
					[itemByName('Light of the Great Prism').hash]: {},
					[itemByName('Prime Zealot Gloves').hash]: {},
					[itemByName('Shattered Vault Cloak').hash]: {},
					[itemByName('Gloves of the Hezen Lords').hash]: {},
					[itemByName('Fragment of the Prime').hash]: {},
				},
			},
			{
				phaseHash: 1327839048,
				displayProperties: {
					name: 'Oracles',
					directive: 'Destroy the Oracles',
					description: 'Silence the Oracles\' song.',
				},
				dropTable: {
					[itemByName('Praedyth\'s Revenge').hash]: {},
					[itemByName('Vision of Confluence').hash]: {},
					[itemByName('Found Verdict').hash]: {},
					[itemByName('Kabr\'s Brazen Grips').hash]: {},
					[itemByName('Kabr\'s Forceful Greaves').hash]: {},
					[itemByName('Prime Zealot Gloves').hash]: {},
					[itemByName('Prime Zealot Strides').hash]: {},
					[itemByName('Gloves of the Hezen Lords').hash]: {},
					[itemByName('Tread of the Hezen Lords').hash]: {},
				},
			},
			{
				phaseHash: 1327839049,
				displayProperties: {
					name: 'The Templar',
					directive: 'Defeat the Templar',
					description: 'Defeat the Templar and its legions.',
				},
				dropTable: {
					[itemByName('Fatebringer').hash]: {},
					[itemByName('Vision of Confluence').hash]: {},
					[itemByName('Corrective Measure').hash]: {},
					[itemByName('Kabr\'s Brazen Grips').hash]: {},
					[itemByName('Kabr\'s Wrath').hash]: {},
					[itemByName('Prime Zealot Gloves').hash]: {},
					[itemByName('Prime Zealot Cuirass').hash]: {},
					[itemByName('Gloves of the Hezen Lords').hash]: {},
					[itemByName('Cuirass of the Hezen Lords').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'The Great Fall',
					description: 'Survive the great fall.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'The Labyrinth',
					description: 'Find a way through the Gorgons\' Labyrinth.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'The Chasm',
					description: 'Find a way to cross the chasm and reach the Glass Throne.',
				},
			},
			{
				phaseHash: 3793779770,
				displayProperties: {
					name: 'Gatekeepers',
					directive: 'Awaken the Glass Throne',
					description: 'Protect the timelines and awaken the Glass Throne.',
				},
				dropTable: {
					[itemByName('Fatebringer').hash]: {},
					[itemByName('Hezen Vengeance').hash]: {},
					[itemByName('Found Verdict').hash]: {},
					[itemByName('Kabr\'s Battlecage').hash]: {},
					[itemByName('Kabr\'s Forceful Greaves').hash]: {},
					[itemByName('Prime Zealot Mask').hash]: {},
					[itemByName('Prime Zealot Strides').hash]: {},
					[itemByName('Facade of the Hezen Lords').hash]: {},
					[itemByName('Tread of the Hezen Lords').hash]: {},
				},
			},
			{
				phaseHash: 3793779769,
				displayProperties: {
					name: 'Atheon, Time\'s Conflux',
					directive: 'Destroy Atheon',
					description: 'Destroy Atheon, Time\'s Conflux.',
				},
				dropTable: {
					[itemByName('Praedyth\'s Revenge').hash]: {},
					[itemByName('Corrective Measure').hash]: {},
					[itemByName('Hezen Vengeance').hash]: {},
					[itemByName('Vex Mythoclast').hash]: {},
					[itemByName('Kabr\'s Battlecage').hash]: {},
					[itemByName('Kabr\'s Wrath').hash]: {},
					[itemByName('Prime Zealot Mask').hash]: {},
					[itemByName('Prime Zealot Cuirass').hash]: {},
					[itemByName('Facade of the Hezen Lords').hash]: {},
					[itemByName('Cuirass of the Hezen Lords').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.VaultOfGlassMaster_Tier0,
			dropTable: {
				[itemByName('Found Verdict (Timelost)').hash]: { purchaseOnly: true },
			},
		},
		rotations: {
			anchor: '2023-10-17T17:00:00Z',
			masterDrops: [
				InventoryItemHashes.FatebringerTimelostHandCannon_TooltipNotificationsLength3,
				InventoryItemHashes.HezenVengeanceTimelostRocketLauncher_TooltipNotificationsLength3,
				InventoryItemHashes.CorrectiveMeasureTimelostMachineGun_TooltipNotificationsLength3,
				InventoryItemHashes.VisionOfConfluenceTimelostScoutRifle_TooltipNotificationsLength3,
				InventoryItemHashes.PraedythsRevengeTimelostSniperRifle_TooltipNotificationsLength3,
			],
			challenges: [
				ActivityModifierHashes.OutOfItsWay,
				ActivityModifierHashes.StrangersInTime,
				ActivityModifierHashes.EnsemblesRefrain,
				ActivityModifierHashes.WaitForIt,
				ActivityModifierHashes.TheOnlyOracleForYou,
			],
		},
	} satisfies DeepsightDropTableDefinition
}
