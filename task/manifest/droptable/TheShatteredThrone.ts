import { ActivityHashes, InventoryItemHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const seasonOfTheWishItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheWish)
	const forsakenItemSet = await getMomentCollectionsItemSet(MomentHashes.Forsaken)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, seasonOfTheWishItemSet, forsakenItemSet).byName

	return {
		hash: ActivityHashes.TheShatteredThrone,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.DarkMonastery },
		},
		dropTable: {
			[itemByName('Abide the Return').hash]: {},
			[itemByName('Retold Tale').hash]: {},
			[itemByName('Sleepless').hash]: {},
			[itemByName('Tigerspite').hash]: {},
			[itemByName('Twilight Oath').hash]: {},
			[itemByName('Vouchsafe').hash]: {},
			[itemByName('Waking Vigil').hash]: {},

			[itemByName('Techeun\'s Regalia Helmet').hash]: {},
			[itemByName('Techeun\'s Regalia Gauntlets').hash]: {},
			[itemByName('Techeun\'s Regalia Plate').hash]: {},
			[itemByName('Techeun\'s Regalia Greaves').hash]: {},
			[itemByName('Techeun\'s Regalia Mark').hash]: {},

			[itemByName('Techeun\'s Regalia Mask').hash]: {},
			[itemByName('Techeun\'s Regalia Grips').hash]: {},
			[itemByName('Techeun\'s Regalia Vest').hash]: {},
			[itemByName('Techeun\'s Regalia Strides').hash]: {},
			[itemByName('Techeun\'s Regalia Cloak').hash]: {},

			[itemByName('Techeun\'s Regalia Hood').hash]: {},
			[itemByName('Techeun\'s Regalia Gloves').hash]: {},
			[itemByName('Techeun\'s Regalia Robes').hash]: {},
			[itemByName('Techeun\'s Regalia Boots').hash]: {},
			[itemByName('Techeun\'s Regalia Bond').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Cross the Ascendant Plane',
					description: '"A throne world, shattered…"',
				},
			},
			{
				displayProperties: {
					name: 'Search for safe passage',
					description: '"Show me your cunning…"',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Journey to the spire',
					description: '"There is no place better suited for you…"',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Press onward',
					description: '"Her plan will never come to pass…"',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Cross the chasm',
					description: '"Look down. Listen to the Deep call to you…"',
				},
			},
			{
				displayProperties: {
					name: 'Vorgeth, the Boundless Hunger',
					directive: 'Overcome the Keeper of Petitions',
					description: '"Shape your schemes into reality…"',
				},
				dropTable: {
					[itemByName('Wish-Ender').hash]: {
						requiresQuest: InventoryItemHashes.HuntersRemembranceQuestStep_Step2,
						requiresItems: [
							InventoryItemHashes.WakingTokenOfQuerimDummy_ItemType0,
							InventoryItemHashes.WakingTokenOfEriviksDummy_ItemType0,
							InventoryItemHashes.WakingTokenOfXavothDummy_ItemType0,
						],
					},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Press onward',
					description: '"Come closer…"',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Ascend',
					description: '"Doomed are the hesitant…"',
				},
			},
			{
				displayProperties: {
					name: 'Dûl Incaru, the Eternal Return',
					directive: 'Face Dûl Incaru',
					description: '"Enter the infinite…"',
				},
			},
		],
	} satisfies DeepsightDropTableDefinition
}
