import { ActivityHashes, InventoryItemHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const episodeHeresyItemSet = await getMomentCollectionsItemSet(MomentHashes.EpisodeHeresy)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, episodeHeresyItemSet).byName

	return {
		hash: ActivityHashes.SunderedDoctrineNormal,
		displayProperties: {
			icon: './image/png/activity/sundereddoctrine.png',
		},
		dropTable: {
			[itemByName('Unloved').hash]: {},
			[itemByName('Unsworn').hash]: {},

			[itemByName('Mask of the Flain').hash]: {},
			[itemByName('Mask of the Flain').hash]: {},
			[itemByName('Skull of the Flain').hash]: {},
			[itemByName('Skull of the Flain').hash]: {},
			[itemByName('Visage of the Flain').hash]: {},
			[itemByName('Visage of the Flain').hash]: {},

			[itemByName('Grasps of the Flain').hash]: {},
			[itemByName('Grasps of the Flain').hash]: {},
			[itemByName('Grips of the Flain').hash]: {},
			[itemByName('Grips of the Flain').hash]: {},
			[itemByName('Reach of the Flain').hash]: {},
			[itemByName('Reach of the Flain').hash]: {},

			[itemByName('Claws of the Flain').hash]: {},
			[itemByName('Claws of the Flain').hash]: {},
			[itemByName('Hooks of the Flain').hash]: {},
			[itemByName('Hooks of the Flain').hash]: {},
			[itemByName('Talons of the Flain').hash]: {},
			[itemByName('Talons of the Flain').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					directive: 'Find the Path',
					description: 'Make your way to where the Dread are congregating within the Pyramid.',
				},
			},
			{
				displayProperties: {
					name: 'The Riddle',
					directive: 'Solve the Riddle',
					description: 'Cast a light on the mysteries of the Pyramid.',
				},
				dropTable: {
					[itemByName('Unworthy').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					directive: 'Navigate the Maze',
					description: 'Find your way through the labyrinth.',
				},
			},
			{
				displayProperties: {
					name: 'Zoetic Lockset',
					directive: 'Open the Locks',
					description: 'Unbar your way forward.',
				},
				dropTable: {
					[itemByName('Unvoiced').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					directive: 'Locate the Vault',
					description: 'Seek the Dread at the end of Rhulk\'s storehouses and laboratories.',
				},
			},
			{
				displayProperties: {
					name: 'Kerrev, the Erased',
					directive: 'Defeat Kerrev, the Erased',
					description: 'Stop the dread from opening the vault door.',
				},
				dropTable: {
					[itemByName('Unvoiced').hash]: {},
					[itemByName('Unworthy').hash]: {},
					[itemByName('Finality\'s Auger').hash]: {},

					[itemByName('Adornment of the Flain').hash]: {},
					[itemByName('Adornment of the Flain').hash]: {},
					[itemByName('Carapace of the Flain').hash]: {},
					[itemByName('Carapace of the Flain').hash]: {},
					[itemByName('Scales of the Flain').hash]: {},
					[itemByName('Scales of the Flain').hash]: {},

					[itemByName('Weaver\'s Bond').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
					[itemByName('Weaver\'s Bond').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
					[itemByName('Attendant\'s Mark').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
					[itemByName('Attendant\'s Mark').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
					[itemByName('Husk\'s Cloak').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
					[itemByName('Husk\'s Cloak').hash]: { requiresQuest: InventoryItemHashes.TheDrowningLabyrinthQuestStep_Step10 },
				},
			},
		],
		master: {
			activityHash: ActivityHashes.SunderedDoctrineMaster,
		},
	} satisfies DeepsightDropTableDefinition
}
