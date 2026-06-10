import { ActivityHashes, MomentHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
	const motItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
	const seraphItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheSeraph)
	const itemByName = coalesceItemSet(motItemSet, seraphItemSet).byName

	return {
		hash: ActivityHashes.SpireOfTheWatcherStandard,
		// displayProperties: {
		// 	icon: { DestinyRecordDefinition: RecordHashes.SpireOfTheWatcher2302993504 },
		// },
		dropTable: {
			[itemByName('Terminus Horizon').hash]: {},
			[itemByName('TM-Cogburn Custom Gauntlets').hash]: {},
			[itemByName('TM-Earp Custom Grips').hash]: {},
			[itemByName('TM-Moss Custom Gloves').hash]: {},
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
					[itemByName('Long Arm').hash]: {},
					[itemByName('Seventh Seraph Carbine').hash]: {},
					[itemByName('TM-Cogburn Custom Cover').hash]: {},
					[itemByName('TM-Cogburn Custom Legguards').hash]: {},
					[itemByName('TM-Earp Custom Hood').hash]: {},
					[itemByName('TM-Earp Custom Chaps').hash]: {},
					[itemByName('TM-Moss Custom Hat').hash]: {},
					[itemByName('TM-Moss Custom Pants').hash]: {},
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
					[itemByName('Seventh Seraph Officer Revolver').hash]: {},
					[itemByName('TM-Cogburn Custom Plate').hash]: {},
					[itemByName('TM-Cogburn Custom Mark').hash]: {},
					[itemByName('TM-Earp Custom Vest').hash]: {},
					[itemByName('TM-Earp Custom Cloaked Stetson').hash]: {},
					[itemByName('TM-Moss Custom Duster').hash]: {},
					[itemByName('TM-Moss Custom Bond').hash]: {},
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
					[itemByName('Long Arm').hash]: {},
					[itemByName('Seventh Seraph Carbine').hash]: {},
					[itemByName('Seventh Seraph Officer Revolver').hash]: {},
					[itemByName('Liminal Vigil').hash]: {},
					[itemByName('Wilderflight').hash]: {},
					[itemByName('Hierarchy of Needs').hash]: {},
					[itemByName('TM-Cogburn Custom Cover').hash]: {},
					[itemByName('TM-Cogburn Custom Plate').hash]: {},
					[itemByName('TM-Cogburn Custom Legguards').hash]: {},
					[itemByName('TM-Cogburn Custom Mark').hash]: {},
					[itemByName('TM-Earp Custom Hood').hash]: {},
					[itemByName('TM-Earp Custom Vest').hash]: {},
					[itemByName('TM-Earp Custom Chaps').hash]: {},
					[itemByName('TM-Earp Custom Cloaked Stetson').hash]: {},
					[itemByName('TM-Moss Custom Hat').hash]: {},
					[itemByName('TM-Moss Custom Duster').hash]: {},
					[itemByName('TM-Moss Custom Pants').hash]: {},
					[itemByName('TM-Moss Custom Bond').hash]: {},
				},
			},
		],
		master: {
			activityHash: ActivityHashes.SpireOfTheWatcherMaster_Tier0,
		},
	} satisfies DeepsightDropTableDefinition
}
