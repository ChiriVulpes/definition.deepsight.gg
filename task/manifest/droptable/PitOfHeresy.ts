import { ActivityHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
	hash: ActivityHashes.PitOfHeresyStandard,
	displayProperties: {
		icon: { DestinyRecordDefinition: RecordHashes.AMysteriousDisturbance },
	},
	dropTable: {
		[InventoryItemHashes.DreambaneHelmHelmetPlug2813078109]: {},
		[InventoryItemHashes.DreambaneGauntletsGauntletsPlug1699964364]: {},
		[InventoryItemHashes.DreambanePlateChestArmorPlug175015316]: {},
		[InventoryItemHashes.DreambaneGreavesLegArmorPlug2345799798]: {},
		[InventoryItemHashes.DreambaneMarkTitanMarkPlug1343302889]: {},

		[InventoryItemHashes.DreambaneCowlHelmetPlug1496857121]: {},
		[InventoryItemHashes.DreambaneGripsGauntletsPlug2293199928]: {},
		[InventoryItemHashes.DreambaneVestChestArmorPlug3434445392]: {},
		[InventoryItemHashes.DreambaneStridesLegArmorPlug328467570]: {},
		[InventoryItemHashes.DreambaneCloakHunterCloakPlug2786161293]: {},

		[InventoryItemHashes.DreambaneHoodHelmetPlug1721938300]: {},
		[InventoryItemHashes.DreambaneGlovesGauntletsPlug3118392309]: {},
		[InventoryItemHashes.DreambaneRobesChestArmorPlug4235863403]: {},
		[InventoryItemHashes.DreambaneBootsLegArmorPlug399547095]: {},
		[InventoryItemHashes.DreambaneBondWarlockBondPlug2975563522]: {},
	},
	encounters: [
		{
			traversal: true,
			displayProperties: {
				name: 'Descend into the Pit of Heresy',
				description: 'Delve below the Scarlet Keep and into the Pit of Heresy.',
			},
		},
		{
			displayProperties: {
				name: 'Necropolis',
				description: 'Turn the blades of the enemy against them.',
			},
			dropTable: {
				[InventoryItemHashes.ApostateSniperRifle2164448701]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
				[InventoryItemHashes.BlasphemerShotgun2782847179]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
				[InventoryItemHashes.HereticRocketLauncher3067821200]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },

				[InventoryItemHashes.EveryWakingMomentSubmachineGun4277547616]: {},
				[InventoryItemHashes.LoveAndDeathGrenadeLauncher3690523502]: {},
				[InventoryItemHashes.AFineMemorialMachineGun3325778512]: {},
				[InventoryItemHashes.OneSmallStepShotgun1016668089]: {},
				[InventoryItemHashes.PremonitionPulseRifle208088207]: {},
				[InventoryItemHashes.LoudLullabyHandCannon3924212056]: {},
				[InventoryItemHashes.ArcLogicAutoRifle2723909519]: {},
				[InventoryItemHashes.DreamBreakerFusionRifle2931957300]: {},
				[InventoryItemHashes.TranquilitySniperRifle1645386487]: {},
				[InventoryItemHashes.NightTerrorSword3870811754]: {},
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Descend into the Pit of Heresy',
				description: 'Head toward the Tunnels of Despair.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Tunnels of Despair',
				description: 'Find a way through the Tunnels of Despair.',
			},
		},
		{
			displayProperties: {
				name: 'Chamber of Suffering',
				description: 'Endure the Chamber of Suffering.',
			},
			dropTable: {
				[InventoryItemHashes.ApostateSniperRifle2164448701]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
				[InventoryItemHashes.BlasphemerShotgun2782847179]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },
				[InventoryItemHashes.HereticRocketLauncher3067821200]: { requiresItems: [InventoryItemHashes.HymnOfDesecrationConsumable] },

				[InventoryItemHashes.EveryWakingMomentSubmachineGun4277547616]: {},
				[InventoryItemHashes.LoveAndDeathGrenadeLauncher3690523502]: {},
				[InventoryItemHashes.AFineMemorialMachineGun3325778512]: {},
				[InventoryItemHashes.OneSmallStepShotgun1016668089]: {},
				[InventoryItemHashes.PremonitionPulseRifle208088207]: {},
				[InventoryItemHashes.LoudLullabyHandCannon3924212056]: {},
				[InventoryItemHashes.ArcLogicAutoRifle2723909519]: {},
				[InventoryItemHashes.DreamBreakerFusionRifle2931957300]: {},
				[InventoryItemHashes.TranquilitySniperRifle1645386487]: {},
				[InventoryItemHashes.NightTerrorSword3870811754]: {},
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Descend into the Pit of Heresy',
				description: 'Descend into the Harrow and survive it.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'The Harrow',
				description: 'The way is shut by dark powers, and the Hive keep it.',
			},
		},
		{
			displayProperties: {
				name: 'Zulmak, Instrument of Torment',
				directive: 'Purge the tormentor',
				description: 'Slay Zulmak, Instrument of Torment.',
			},
		},
		{
			displayProperties: {
				name: 'Volmar, the Tempted',
				description: 'Defeat Volmar, the Tempted',
			},
			dropTable: {
				[InventoryItemHashes.XenophageMachineGun]: { requiresQuest: InventoryItemHashes.TheJourneyQuestStep_Step4 },
			},
		},
	],
} satisfies DeepsightDropTableDefinition
