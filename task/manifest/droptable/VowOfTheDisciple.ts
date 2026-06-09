import { ActivityHashes, ActivityModifierHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
				[InventoryItemHashes.SubmissionSubmachineGun]: {},
				[InventoryItemHashes.DeliveranceFusionRifle]: {},
				[InventoryItemHashes.CataclysmicLinearFusionRifle]: {},
				[InventoryItemHashes.ResonantFuryHelmHelmetPlug362541459]: {},
				[InventoryItemHashes.ResonantFuryPlateChestArmorPlug1627640710]: {},
				[InventoryItemHashes.ResonantFuryGreavesLegArmorPlug365727964]: {},
				[InventoryItemHashes.ResonantFuryMaskHelmetPlug1649346047]: {},
				[InventoryItemHashes.ResonantFuryVestChestArmorPlug3487540074]: {},
				[InventoryItemHashes.ResonantFuryStridesLegArmorPlug1566699968]: {},
				[InventoryItemHashes.ResonantFuryCowlHelmetPlug2316722050]: {},
				[InventoryItemHashes.ResonantFuryRobesChestArmorPlug3300312357]: {},
				[InventoryItemHashes.ResonantFuryBootsLegArmorPlug2748020989]: {},
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
				[InventoryItemHashes.SubmissionSubmachineGun]: {},
				[InventoryItemHashes.InsidiousPulseRifle]: {},
				[InventoryItemHashes.CataclysmicLinearFusionRifle]: {},
				[InventoryItemHashes.ForbearanceGrenadeLauncher613334176]: {},
				[InventoryItemHashes.ResonantFuryHelmHelmetPlug362541459]: {},
				[InventoryItemHashes.ResonantFuryGauntletsGauntletsPlug2150515362]: {},
				[InventoryItemHashes.ResonantFuryMarkTitanMarkPlug2370089583]: {},
				[InventoryItemHashes.ResonantFuryMaskHelmetPlug1649346047]: {},
				[InventoryItemHashes.ResonantFuryGripsGauntletsPlug1583213254]: {},
				[InventoryItemHashes.ResonantFuryCloakHunterCloakPlug4124357755]: {},
				[InventoryItemHashes.ResonantFuryCowlHelmetPlug2316722050]: {},
				[InventoryItemHashes.ResonantFuryGlovesGauntletsPlug1656263403]: {},
				[InventoryItemHashes.ResonantFuryBondWarlockBondPlug2422261368]: {},
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
				[InventoryItemHashes.SubmissionSubmachineGun]: {},
				[InventoryItemHashes.DeliveranceFusionRifle]: {},
				[InventoryItemHashes.ResonantFuryPlateChestArmorPlug1627640710]: {},
				[InventoryItemHashes.ResonantFuryGreavesLegArmorPlug365727964]: {},
				[InventoryItemHashes.ResonantFuryVestChestArmorPlug3487540074]: {},
				[InventoryItemHashes.ResonantFuryStridesLegArmorPlug1566699968]: {},
				[InventoryItemHashes.ResonantFuryRobesChestArmorPlug3300312357]: {},
				[InventoryItemHashes.ResonantFuryBootsLegArmorPlug2748020989]: {},
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
				[InventoryItemHashes.InsidiousPulseRifle]: {},
				[InventoryItemHashes.LubraesRuinGlaive]: {},
				[InventoryItemHashes.ForbearanceGrenadeLauncher613334176]: {},
				[InventoryItemHashes.CollectiveObligationPulseRifle]: {},
				[InventoryItemHashes.ResonantFuryHelmHelmetPlug362541459]: {},
				[InventoryItemHashes.ResonantFuryGauntletsGauntletsPlug2150515362]: {},
				[InventoryItemHashes.ResonantFuryMarkTitanMarkPlug2370089583]: {},
				[InventoryItemHashes.ResonantFuryMaskHelmetPlug1649346047]: {},
				[InventoryItemHashes.ResonantFuryGripsGauntletsPlug1583213254]: {},
				[InventoryItemHashes.ResonantFuryCloakHunterCloakPlug4124357755]: {},
				[InventoryItemHashes.ResonantFuryCowlHelmetPlug2316722050]: {},
				[InventoryItemHashes.ResonantFuryGlovesGauntletsPlug1656263403]: {},
				[InventoryItemHashes.ResonantFuryBondWarlockBondPlug2422261368]: {},
			},
		},
	],
	master: {
		activityHash: ActivityHashes.VowOfTheDiscipleMaster_Tier0,
		dropTable: {
			[InventoryItemHashes.SubmissionAdeptSubmachineGun]: {},
			[InventoryItemHashes.DeliveranceAdeptFusionRifle]: {},
			[InventoryItemHashes.CataclysmicAdeptLinearFusionRifle]: {},
			[InventoryItemHashes.InsidiousAdeptPulseRifle]: {},
			[InventoryItemHashes.LubraesRuinAdeptGlaive]: {},
			[InventoryItemHashes.ForbearanceAdeptGrenadeLauncher]: {},
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
