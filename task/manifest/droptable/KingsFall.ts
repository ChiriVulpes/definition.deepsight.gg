import { ActivityHashes, ActivityModifierHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const seasonOfPlunderItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfPlunder)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, seasonOfPlunderItemSet).byName

	return {
		hash: ActivityHashes.KingsFallStandard,
		displayProperties: {
			icon: { DestinyRecordDefinition: RecordHashes.KingsFall3047702042 },
		},
		encounters: [
			{
				phaseHash: 829896467,
				traversal: true,
				displayProperties: {
					name: 'Open the Portal',
					description: 'Gain access to the Dreadnaught\'s inner sanctum.',
				},
			},
			{
				phaseHash: 3831927225,
				traversal: true,
				displayProperties: {
					name: 'Cross the Expanse',
					description: 'Continue traversing the Dreadnaught.',
				},
			},
			{
				phaseHash: 1406613360,
				displayProperties: {
					name: 'Basilica',
					directive: 'Power the Glyph',
					description: 'Power the Hive glyph to lower the barrier and gain deeper access to the Dreadnaught.',
				},
				dropTable: {
					[itemByName('Doom of Chelchis').hash]: {},
					[itemByName('Qullim\'s Terminus').hash]: {},
					[itemByName('War Numen\'s Chest').hash]: {},
					[itemByName('War Numen\'s Boots').hash]: {},
					[itemByName('War Numen\'s Mark').hash]: {},
					[itemByName('Darkhollow Chiton').hash]: {},
					[itemByName('Darkhollow Treads').hash]: {},
					[itemByName('Darkhollow Mantle').hash]: {},
					[itemByName('Chasm of Yul').hash]: {},
					[itemByName('Path of Xol').hash]: {},
					[itemByName('Bond of the Wormlore').hash]: {},
				},
			},
			{
				phaseHash: 2115142089,
				displayProperties: {
					name: 'Warpriest',
					directive: 'Defeat the Warpriest',
					description: 'Defeat Oryx\'s Warpriest before he destroys you.',
				},
				dropTable: {
					[itemByName('Smite of Merain').hash]: {},
					[itemByName('Defiance of Yasmin').hash]: {},
					[itemByName('War Numen\'s Fist').hash]: {},
					[itemByName('War Numen\'s Chest').hash]: {},
					[itemByName('Darkhollow Grasps').hash]: {},
					[itemByName('Darkhollow Chiton').hash]: {},
					[itemByName('Grasp of Eir').hash]: {},
					[itemByName('Chasm of Yul').hash]: {},
				},
			},
			{
				phaseHash: 3983340187,
				traversal: true,
				displayProperties: {
					name: 'Traverse the Catacombs',
					description: 'Find a way out of the Dreadnaught tunnels.',
				},
			},
			{
				phaseHash: 3738629258,
				displayProperties: {
					name: 'Golgoroth',
					directive: 'Defeat Golgoroth',
					description: 'Neutralize the Ogre to advance deeper into the Dreadnaught.',
				},
				dropTable: {
					[itemByName('Qullim\'s Terminus').hash]: {},
					[itemByName('Midha\'s Reckoning').hash]: {},
					[itemByName('Zaouli\'s Bane').hash]: {},
					[itemByName('War Numen\'s Crown').hash]: {},
					[itemByName('War Numen\'s Boots').hash]: {},
					[itemByName('Darkhollow Mask').hash]: {},
					[itemByName('Darkhollow Treads').hash]: {},
					[itemByName('Mouth of Ur').hash]: {},
					[itemByName('Path of Xol').hash]: {},
				},
			},
			{
				phaseHash: 3897367839,
				traversal: true,
				displayProperties: {
					name: 'Traverse the Edge',
					description: 'Find Oryx, the Taken King.',
				},
			},
			{
				phaseHash: 2951654489,
				displayProperties: {
					name: 'The Daughters',
					directive: 'Defeat the Daughters of Oryx',
					description: 'Oryx\'s daughters are his last line of defense. Silence them.',
				},
				dropTable: {
					[itemByName('Smite of Merain').hash]: {},
					[itemByName('Defiance of Yasmin').hash]: {},
					[itemByName('Zaouli\'s Bane').hash]: {},
					[itemByName('War Numen\'s Fist').hash]: {},
					[itemByName('War Numen\'s Chest').hash]: {},
					[itemByName('Darkhollow Grasps').hash]: {},
					[itemByName('Darkhollow Chiton').hash]: {},
					[itemByName('Grasp of Eir').hash]: {},
					[itemByName('Chasm of Yul').hash]: {},
				},
			},
			{
				phaseHash: 1089000747,
				displayProperties: {
					name: 'Oryx',
					directive: 'Defeat Oryx, the Taken King',
					description: 'Defeat Oryx to end his threat to the solar system, and to you.',
				},
				dropTable: {
					[itemByName('Qullim\'s Terminus').hash]: {},
					[itemByName('Midha\'s Reckoning').hash]: {},
					[itemByName('Doom of Chelchis').hash]: {},
					[itemByName('Smite of Merain').hash]: {},
					[itemByName('Defiance of Yasmin').hash]: {},
					[itemByName('Zaouli\'s Bane').hash]: {},
					[itemByName('Touch of Malice').hash]: {},

					[itemByName('War Numen\'s Crown').hash]: {},
					[itemByName('War Numen\'s Fist').hash]: {},
					[itemByName('Darkhollow Mask').hash]: {},
					[itemByName('Darkhollow Grasps').hash]: {},
					[itemByName('Mouth of Ur').hash]: {},
					[itemByName('Grasp of Eir').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.KingsFallMaster_TraitHashesArray$2515873973$3594746639$597957208$299829906,
			dropTable: {
				[itemByName('Qullim\'s Terminus (Harrowed)').hash]: {},
				[itemByName('Doom of Chelchis (Harrowed)').hash]: {},
				[itemByName('Zaouli\'s Bane (Harrowed)').hash]: {},
				[itemByName('Midha\'s Reckoning (Harrowed)').hash]: {},
				[itemByName('Smite of Merain (Harrowed)').hash]: {},
				[itemByName('Defiance of Yasmin (Harrowed)').hash]: {},
			},
		},
		rotations: {
			anchor: '2023-10-10T17:00:00Z',
			challenges: [
				ActivityModifierHashes.TheGrassIsAlwaysGreener, // basilica
				ActivityModifierHashes.DeviousThievery, // warpriest
				ActivityModifierHashes.GazeAmaze, // golgoroth
				ActivityModifierHashes.UnderConstruction, // daughters
				ActivityModifierHashes.HandsOff, // oryx
			],
		},
	} satisfies DeepsightDropTableDefinition
}
