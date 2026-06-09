import { ActivityHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
	hash: ActivityHashes.GraspOfAvariceStandard,
	displayProperties: {
		icon: { DestinyRecordDefinition: RecordHashes.FatefulSpin },
	},
	dropTable: {
		[InventoryItemHashes.Matador64Shotgun2563012876]: {},
		[InventoryItemHashes.HeroOfAgesSword2139640995]: {},
	},
	encounters: [
		{
			traversal: true,
			displayProperties: {
				name: 'Investigate the Loot Cave',
				description: 'Explore the Loot Cave in search of Wilhelm-7\'s lost fireteam.',
			},
		},
		{
			phaseHash: 588023047,
			traversal: true,
			displayProperties: {
				name: 'Tempt the Icon of Excess',
				description: 'Claim Cursed Engrams from combatants and tempt the Icon of Excess.',
			},
		},
		{
			traversal: true,
			displayProperties: {
				name: 'Explore the Caves and Facility',
				description: 'Push deeper through the caves and the ruined facility.',
			},
		},
		{
			phaseHash: 3362674177,
			traversal: true,
			displayProperties: {
				name: 'Navigate the Facility',
				description: 'Navigate through the ruins of the facility.',
			},
		},
		{
			phaseHash: 2867024332,
			displayProperties: {
				name: 'Phry\'zhia, The Insatiable',
				directive: 'Defeat Phry\'zhia, The Insatiable',
				description: 'Turn the cycle of greed against your enemies.',
			},
			dropTable: {
				[InventoryItemHashes.DescendingEchoGreavesLegArmorPlug4287863773]: {},
				[InventoryItemHashes.DescendingEchoMarkTitanMarkPlug3500810712]: {},
				[InventoryItemHashes.TwistingEchoStridesLegArmorPlug337875583]: {},
				[InventoryItemHashes.TwistingEchoCloakHunterCloakPlug2486733914]: {},
				[InventoryItemHashes.CorruptingEchoBootsLegArmorPlug2231150714]: {},
				[InventoryItemHashes.CorruptingEchoBondWarlockBondPlug4217390949]: {},
			},
		},
		{
			phaseHash: 1049410082,
			traversal: true,
			displayProperties: {
				name: 'Continue Through the Ruined Facility',
				description: 'Follow Wilhelm-7\'s path deeper through the wreckage.',
			},
		},
		{
			phaseHash: 2989884184,
			traversal: true,
			displayProperties: {
				name: 'Disarm the Mines',
				description: 'Reach the mines and disarm them before time runs out.',
			},
		},
		{
			phaseHash: 497054074,
			traversal: true,
			displayProperties: {
				name: 'Navigate the Caves',
				description: 'Explore the caves to find the source of the Fallen.',
			},
		},
		{
			phaseHash: 4063391552,
			displayProperties: {
				name: 'Fallen Shield',
				directive: 'Destroy the Shield',
				description: 'Fire Servitor remains at the Fallen shield.',
			},
			dropTable: {
				[InventoryItemHashes.DescendingEchoGauntletsGauntletsPlug2771648715]: {},
				[InventoryItemHashes.DescendingEchoCageChestArmorPlug549825413]: {},
				[InventoryItemHashes.TwistingEchoGripsGauntletsPlug2308793821]: {},
				[InventoryItemHashes.TwistingEchoVestChestArmorPlug3587911011]: {},
				[InventoryItemHashes.CorruptingEchoGlovesGauntletsPlug3536211008]: {},
				[InventoryItemHashes.CorruptingEchoRobesChestArmorPlug2515293448]: {},
			},
		},
		{
			phaseHash: 163634132,
			traversal: true,
			displayProperties: {
				name: 'Reach the Great Sphere',
				description: 'Find a way to enter the Great Sphere.',
			},
		},
		{
			phaseHash: 4056788414,
			displayProperties: {
				name: 'Captain Avarokk the Covetous',
				directive: 'Defeat Avarokk the Covetous',
				description: 'Turn the cycle of greed against Captain Avarokk the Covetous.',
			},
			dropTable: {
				[InventoryItemHashes.GjallarhornRocketLauncher]: { requiresQuest: InventoryItemHashes.AndOutFlyTheWolvesQuestStep_Step02729195975 },
				[InventoryItemHashes.EyaslunaHandCannon235827225]: {},
				[InventoryItemHashes['1000YardStareSniperRifle4164201232']]: {},

				[InventoryItemHashes.DescendingEchoHelmHelmetPlug3473581026]: {},
				[InventoryItemHashes.DescendingEchoGauntletsGauntletsPlug2771648715]: {},
				[InventoryItemHashes.DescendingEchoGreavesLegArmorPlug4287863773]: {},
				[InventoryItemHashes.DescendingEchoMarkTitanMarkPlug3500810712]: {},

				[InventoryItemHashes.TwistingEchoMaskHelmetPlug2744480004]: {},
				[InventoryItemHashes.TwistingEchoGripsGauntletsPlug2308793821]: {},
				[InventoryItemHashes.TwistingEchoStridesLegArmorPlug337875583]: {},
				[InventoryItemHashes.TwistingEchoCloakHunterCloakPlug2486733914]: {},

				[InventoryItemHashes.CorruptingEchoCoverHelmetPlug1832715465]: {},
				[InventoryItemHashes.CorruptingEchoGlovesGauntletsPlug3536211008]: {},
				[InventoryItemHashes.CorruptingEchoBootsLegArmorPlug2231150714]: {},
				[InventoryItemHashes.CorruptingEchoBondWarlockBondPlug4217390949]: {},
			},
		},
	],
	master: {
		activityHash: ActivityHashes.GraspOfAvariceMaster_Tier0,
	},
} satisfies DeepsightDropTableDefinition
