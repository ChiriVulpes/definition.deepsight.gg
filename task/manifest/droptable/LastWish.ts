import { ActivityHashes, InventoryItemHashes, MilestoneHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const motItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const deepItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheDeep)
	const forsakenItemSet = await getMomentCollectionsItemSet(MomentHashes.Forsaken)
	const itemByName = coalesceItemSet(motItemSet, deepItemSet, forsakenItemSet).byName

	return {
		hash: ActivityHashes.LastWishNormal,
		rotationActivityHash: ActivityHashes.LastWishStandard,
		displayProperties: {
			icon: { DestinyMilestoneDefinition: MilestoneHashes.LastWish },
		},
		dropTable: {
			[itemByName('Chattering Bone').hash]: {},
			[itemByName('The Supremacy').hash]: {},
			[itemByName('Transfiguration').hash]: {},
			[itemByName('Age-Old Bond').hash]: {},
			[itemByName('Nation of Beasts').hash]: {},
			[itemByName('Techeun Force').hash]: {},
			[itemByName('Tyranny of Heaven').hash]: {},
			[itemByName('Apex Predator').hash]: {},

			[itemByName('Helm of the Great Hunt').hash]: {},
			[itemByName('Gauntlets of the Great Hunt').hash]: {},
			[itemByName('Plate of the Great Hunt').hash]: {},
			[itemByName('Greaves of the Great Hunt').hash]: {},
			[itemByName('Mark of the Great Hunt').hash]: {},

			[itemByName('Mask of the Great Hunt').hash]: {},
			[itemByName('Grips of the Great Hunt').hash]: {},
			[itemByName('Vest of the Great Hunt').hash]: {},
			[itemByName('Strides of the Great Hunt').hash]: {},
			[itemByName('Cloak of the Great Hunt').hash]: {},

			[itemByName('Hood of the Great Hunt').hash]: {},
			[itemByName('Gloves of the Great Hunt').hash]: {},
			[itemByName('Robes of the Great Hunt').hash]: {},
			[itemByName('Boots of the Great Hunt').hash]: {},
			[itemByName('Bond of the Great Hunt').hash]: {},
		},
		encounters: [
			{
				traversal: true,
				displayProperties: {
					name: 'Enter the Dreaming City',
					description: 'Access the Dreaming City and begin your pursuit of Riven, the last known Ahamkara.',
				},
			},
			{
				traversal: true,
				displayProperties: {
					name: 'Find Riven',
					description: 'Head higher into the Dreaming City and pursue Riven.',
				},
			},
			{
				phaseHash: 1126840038,
				displayProperties: {
					name: 'Kalli, the Corrupted',
					directive: 'Defeat Kalli',
					description: 'Defeat the corrupted Kalli to free her from Taken influence.',
				},
			},
			{
				phaseHash: 3370459802,
				traversal: true,
				displayProperties: {
					name: 'Find Riven',
					description: 'Head higher into the Dreaming City and pursue Riven.',
				},
			},
			{
				phaseHash: 1040714588,
				displayProperties: {
					name: 'Shuro Chi, the Corrupted',
					directive: 'Defeat Shuro Chi',
					description: 'Defeat the corrupted Shuro Chi to free her from Taken influence.',
				},
			},
			{
				phaseHash: 1349075536,
				traversal: true,
				displayProperties: {
					name: 'Find Riven',
					description: 'Head higher into the Dreaming City and pursue Riven.',
				},
			},
			{
				phaseHash: 4249034918,
				displayProperties: {
					name: 'Morgeth, the Spirekeeper',
					directive: 'Defeat Morgeth, the Spirekeeper',
					description: 'Defeat Morgeth.',
				},
			},
			{
				phaseHash: 2169047898,
				traversal: true,
				displayProperties: {
					name: 'Find Riven',
					description: 'Head higher into the Dreaming City and pursue Riven.',
				},
			},
			{
				phaseHash: 436847112,
				displayProperties: {
					name: 'The Vault',
					directive: 'Unlock the Way Forward',
					description: 'Find a way to open the door barring your path.',
				},
			},
			{
				phaseHash: 2879343438,
				traversal: true,
				displayProperties: {
					name: 'Find Riven',
					description: 'Head higher into the Dreaming City and pursue Riven.',
				},
			},
			{
				phaseHash: 2392610624,
				displayProperties: {
					name: 'Riven of a Thousand Voices',
					directive: 'Slay Riven',
					description: 'Destroy Riven, the last known Ahamkara.',
				},
				dropTable: {
					[InventoryItemHashes.EtherealKeyMaterialDummy]: {},
				},
			},
			{
				phaseHash: 378163510,
				displayProperties: {
					name: 'Queenswalk',
					directive: 'Take the Stone to the Techeun',
					description: 'Escape the spire and get the Heart Stone to the Techeun.',
				},
				dropTable: {
					[itemByName('One Thousand Voices').hash]: { requiresItems: [InventoryItemHashes.EtherealKeyMaterialDummy] },
				},
			},
			// no idea why there's another directive, can't find this in videos
			{
				traversal: true,
				displayProperties: {
					name: 'Queenswalk',
					directive: 'Deliver the Heart of Wishes',
					description: 'Take the Heart of Wishes to the Techeun.',
				},
			},
		],
	} satisfies DeepsightDropTableDefinition
}
