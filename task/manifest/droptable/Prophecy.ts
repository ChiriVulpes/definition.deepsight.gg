import { ActivityHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const motItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const arrivalsItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfArrivals)
	const itemByName = coalesceItemSet(motItemSet, arrivalsItemSet).byName

	return {
		hash: ActivityHashes.Prophecy_ChallengesLength0,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.ProphecyComplete872886548 },
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Seek the Nine',
					description: 'Seek an audience with the Nine.',
				},
			},
			{
				phaseHash: 2400102494,
				displayProperties: {
					name: 'Defeat the Phalanx Echo',
					description: 'Confront the Phalanx Echo, a part of the Nine\'s answer to your question.',
				},
				dropTable: {
					[itemByName('Prosecutor').hash]: {},
					[itemByName('Relentless').hash]: {},
					[itemByName('Crushing Greaves (CODA)').hash]: {},
					[itemByName('Mark Judgment (CODA)').hash]: {},
					[itemByName('Flowing Boots (CODA)').hash]: {},
					[itemByName('Cloak Judgment (CODA)').hash]: {},
					[itemByName('Channeling Treads (CODA)').hash]: {},
					[itemByName('Bond Judgment (CODA)').hash]: {},
				},
			},
			{
				phaseHash: 1692344396,
				traversal: true,
				displayProperties: {
					name: 'Sink',
					description: 'Descend.',
				},
			},
			{
				phaseHash: 382168380,
				traversal: true,
				displayProperties: {
					name: 'Wasteland',
					description: 'Navigate the expanse of the wasteland.',
				},
			},
			{
				phaseHash: 2132736886,
				traversal: true,
				displayProperties: {
					name: 'Escape the Wasteland',
					description: 'Traverse deeper into this realm of the Nine.',
				},
			},
			{
				phaseHash: 3585780724,
				displayProperties: {
					name: 'Escape',
					description: 'Find a way forward.',
				},
				dropTable: {
					[itemByName('Adjudicator').hash]: {},
					[itemByName('A Sudden Death').hash]: {},
					[itemByName('Crushing Guard (CODA)').hash]: {},
					[itemByName('Flowing Grips (CODA)').hash]: {},
					[itemByName('Channeling Wraps (CODA)').hash]: {},
				},
			},
			{
				phaseHash: 3999204422,
				traversal: true,
				displayProperties: {
					name: 'Return to the Wasteland',
					description: 'Cross the wasteland once more.',
				},
			},
			{
				phaseHash: 2229343072,
				traversal: true,
				displayProperties: {
					name: 'Deadsea',
					description: 'Traverse the sea.',
				},
			},
			{
				phaseHash: 2543744318,
				traversal: true,
				displayProperties: {
					name: 'Traverse Deeper',
					description: 'Face the final answer to your question.',
				},
			},
			{
				phaseHash: 3492117941,
				displayProperties: {
					name: 'Defeat the Kell Echo',
					description: 'Confront the Kell Echo, a part of the Nine\'s answer to your question.',
				},
				dropTable: {
					[itemByName('Judgment').hash]: {},
					[itemByName('Darkest Before').hash]: {},
					[itemByName('Crushing Helm (CODA)').hash]: {},
					[itemByName('Crushing Plate (CODA)').hash]: {},
					[itemByName('Mark Judgment (CODA)').hash]: {},
					[itemByName('Moonfang-X7 Helm').hash]: {},
					[itemByName('Moonfang-X7 Gauntlets').hash]: {},
					[itemByName('Moonfang-X7 Chassis').hash]: {},
					[itemByName('Moonfang-X7 Greaves').hash]: {},
					[itemByName('Moonfang-X7 Mark').hash]: {},
					[itemByName('Flowing Cowl (CODA)').hash]: {},
					[itemByName('Flowing Vest (CODA)').hash]: {},
					[itemByName('Cloak Judgment (CODA)').hash]: {},
					[itemByName('Moonfang-X7 Mask').hash]: {},
					[itemByName('Moonfang-X7 Grips').hash]: {},
					[itemByName('Moonfang-X7 Rig').hash]: {},
					[itemByName('Moonfang-X7 Strides').hash]: {},
					[itemByName('Moonfang-X7 Cloak').hash]: {},
					[itemByName('Channeling Cowl (CODA)').hash]: {},
					[itemByName('Channeling Robes (CODA)').hash]: {},
					[itemByName('Bond Judgment (CODA)').hash]: {},
					[itemByName('Moonfang-X7 Crown').hash]: {},
					[itemByName('Moonfang-X7 Gloves').hash]: {},
					[itemByName('Moonfang-X7 Boots').hash]: {},
					[itemByName('Moonfang-X7 Bond').hash]: {},
				},
			},
			{
				phaseHash: 3998734759,
				traversal: true,
				displayProperties: {
					name: 'Receive the Answer',
					description: 'Collect your reward from the Nine.',
				},
			},
		],
	} satisfies DeepsightDropTableDefinition
}
