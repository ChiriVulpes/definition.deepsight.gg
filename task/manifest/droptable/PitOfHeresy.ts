import { ActivityHashes, InventoryItemHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet).byName

	return {
		hash: ActivityHashes.PitOfHeresyStandard,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.AMysteriousDisturbance },
		},
		dropTable: {
			[itemByName('Apostate\'s Blade Helm').hash]: {},
			[itemByName('Apostate\'s Blade Gauntlets').hash]: {},
			[itemByName('Apostate\'s Blade Plate').hash]: {},
			[itemByName('Apostate\'s Blade Greaves').hash]: {},
			[itemByName('Apostate\'s Blade Mark').hash]: {},

			[itemByName('Apostate\'s Blade Mask').hash]: {},
			[itemByName('Apostate\'s Blade Grips').hash]: {},
			[itemByName('Apostate\'s Blade Vest').hash]: {},
			[itemByName('Apostate\'s Blade Strides').hash]: {},
			[itemByName('Apostate\'s Blade Cloak').hash]: {},

			[itemByName('Apostate\'s Blade Hood').hash]: {},
			[itemByName('Apostate\'s Blade Gloves').hash]: {},
			[itemByName('Apostate\'s Blade Robe').hash]: {},
			[itemByName('Apostate\'s Blade Boots').hash]: {},
			[itemByName('Apostate\'s Blade Bond').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Descend into the Pit of Heresy',
					description: 'Delve below the Scarlet Keep and into the Pit of Heresy.',
				},
			},
			{
				displayProperties: {
					name: 'Necropolis',
					description: 'Turn the blades of the enemy against them.',
				},
				dropTable: {
					[itemByName('Apostate').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
					[itemByName('Blasphemer').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
					[itemByName('Heretic').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },

					[itemByName('Every Waking Moment').hash]: {},
					[itemByName('Love and Death').hash]: {},
					[itemByName('A Fine Memorial').hash]: {},
					[itemByName('One Small Step').hash]: {},
					[itemByName('Premonition').hash]: {},
					[itemByName('Loud Lullaby').hash]: {},
					[itemByName('Arc Logic').hash]: {},
					[itemByName('Dream Breaker').hash]: {},
					[itemByName('Tranquility').hash]: {},
					[itemByName('Night Terror').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Descend into the Pit of Heresy',
					description: 'Head toward the Tunnels of Despair.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Tunnels of Despair',
					description: 'Find a way through the Tunnels of Despair.',
				},
			},
			{
				displayProperties: {
					name: 'Chamber of Suffering',
					description: 'Endure the Chamber of Suffering.',
				},
				dropTable: {
					[itemByName('Apostate').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
					[itemByName('Blasphemer').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
					[itemByName('Heretic').hash]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },

					[itemByName('Every Waking Moment').hash]: {},
					[itemByName('Love and Death').hash]: {},
					[itemByName('A Fine Memorial').hash]: {},
					[itemByName('One Small Step').hash]: {},
					[itemByName('Premonition').hash]: {},
					[itemByName('Loud Lullaby').hash]: {},
					[itemByName('Arc Logic').hash]: {},
					[itemByName('Dream Breaker').hash]: {},
					[itemByName('Tranquility').hash]: {},
					[itemByName('Night Terror').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Descend into the Pit of Heresy',
					description: 'Descend into the Harrow and survive it.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'The Harrow',
					description: 'The way is shut by dark powers, and the Hive keep it.',
				},
			},
			{
				displayProperties: {
					name: 'Zulmak, Instrument of Torment',
					directive: 'Purge the tormentor',
					description: 'Slay Zulmak, Instrument of Torment.',
				},
			},
			{
				displayProperties: {
					name: 'Volmar, the Tempted',
					description: 'Defeat Volmar, the Tempted',
				},
				dropTable: {
					[InventoryItemHashes.XenophageMachineGun]: { requiresQuest: InventoryItemHashes.TheJourneyQuestStep_Step4 },
				},
			},
		],
	} satisfies DeepsightDropTableDefinition
}
