import { ActivityHashes, InventoryItemHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const episodeRevenantItemSet = await getMomentCollectionsItemSet(MomentHashes.EpisodeRevenant)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, episodeRevenantItemSet).byName

	return {
		hash: ActivityHashes.VespersHostNormal,
		displayProperties: {
			icon: './image/png/activity/vespershost.png',
		},
		dropTable: {
			[itemByName('VS Gravitic Arrest').hash]: {},

			[itemByName('Spacewalk Boots').hash]: {},
			[itemByName('Spacewalk Boots').hash]: {},
			[itemByName('Spacewalk Greaves').hash]: {},
			[itemByName('Spacewalk Greaves').hash]: {},
			[itemByName('Spacewalk Strides').hash]: {},
			[itemByName('Spacewalk Strides').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					directive: 'Embarkation',
					description: 'Search for a way into Vesper Station.',
				},
			},
			{
				displayProperties: {
					name: 'Activation',
					directive: 'Reactivate Vesper Station',
					description: 'Reactivate station power to open the path ahead.',
				},
				dropTable: {
					[itemByName('VS Chill Inhibitor').hash]: {},
					[itemByName('VS Velocity Baton').hash]: {},

					[itemByName('Spacewalk Plate').hash]: {},
					[itemByName('Spacewalk Plate').hash]: {},
					[itemByName('Spacewalk Robes').hash]: {},
					[itemByName('Spacewalk Robes').hash]: {},
					[itemByName('Spacewalk Vest').hash]: {},
					[itemByName('Spacewalk Vest').hash]: {},

					[itemByName('Spacewalk Gauntlets').hash]: {},
					[itemByName('Spacewalk Gauntlets').hash]: {},
					[itemByName('Spacewalk Gloves').hash]: {},
					[itemByName('Spacewalk Gloves').hash]: {},
					[itemByName('Spacewalk Grasps').hash]: {},
					[itemByName('Spacewalk Grasps').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					directive: 'Infiltration',
					description: 'Continue moving forward through the station to uncover its mysteries.',
				},
			},
			{
				displayProperties: {
					name: 'Dismemberment',
					directive: 'Defeat Raneiks Unified',
					description: 'Find a way to defeat the Unified Servitor.',
				},
				dropTable: {
					[itemByName('VS Chill Inhibitor').hash]: {},
					[itemByName('VS Pyroelectric Propellant').hash]: {},

					[itemByName('Spacewalk Helm').hash]: {},
					[itemByName('Spacewalk Helm').hash]: {},
					[itemByName('Spacewalk Cover').hash]: {},
					[itemByName('Spacewalk Cover').hash]: {},
					[itemByName('Spacewalk Cowl').hash]: {},
					[itemByName('Spacewalk Cowl').hash]: {},

					[itemByName('Spacewalk Gauntlets').hash]: {},
					[itemByName('Spacewalk Gauntlets').hash]: {},
					[itemByName('Spacewalk Gloves').hash]: {},
					[itemByName('Spacewalk Gloves').hash]: {},
					[itemByName('Spacewalk Grasps').hash]: {},
					[itemByName('Spacewalk Grasps').hash]: {},

					[itemByName('Spacewalk Mark').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
					[itemByName('Spacewalk Bond').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
					[itemByName('Spacewalk Cloak').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
				},
			},
			{
				traversal: true,
				displayProperties: {
					directive: 'Acceleration',
					description: 'Make your way closer to the Anomaly to find a way to shut it down.',
				},
			},
			{
				displayProperties: {
					name: 'Shutdown',
					directive: 'Defeat The Corrupted Puppeteer',
					description: 'Take down the Corrupted Puppeteer and stop it from channeling power to the Anomaly.',
				},
				dropTable: {
					[itemByName('Ice Breaker').hash]: {},
					[itemByName('VS Velocity Baton').hash]: {},
					[itemByName('VS Pyroelectric Propellant').hash]: {},

					[itemByName('Spacewalk Helm').hash]: {},
					[itemByName('Spacewalk Helm').hash]: {},
					[itemByName('Spacewalk Cover').hash]: {},
					[itemByName('Spacewalk Cover').hash]: {},
					[itemByName('Spacewalk Cowl').hash]: {},
					[itemByName('Spacewalk Cowl').hash]: {},

					[itemByName('Spacewalk Plate').hash]: {},
					[itemByName('Spacewalk Plate').hash]: {},
					[itemByName('Spacewalk Robes').hash]: {},
					[itemByName('Spacewalk Robes').hash]: {},
					[itemByName('Spacewalk Vest').hash]: {},
					[itemByName('Spacewalk Vest').hash]: {},

					// bond only drops class items from dungeon completion on master it seems?
					[itemByName('Spacewalk Bond').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
					[itemByName('Spacewalk Mark').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
					[itemByName('Spacewalk Cloak').hash]: { requiresQuest: InventoryItemHashes.RogueNetworkQuestStep_Step9 },
				},
			},
		],
		master: {
			activityHash: ActivityHashes.VespersHostMaster,
		},
	} satisfies DeepsightDropTableDefinition
}
