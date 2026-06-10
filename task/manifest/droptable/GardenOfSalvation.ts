import { ActivityHashes, InventoryItemHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const episodeRevenantItemSet = await getMomentCollectionsItemSet(MomentHashes.EpisodeRevenant)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, episodeRevenantItemSet).byName

	return {
		hash: ActivityHashes.GardenOfSalvation1042180643,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.GardenOfSalvation },
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Track the Unknown Artifact\'s Signal',
					description: 'Enter the Black Garden to track the Unknown Artifact\'s signal.',
				},
			},
			{
				phaseHash: 2158557525,
				displayProperties: {
					name: 'Evade the Consecrated Mind',
					directive: 'Track the Unknown Artifact\'s Signal',
					description: 'Evade the Consecrated Mind and continue tracking the Unknown Artifact\'s signal.',
				},
				dropTable: {
					[itemByName('Zealot\'s Reward').hash]: {},
					[itemByName('Accrued Redemption').hash]: {},
					[itemByName('Greaves of Ascendancy').hash]: {},
					[itemByName('Strides of Ascendancy').hash]: {},
					[itemByName('Boots of Ascendancy').hash]: {},
				},
			},
			{
				phaseHash: 473429890,
				traversal: true,
				displayProperties: {
					name: 'Track the Unknown Artifact\'s Signal',
					description: 'Make your way through the Undergrowth to continue tracking the Unknown Artifact\'s signal.',
				},
			},
			{
				phaseHash: 3736477924,
				displayProperties: {
					name: 'Summon the Consecrated Mind',
					directive: 'Draw out the Consecrated Mind',
					description: 'Find a way to draw the Consecrated Mind out of hiding.',
				},
				dropTable: {
					[itemByName('Prophet of Doom').hash]: {},
					[itemByName('Reckless Oracle').hash]: {},
					[itemByName('Gauntlets of Exaltation').hash]: {},
					[itemByName('Grips of Exaltation').hash]: {},
					[itemByName('Gloves of Exaltation').hash]: {},
				},
			},
			{
				phaseHash: 328479441,
				traversal: true,
				displayProperties: {
					name: 'Draw Out the Consecrated Mind',
					description: 'Draw out and defeat the Consecrated Mind to continue tracking the Unknown Artifact\'s signal.',
				},
			},
			{
				phaseHash: 1024471091,
				displayProperties: {
					name: 'Consecrated Mind, Sol Inherent',
					directive: 'Subdue the Consecrated Mind',
					description: 'Defeat the Consecrated Mind to continue tracking the Unknown Artifact\'s signal.',
				},
				dropTable: {
					[itemByName('Ancient Gospel').hash]: {},
					[itemByName('Sacred Provenance').hash]: {},
					[itemByName('Plate of Transcendence').hash]: {},
					[itemByName('Vest of Transcendence').hash]: {},
					[itemByName('Robes of Transcendence').hash]: {},
				},
			},
			{
				phaseHash: 2740950389,
				traversal: true,
				displayProperties: {
					name: 'Track the Unknown Artifact\'s Signal',
					description: 'Follow the Unknown Artifact\'s signal up to the Boundless Horizon to discover where it leads.',
				},
			},
			{
				phaseHash: 523815399,
				displayProperties: {
					name: 'Sanctified Mind, Sol Inherent',
					directive: 'Defeat the Sanctified Mind',
					description: 'Defeat the Sanctified Mind to discover the final destination of the Unknown Artifact\'s signal.',
				},
				dropTable: {
					[InventoryItemHashes.DivinityTraceRifle]: { requiresQuest: InventoryItemHashes.DivineFragmentationQuestStep_Step3 },
					[itemByName('Omniscient Eye').hash]: {},
					[itemByName('Helm of Righteousness').hash]: {},
					[itemByName('Temptation\'s Mark').hash]: {},
					[itemByName('Cowl of Righteousness').hash]: {},
					[itemByName('Cloak of Temptation').hash]: {},
					[itemByName('Mask of Righteousness').hash]: {},
					[itemByName('Temptation\'s Bond').hash]: {},
				},
			},
		],
	} satisfies DeepsightDropTableDefinition
}
