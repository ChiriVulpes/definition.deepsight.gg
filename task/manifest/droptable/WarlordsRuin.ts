import { ActivityHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const seasonOfTheWishItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheWish)
	const itemByName = coalesceItemSet(monumentOfTriumphItemSet, seasonOfTheWishItemSet).byName

	return {
		hash: ActivityHashes.WarlordsRuinStandard,
		displayProperties: {
			icon: './image/png/activity/warlords.png',
		},
		dropTable: {
			[itemByName('Indebted Kindness').hash]: {},
			[itemByName('Dark Age Grips').hash]: {},
			[itemByName('Dark Age Gloves').hash]: {},
			[itemByName('Dark Age Gauntlets').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'The Climb',
					description: 'You\'ve arrived at the end of a trail of Dark Ether. Press forward, climb the ridgeline path, and discover what remains hidden in stormy peaks.',
				},
			},
			{
				phaseHash: 2065920306,
				displayProperties: {
					name: 'Mysterious Challenger',
					description: 'A corrupted Knight stands between you and answers. Meet their challenge, leave them broken, but beware latent curses.',
				},
				dropTable: {
					[itemByName('Vengeful Whisper').hash]: {},
					[itemByName('Dragoncult Sickle').hash]: {},

					// hunter
					[itemByName('Dark Age Mask').hash]: {},
					[itemByName('Dark Age Strides').hash]: {},

					// warlock
					[itemByName('Dark Age Visor').hash]: {},
					[itemByName('Dark Age Legbraces').hash]: {},

					// titan
					[itemByName('Dark Age Helm').hash]: {},
					[itemByName('Dark Age Sabatons').hash]: {},
				},
			},
			{
				phaseHash: 3236820808,
				traversal: true,
				displayProperties: {
					name: 'Imprisoned!',
					description: 'A dying wish has imprisoned you within a ruined cell. Use your wits, and find a method of escape.',
				},
			},
			{
				phaseHash: 3446399378,
				traversal: true,
				displayProperties: {
					name: 'Venture Deeper',
					description: 'The Scorn are numerous, but a whisper still calls from deeper within the castle. Press on, across the ramparts, O vengeance mine.',
				},
			},
			{
				phaseHash: 3561038507,
				traversal: true,
				displayProperties: {
					name: 'Buried Ruins',
					description: 'Navigate the ruined undercroft of the castle, and mind your footing.',
				},
			},
			{
				phaseHash: 2152475930,
				traversal: true,
				displayProperties: {
					name: 'Outward',
					description: 'Find a path outside; search for and uncover a long-defunct entrance to the main castle grounds.',
				},
			},
			{
				phaseHash: 1306680929,
				displayProperties: {
					name: 'Wailing Tempest',
					description: 'Wish for warmth, brave the frigid winds, and silence the Locus of Wailing Grief that sustains them.',
				},
				dropTable: {
					[itemByName('Naeem\'s Lance').hash]: {},
					[itemByName('Vengeful Whisper').hash]: {},

					// hunter
					[itemByName('Dark Age Harness').hash]: {},
					[itemByName('Dark Age Cloak').hash]: {},

					// warlock
					[itemByName('Dark Age Overcoat').hash]: {},
					[itemByName('Dark Age Bond').hash]: {},

					// titan
					[itemByName('Dark Age Chestrig').hash]: {},
					[itemByName('Dark Age Mark').hash]: {},
				},
			},
			{
				phaseHash: 1531676752,
				traversal: true,
				displayProperties: {
					name: 'Follow the Whispers',
					description: 'The whispers grow stronger. Their grief quelled, their vengeance almost sated. All that remains is to end the source of this corruption.',
				},
			},
			{
				phaseHash: 3742397155,
				traversal: true,
				displayProperties: {
					name: 'Vengeful Peak',
					description: 'Discover the source of the Scorn, the whispers, and cleanse the Keep of corruption.',
				},
			},
			{
				phaseHash: 2741345805,
				displayProperties: {
					name: 'Quell the Corruption',
					description: '"You have taken my vengeance. My task is done, Naeem\'s wish fulfilled. Come then, slay me. Let it end." —Hefnd',
				},
				dropTable: {
					[itemByName('Naeem\'s Lance').hash]: {},
					[itemByName('Dragoncult Sickle').hash]: {},
					[itemByName('Buried Bloodline').hash]: {},

					// hunter
					[itemByName('Dark Age Mask').hash]: {},
					[itemByName('Dark Age Harness').hash]: {},
					[itemByName('Dark Age Strides').hash]: {},
					[itemByName('Dark Age Cloak').hash]: {},

					// warlock
					[itemByName('Dark Age Visor').hash]: {},
					[itemByName('Dark Age Overcoat').hash]: {},
					[itemByName('Dark Age Legbraces').hash]: {},
					[itemByName('Dark Age Bond').hash]: {},

					// titan
					[itemByName('Dark Age Helm').hash]: {},
					[itemByName('Dark Age Chestrig').hash]: {},
					[itemByName('Dark Age Sabatons').hash]: {},
					[itemByName('Dark Age Mark').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.WarlordsRuinMaster,
		},
	} satisfies DeepsightDropTableDefinition
}
