import { ActivityHashes, ActivityModifierHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
				[InventoryItemHashes.DoomOfChelchisScoutRifle]: {},
				[InventoryItemHashes.QullimsTerminusMachineGun]: {},
				[InventoryItemHashes.WarNumensChestChestArmorPlug1066132704]: {},
				[InventoryItemHashes.WarNumensBootsLegArmorPlug4039112898]: {},
				[InventoryItemHashes.WarNumensMarkTitanMarkPlug376168733]: {},
				[InventoryItemHashes.DarkhollowChitonChestArmorPlug169689932]: {},
				[InventoryItemHashes.DarkhollowTreadsLegArmorPlug2725249086]: {},
				[InventoryItemHashes.DarkhollowMantleHunterCloakPlug2868448385]: {},
				[InventoryItemHashes.ChasmOfYulChestArmorPlug3921733799]: {},
				[InventoryItemHashes.PathOfXolLegArmorPlug3229616835]: {},
				[InventoryItemHashes.BondOfTheWormloreWarlockBondPlug766618550]: {},
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
				[InventoryItemHashes.SmiteOfMerainPulseRifle]: {},
				[InventoryItemHashes.DefianceOfYasminSniperRifle]: {},
				[InventoryItemHashes.WarNumensFistGauntletsPlug2937773672]: {},
				[InventoryItemHashes.WarNumensChestChestArmorPlug1066132704]: {},
				[InventoryItemHashes.DarkhollowGraspsGauntletsPlug2437510452]: {},
				[InventoryItemHashes.DarkhollowChitonChestArmorPlug169689932]: {},
				[InventoryItemHashes.GraspOfEirGauntletsPlug3398467185]: {},
				[InventoryItemHashes.ChasmOfYulChestArmorPlug3921733799]: {},
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
				[InventoryItemHashes.QullimsTerminusMachineGun]: {},
				[InventoryItemHashes.MidhasReckoningFusionRifle]: {},
				[InventoryItemHashes.ZaoulisBaneHandCannon431721920]: {},
				[InventoryItemHashes.WarNumensCrownHelmetPlug26254737]: {},
				[InventoryItemHashes.WarNumensBootsLegArmorPlug4039112898]: {},
				[InventoryItemHashes.DarkhollowMaskHelmetPlug1656833637]: {},
				[InventoryItemHashes.DarkhollowTreadsLegArmorPlug2725249086]: {},
				[InventoryItemHashes.MouthOfUrHelmetPlug1537426592]: {},
				[InventoryItemHashes.PathOfXolLegArmorPlug3229616835]: {},
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
				[InventoryItemHashes.SmiteOfMerainPulseRifle]: {},
				[InventoryItemHashes.DefianceOfYasminSniperRifle]: {},
				[InventoryItemHashes.ZaoulisBaneHandCannon431721920]: {},
				[InventoryItemHashes.WarNumensFistGauntletsPlug2937773672]: {},
				[InventoryItemHashes.WarNumensChestChestArmorPlug1066132704]: {},
				[InventoryItemHashes.DarkhollowGraspsGauntletsPlug2437510452]: {},
				[InventoryItemHashes.DarkhollowChitonChestArmorPlug169689932]: {},
				[InventoryItemHashes.GraspOfEirGauntletsPlug3398467185]: {},
				[InventoryItemHashes.ChasmOfYulChestArmorPlug3921733799]: {},
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
				[InventoryItemHashes.QullimsTerminusMachineGun]: {},
				[InventoryItemHashes.MidhasReckoningFusionRifle]: {},
				[InventoryItemHashes.DoomOfChelchisScoutRifle]: {},
				[InventoryItemHashes.SmiteOfMerainPulseRifle]: {},
				[InventoryItemHashes.DefianceOfYasminSniperRifle]: {},
				[InventoryItemHashes.ZaoulisBaneHandCannon431721920]: {},
				[InventoryItemHashes.TouchOfMaliceScoutRifle]: {},

				[InventoryItemHashes.WarNumensCrownHelmetPlug26254737]: {},
				[InventoryItemHashes.WarNumensFistGauntletsPlug2937773672]: {},
				[InventoryItemHashes.DarkhollowMaskHelmetPlug1656833637]: {},
				[InventoryItemHashes.DarkhollowGraspsGauntletsPlug2437510452]: {},
				[InventoryItemHashes.MouthOfUrHelmetPlug1537426592]: {},
				[InventoryItemHashes.GraspOfEirGauntletsPlug3398467185]: {},
			},
		},
	],
	master: {
		activityHash: ActivityHashes.KingsFallMaster_TraitHashesArray$2515873973$3594746639$597957208$299829906,
		dropTable: {
			[InventoryItemHashes.QullimsTerminusHarrowedMachineGun]: {},
			[InventoryItemHashes.DoomOfChelchisHarrowedScoutRifle]: {},
			[InventoryItemHashes.ZaoulisBaneHarrowedHandCannon]: {},
			[InventoryItemHashes.MidhasReckoningHarrowedFusionRifle]: {},
			[InventoryItemHashes.SmiteOfMerainHarrowedPulseRifle]: {},
			[InventoryItemHashes.DefianceOfYasminHarrowedSniperRifle]: {},
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
