import { ActivityHashes, ActivityModifierHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const motItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const finalShapeItemSet = await getMomentCollectionsItemSet(MomentHashes.TheFinalShape)
	const itemByName = coalesceItemSet(motItemSet, finalShapeItemSet).byName

	return {
		hash: ActivityHashes.SalvationsEdgeStandard_ChallengesLength1,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.SalvationsEdge_RewardItemsLength1 },
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Approach Finality',
					description: 'Discover a way into the monolith to stop the Witness.',
				},
			},
			{
				phaseHash: 2761002327,
				displayProperties: {
					name: 'Substratum',
					directive: 'Gain Access to the Monolith',
					description: 'Operate the inscrutable machinery to enter the monolith\'s core.',
				},
				dropTable: {
					[itemByName('Nullify').hash]: {},
					[itemByName('Non-Denouement').hash]: {},
					[itemByName('Imminence').hash]: {},

					// hunter
					[itemByName('Promised Reign Grips').hash]: {},
					[itemByName('Promised Reign Vest').hash]: {},

					// warlock
					[itemByName('Promised Victory Wraps').hash]: {},
					[itemByName('Promised Victory Robes').hash]: {},

					// titan
					[itemByName('Promised Reunion Gauntlets').hash]: {},
					[itemByName('Promised Reunion Plate').hash]: {},

				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Enter the Monolith\'s Core',
					description: 'Find a way to ascend the monolith.',
				},
			},
			{
				phaseHash: 193978048,
				displayProperties: {
					name: 'Dissipation',
					directive: 'Defeat the Herald',
					description: 'Remove the Herald of Finality from your path.',
				},
				dropTable: {
					[itemByName('Summum Bonum').hash]: {},
					[itemByName('Non-Denouement').hash]: {},
					[itemByName('Forthcoming Deviance').hash]: {},
					[itemByName('Imminence').hash]: {},

					// hunter
					[itemByName('Promised Reign Mask').hash]: {},
					[itemByName('Promised Reign Cloak').hash]: {},

					// warlock
					[itemByName('Promised Victory Hood').hash]: {},
					[itemByName('Promised Victory Bond').hash]: {},

					// titan
					[itemByName('Promised Reunion Helm').hash]: {},
					[itemByName('Promised Reunion Mark').hash]: {},

				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Ascend the Monolith',
					description: 'Progress up the monolith and stop the Witness.',
				},
			},
			{
				phaseHash: 1727550020,
				displayProperties: {
					name: 'Repository',
					directive: 'Carve A Path',
					description: 'Gain access to the Witness.',
				},
				dropTable: {
					[itemByName('Nullify').hash]: {},
					[itemByName('Critical Anomaly').hash]: {},
					[itemByName('Forthcoming Deviance').hash]: {},

					// hunter
					[itemByName('Promised Reign Grips').hash]: {},

					// warlock
					[itemByName('Promised Victory Wraps').hash]: {},

					// titan
					[itemByName('Promised Reunion Gauntlets').hash]: {},

				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Ascend the Monolith',
					description: 'Continue to ascend the monolith.',
				},
			},
			{
				phaseHash: 637313410,
				displayProperties: {
					name: 'Verity',
					directive: 'See Beyond',
					description: 'Find a path to ascension.',
				},
				dropTable: {
					[itemByName('Summum Bonum').hash]: {},
					[itemByName('Non-Denouement').hash]: {},
					[itemByName('Imminence').hash]: {},

					// hunter
					[itemByName('Promised Reign Strides').hash]: {},

					// warlock
					[itemByName('Promised Victory Boots').hash]: {},

					// titan
					[itemByName('Promised Reunion Greaves').hash]: {},

				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Make Your Final Ascent',
					description: 'Climb to the summit and confront the Witness.',
				},
			},
			{
				phaseHash: 4077323831,
				displayProperties: {
					name: 'Zenith',
					directive: 'Stop the Final Shape',
					description: 'Free the Traveler\'s Light and thwart the Witness\'s plans.',
				},
				dropTable: {
					[itemByName('Euphony').hash]: {},
					[itemByName('Summum Bonum').hash]: {},
					[itemByName('Nullify').hash]: {},
					[itemByName('Critical Anomaly').hash]: {},

					// hunter
					[itemByName('Promised Reign Mask').hash]: {},
					[itemByName('Promised Reign Strides').hash]: {},

					// warlock
					[itemByName('Promised Victory Hood').hash]: {},
					[itemByName('Promised Victory Boots').hash]: {},

					// titan
					[itemByName('Promised Reunion Helm').hash]: {},
					[itemByName('Promised Reunion Greaves').hash]: {},

				},
			},
		],
		rotations: {
			anchor: '2024-06-25T17:00:00Z',
			challenges: [
				ActivityModifierHashes.ScenicRouteChallenge,
				ActivityModifierHashes.AtCapacityChallenge,
				ActivityModifierHashes.BalancedDietChallenge,
				ActivityModifierHashes.VariedGeometryChallenge,
				ActivityModifierHashes.CoordinatedEffortsChallenge,
			],
		},
		master: {
			activityHash: ActivityHashes.SalvationsEdgeMaster,
			dropTable: {
				[itemByName('Imminence (Adept)').hash]: {},
				[itemByName('Forthcoming Deviance (Adept)').hash]: {},
				[itemByName('Non-Denouement (Adept)').hash]: {},
				[itemByName('Nullify (Adept)').hash]: {},
				[itemByName('Critical Anomaly (Adept)').hash]: {},
				[itemByName('Summum Bonum (Adept)').hash]: {},
			},
		},
	} satisfies DeepsightDropTableDefinition
}
