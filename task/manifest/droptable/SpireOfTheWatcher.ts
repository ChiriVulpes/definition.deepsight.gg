import { ActivityHashes, InventoryItemHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
	hash: ActivityHashes.SpireOfTheWatcherStandard,
	// displayProperties: {
	// 	icon: { DestinyRecordDefinition: RecordHashes.SpireOfTheWatcher2302993504 },
	// },
	dropTable: {
		[InventoryItemHashes.TerminusHorizonMachineGun487205709]: {},
		[InventoryItemHashes.TmCogburnCustomGauntletsGauntletsPlug1480429241]: {},
		[InventoryItemHashes.TmEarpCustomGripsGauntletsPlug918537443]: {},
		[InventoryItemHashes.TmMossCustomGlovesGauntletsPlug1088225118]: {},
	},
	encounters: [
		{
			traversal: true,
			displayProperties: {
				name: 'Temporal Disturbance',
				description: 'A temporal disturbance crackles with Arc energy, the same type of energy that powers the Seraph complex. A savvy Guardian could utilize this.',
			},
		},
		{
			phaseHash: 3852545214,
			traversal: true,
			displayProperties: {
				name: 'Reestablish Power',
				description: 'The complex is locked down from the inside out. Continue routing Arc power from the temporal disturbance to open a path into the Seraph complex.',
			},
		},
		{
			phaseHash: 201188049,
			traversal: true,
			displayProperties: {
				name: 'Begin the Ascent',
				description: 'Venture deeper into the complex and ascend the Spire. Open up a route to the Pillory signal\'s source.',
			},
		},
		{
			phaseHash: 1483068591,
			displayProperties: {
				name: 'Ascend the Spire',
				description: 'Open a route via the grav lift to the Spire peak, where the Pillory signal is being sourced.',
			},
			dropTable: {
				[InventoryItemHashes.LongArmScoutRifle8293111]: {},
				[InventoryItemHashes.SeventhSeraphCarbineAutoRifle4070357005]: {},
				[InventoryItemHashes.TmCogburnCustomCoverHelmetPlug2599025960]: {},
				[InventoryItemHashes.TmCogburnCustomLegguardsLegArmorPlug119121067]: {},
				[InventoryItemHashes.TmEarpCustomHoodHelmetPlug2976233114]: {},
				[InventoryItemHashes.TmEarpCustomChapsLegArmorPlug2839517205]: {},
				[InventoryItemHashes.TmMossCustomHatHelmetPlug2014814167]: {},
				[InventoryItemHashes.TmMossCustomPantsLegArmorPlug1932168248]: {},
			},
		},
		{
			phaseHash: 2027998024,
			traversal: true,
			displayProperties: {
				name: 'Ascend the Spire',
				description: 'Climb the Spire and reach the source of the Pillory signal.',
			},
		},
		{
			phaseHash: 1779644342,
			displayProperties: {
				name: 'Silence the Siren',
				description: 'Destroy Akelous, the Siren\'s Current before it can complete the Pillory protocol and imprison Rasputin\'s subminds.',
			},
			dropTable: {
				[InventoryItemHashes.SeventhSeraphOfficerRevolverHandCannon1555959830]: {},
				[InventoryItemHashes.TmCogburnCustomPlateChestArmorPlug3088058655]: {},
				[InventoryItemHashes.TmCogburnCustomMarkTitanMarkPlug506181038]: {},
				[InventoryItemHashes.TmEarpCustomVestChestArmorPlug597199405]: {},
				[InventoryItemHashes.TmEarpCustomCloakedStetsonHunterCloakPlug3006077984]: {},
				[InventoryItemHashes.TmMossCustomDusterChestArmorPlug3185363346]: {},
				[InventoryItemHashes.TmMossCustomBondWarlockBondPlug3780604323]: {},
			},
		},
		{
			phaseHash: 3603277873,
			traversal: true,
			displayProperties: {
				name: 'Descend',
				description: 'The Sol Divisive have initiated a reactor meltdown! Descend through the Spire server stack and find a way to stop it.',
			},
		},
		{
			phaseHash: 3934781543,
			traversal: true,
			displayProperties: {
				name: 'Pillory Stack Containment',
				description: 'The meltdown is triggering lockdowns in the Spire\'s Pillory server stack. Initiate an override with Arc linkages to negate the lockdowns.',
			},
		},
		{
			phaseHash: 2676434388,
			displayProperties: {
				name: 'Prompt Critical',
				description: 'Destroy Persys, Primordial Ruin and prevent the complex\'s reactor core meltdown from causing irreparable damage.',
			},
			dropTable: {
				[InventoryItemHashes.LongArmScoutRifle8293111]: {},
				[InventoryItemHashes.SeventhSeraphCarbineAutoRifle4070357005]: {},
				[InventoryItemHashes.SeventhSeraphOfficerRevolverHandCannon1555959830]: {},
				[InventoryItemHashes.LiminalVigilSidearm3138208275]: {},
				[InventoryItemHashes.WilderflightGrenadeLauncher2306182339]: {},
				[InventoryItemHashes.HierarchyOfNeedsCombatBow]: {},
				[InventoryItemHashes.TmCogburnCustomCoverHelmetPlug2599025960]: {},
				[InventoryItemHashes.TmCogburnCustomPlateChestArmorPlug3088058655]: {},
				[InventoryItemHashes.TmCogburnCustomLegguardsLegArmorPlug119121067]: {},
				[InventoryItemHashes.TmCogburnCustomMarkTitanMarkPlug506181038]: {},
				[InventoryItemHashes.TmEarpCustomHoodHelmetPlug2976233114]: {},
				[InventoryItemHashes.TmEarpCustomVestChestArmorPlug597199405]: {},
				[InventoryItemHashes.TmEarpCustomChapsLegArmorPlug2839517205]: {},
				[InventoryItemHashes.TmEarpCustomCloakedStetsonHunterCloakPlug3006077984]: {},
				[InventoryItemHashes.TmMossCustomHatHelmetPlug2014814167]: {},
				[InventoryItemHashes.TmMossCustomDusterChestArmorPlug3185363346]: {},
				[InventoryItemHashes.TmMossCustomPantsLegArmorPlug1932168248]: {},
				[InventoryItemHashes.TmMossCustomBondWarlockBondPlug3780604323]: {},
			},
		},
	],
	master: {
		activityHash: ActivityHashes.SpireOfTheWatcherMaster_Tier0,
	},
} satisfies DeepsightDropTableDefinition
