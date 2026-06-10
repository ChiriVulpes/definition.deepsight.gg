import { ActivityHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const riteOfTheNineItemSet = await getMomentCollectionsItemSet(MomentHashes.RiteOfTheNine)
	const seasonOfTheDeepItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheDeep)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, riteOfTheNineItemSet, seasonOfTheDeepItemSet).byName

	return {
		hash: ActivityHashes.GhostsOfTheDeepStandard,
		displayProperties: {
			icon: './image/png/activity/gotd.png',
		},
		dropTable: {
			[itemByName('No Survivors').hash]: {},
			[itemByName('Cold Comfort').hash]: {},
			[itemByName('Gauntlets of the Taken King').hash]: {},
			[itemByName('Grasps of the Taken King').hash]: {},
			[itemByName('Gloves of the Taken King').hash]: {},
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
					[itemByName('New Pacific Epitaph').hash]: {},
					[itemByName('Helm of the Taken King').hash]: {},
					[itemByName('Greaves of the Taken King').hash]: {},
					[itemByName('Mask of the Taken King').hash]: {},
					[itemByName('Strides of the Taken King').hash]: {},
					[itemByName('Hood of the Taken King').hash]: {},
					[itemByName('Boots of the Taken King').hash]: {},
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
					[itemByName('Greasy Luck').hash]: {},
					[itemByName('Plate of the Taken King').hash]: {},
					[itemByName('Mark of the Taken King').hash]: {},
					[itemByName('Vest of the Taken King').hash]: {},
					[itemByName('Cloak of the Taken King').hash]: {},
					[itemByName('Vestment of the Taken King').hash]: {},
					[itemByName('Bond of the Taken King').hash]: {},
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
					[itemByName('New Pacific Epitaph').hash]: {},
					[itemByName('Greasy Luck').hash]: {},
					[itemByName('The Navigator').hash]: {},
					[itemByName('Helm of the Taken King').hash]: {},
					[itemByName('Greaves of the Taken King').hash]: {},
					[itemByName('Mask of the Taken King').hash]: {},
					[itemByName('Strides of the Taken King').hash]: {},
					[itemByName('Hood of the Taken King').hash]: {},
					[itemByName('Boots of the Taken King').hash]: {},
					[itemByName('Plate of the Taken King').hash]: {},
					[itemByName('Mark of the Taken King').hash]: {},
					[itemByName('Vest of the Taken King').hash]: {},
					[itemByName('Cloak of the Taken King').hash]: {},
					[itemByName('Vestment of the Taken King').hash]: {},
					[itemByName('Bond of the Taken King').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.GhostsOfTheDeepMaster,
		},
	} satisfies DeepsightDropTableDefinition
}
