import { ActivityHashes, ActivityModifierHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
				[InventoryItemHashes.NullifyPulseRifle]: {},
				[InventoryItemHashes.NonDenouementCombatBow]: {},
				[InventoryItemHashes.ImminenceSubmachineGun]: {},

				// hunter
				[InventoryItemHashes.PromisedReignGripsGauntletsPlug2730105984]: {},
				[InventoryItemHashes.PromisedReignVestChestArmorPlug2256359240]: {},

				// warlock
				[InventoryItemHashes.PromisedVictoryWrapsGauntletsPlug4055964141]: {},
				[InventoryItemHashes.PromisedVictoryRobesChestArmorPlug1806218131]: {},

				// titan
				[InventoryItemHashes.PromisedReunionGauntletsGauntletsPlug3629884836]: {},
				[InventoryItemHashes.PromisedReunionPlateChestArmorPlug3725435036]: {},

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
				[InventoryItemHashes.SummumBonumSword]: {},
				[InventoryItemHashes.NonDenouementCombatBow]: {},
				[InventoryItemHashes.ForthcomingDevianceGlaive]: {},
				[InventoryItemHashes.ImminenceSubmachineGun]: {},

				// hunter
				[InventoryItemHashes.PromisedReignMaskHelmetPlug1026610441]: {},
				[InventoryItemHashes.PromisedReignCloakHunterCloakPlug87946917]: {},

				// warlock
				[InventoryItemHashes.PromisedVictoryHoodHelmetPlug930168404]: {},
				[InventoryItemHashes.PromisedVictoryBondWarlockBondPlug141134282]: {},

				// titan
				[InventoryItemHashes.PromisedReunionHelmHelmetPlug659074261]: {},
				[InventoryItemHashes.PromisedReunionMarkTitanMarkPlug1140861969]: {},

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
				[InventoryItemHashes.NullifyPulseRifle]: {},
				[InventoryItemHashes.CriticalAnomalySniperRifle]: {},
				[InventoryItemHashes.ForthcomingDevianceGlaive]: {},

				// hunter
				[InventoryItemHashes.PromisedReignGripsGauntletsPlug2730105984]: {},

				// warlock
				[InventoryItemHashes.PromisedVictoryWrapsGauntletsPlug4055964141]: {},

				// titan
				[InventoryItemHashes.PromisedReunionGauntletsGauntletsPlug3629884836]: {},

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
				[InventoryItemHashes.SummumBonumSword]: {},
				[InventoryItemHashes.NonDenouementCombatBow]: {},
				[InventoryItemHashes.ImminenceSubmachineGun]: {},

				// hunter
				[InventoryItemHashes.PromisedReignStridesLegArmorPlug1807926458]: {},

				// warlock
				[InventoryItemHashes.PromisedVictoryBootsLegArmorPlug7338415]: {},

				// titan
				[InventoryItemHashes.PromisedReunionGreavesLegArmorPlug1265563470]: {},

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
				[InventoryItemHashes.EuphonyLinearFusionRifle]: {},
				[InventoryItemHashes.SummumBonumSword]: {},
				[InventoryItemHashes.NullifyPulseRifle]: {},
				[InventoryItemHashes.CriticalAnomalySniperRifle]: {},

				// hunter
				[InventoryItemHashes.PromisedReignMaskHelmetPlug1026610441]: {},
				[InventoryItemHashes.PromisedReignStridesLegArmorPlug1807926458]: {},

				// warlock
				[InventoryItemHashes.PromisedVictoryHoodHelmetPlug930168404]: {},
				[InventoryItemHashes.PromisedVictoryBootsLegArmorPlug7338415]: {},

				// titan
				[InventoryItemHashes.PromisedReunionHelmHelmetPlug659074261]: {},
				[InventoryItemHashes.PromisedReunionGreavesLegArmorPlug1265563470]: {},

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
			[InventoryItemHashes.ImminenceAdeptSubmachineGun]: {},
			[InventoryItemHashes.ForthcomingDevianceAdeptGlaive]: {},
			[InventoryItemHashes.NonDenouementAdeptCombatBow]: {},
			[InventoryItemHashes.NullifyAdeptPulseRifle]: {},
			[InventoryItemHashes.CriticalAnomalyAdeptSniperRifle]: {},
			[InventoryItemHashes.SummumBonumAdeptSword]: {},
		},
	},
} satisfies DeepsightDropTableDefinition
