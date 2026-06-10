import { ActivityHashes, ActivityModifierHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const intoTheLightItemSet = await getMomentCollectionsItemSet(MomentHashes.IntoTheLight)
	const theWitchQueenItemSet = await getMomentCollectionsItemSet(MomentHashes.TheWitchQueen)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, intoTheLightItemSet, theWitchQueenItemSet).byName

	return {
		hash: ActivityHashes.VowOfTheDiscipleStandard,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.VowOfTheDisciple_RewardItemsLength1 },
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Approach, Children…',
					description: 'Through mud and mire you trudge, seeking that which lies in the bog. Does it drown? Or rise? Perhaps you will decide.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'You Search and Search and Search…',
					description: 'Listen not to those who supply cautions. It is insulting to you, oh children of Light. Let strength be your guide.',
				},
			},
			{
				phaseHash: 580855089,
				displayProperties: {
					name: 'Acquisition',
					directive: 'Truth. Symbolize. Is. Materialize. Everywhere.',
					description: 'Your eyes are always closed. Do you not see what\'s right in front of you? Those who fail to see the truth will drown in it.',
				},
				dropTable: {
					[itemByName('Submission').hash]: {},
					[itemByName('Deliverance').hash]: {},
					[itemByName('Cataclysmic').hash]: {},
					[itemByName('Resonant Fury Helm').hash]: {},
					[itemByName('Resonant Fury Plate').hash]: {},
					[itemByName('Resonant Fury Greaves').hash]: {},
					[itemByName('Resonant Fury Mask').hash]: {},
					[itemByName('Resonant Fury Vest').hash]: {},
					[itemByName('Resonant Fury Strides').hash]: {},
					[itemByName('Resonant Fury Cowl').hash]: {},
					[itemByName('Resonant Fury Robes').hash]: {},
					[itemByName('Resonant Fury Boots').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'You Exhaust Me',
					description: 'Life is but a pointed game, pointing you in pointless directions towards pointless goals.',
				},
			},
			{
				phaseHash: 1942966197,
				displayProperties: {
					name: 'Collection',
					directive: 'Do Not Disrupt the Caretaker',
					description: 'SCORN. They eat away at the decay within a shell of. SCORN. Truth exists all around outside the shell of. SCORN.',
				},
				dropTable: {
					[itemByName('Submission').hash]: {},
					[itemByName('Insidious').hash]: {},
					[itemByName('Cataclysmic').hash]: {},
					[itemByName('Forbearance').hash]: {},
					[itemByName('Resonant Fury Helm').hash]: {},
					[itemByName('Resonant Fury Gauntlets').hash]: {},
					[itemByName('Resonant Fury Mark').hash]: {},
					[itemByName('Resonant Fury Mask').hash]: {},
					[itemByName('Resonant Fury Grips').hash]: {},
					[itemByName('Resonant Fury Cloak').hash]: {},
					[itemByName('Resonant Fury Cowl').hash]: {},
					[itemByName('Resonant Fury Gloves').hash]: {},
					[itemByName('Resonant Fury Bond').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'You Are Directionless…',
					description: 'They say purpose questioned is healthy. Perhaps aimlessness does not plague you. Futility, however…',
				},
			},
			{
				phaseHash: 196663595,
				displayProperties: {
					name: 'Exhibition',
					directive: 'Nothing More than Meaningless Trinkets',
					description: 'Did you think you were the observer? Or did you believe you pulled the strings? Now\'s your chance—with artifacts of fate, you can make them dance.',
				},
				dropTable: {
					[itemByName('Submission').hash]: {},
					[itemByName('Deliverance').hash]: {},
					[itemByName('Resonant Fury Plate').hash]: {},
					[itemByName('Resonant Fury Greaves').hash]: {},
					[itemByName('Resonant Fury Vest').hash]: {},
					[itemByName('Resonant Fury Strides').hash]: {},
					[itemByName('Resonant Fury Robes').hash]: {},
					[itemByName('Resonant Fury Boots').hash]: {},
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Apocalypse is on Your Horizon',
					description: 'The end is near by your own hand, children. Come, sit beside me before you drown.',
				},
			},
			{
				phaseHash: 3840791265,
				displayProperties: {
					name: 'Dominion',
					directive: 'DROWNDROWNDROWN',
					description: 'The Upended is alive. You have no more tasks ahead. Lie down and embrace the darkness beyond your final days.',
				},
				dropTable: {
					[itemByName('Insidious').hash]: {},
					[itemByName('Lubrae\'s Ruin').hash]: {},
					[itemByName('Forbearance').hash]: {},
					[itemByName('Collective Obligation').hash]: {},
					[itemByName('Resonant Fury Helm').hash]: {},
					[itemByName('Resonant Fury Gauntlets').hash]: {},
					[itemByName('Resonant Fury Mark').hash]: {},
					[itemByName('Resonant Fury Mask').hash]: {},
					[itemByName('Resonant Fury Grips').hash]: {},
					[itemByName('Resonant Fury Cloak').hash]: {},
					[itemByName('Resonant Fury Cowl').hash]: {},
					[itemByName('Resonant Fury Gloves').hash]: {},
					[itemByName('Resonant Fury Bond').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.VowOfTheDiscipleMaster_Tier0,
			dropTable: {
				[itemByName('Submission (Adept)').hash]: {},
				[itemByName('Deliverance (Adept)').hash]: {},
				[itemByName('Cataclysmic (Adept)').hash]: {},
				[itemByName('Insidious (Adept)').hash]: {},
				[itemByName('Lubrae\'s Ruin (Adept)').hash]: {},
				[itemByName('Forbearance (Adept)').hash]: {},
			},
		},
		rotations: {
			anchor: '2023-10-03T17:00:00Z',
			challenges: [
				ActivityModifierHashes.SwiftDestruction, // aquisition
				ActivityModifierHashes.BaseInformation, // caretaker
				ActivityModifierHashes.DefensesDown, // exhibition
				ActivityModifierHashes.LoopingCatalyst, // rhulk
			],
		},
	} satisfies DeepsightDropTableDefinition
}
