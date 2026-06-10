import { ActivityHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
    const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
    const intoTheLightItemSet = await getMomentCollectionsItemSet(MomentHashes.IntoTheLight)
    const beyondLightItemSet = await getMomentCollectionsItemSet(MomentHashes.BeyondLight)
    const itemByName = coalesceItemSet(monumentOfTriumphItemSet, intoTheLightItemSet, beyondLightItemSet).byName

    return {
        hash: ActivityHashes.DeepStoneCrypt_GuidedGameUndefined,
        displayProperties: {
            icon: { DestinyRecordDefinition: RecordHashes.RaidDeepStoneCrypt_RecordTypeNameTriumphs },
        },
        encounters: [
            {
                traversal: true,
                displayProperties: {
                    name: 'Locate the Deep Stone Crypt',
                    description: 'Survive the cold while locating the Deep Stone Crypt.',
                },
            },
            {
                phaseHash: 2776463390,
                displayProperties: {
                    name: 'Crypt Security',
                    directive: 'Disable Crypt Security',
                    description: 'Destroy the Crypt\'s power system to disable security.',
                },
                dropTable: {
                    [itemByName('Trustee').hash]: {},

                    // hunter
                    [itemByName('Legacy\'s Oath Grips').hash]: {},
                    [itemByName('Legacy\'s Oath Strides').hash]: {},
                    [itemByName('Legacy\'s Oath Cloak').hash]: {},

                    // warlock
                    [itemByName('Legacy\'s Oath Gloves').hash]: {},
                    [itemByName('Legacy\'s Oath Boots').hash]: {},
                    [itemByName('Legacy\'s Oath Bond').hash]: {},

                    // titan
                    [itemByName('Legacy\'s Oath Gauntlets').hash]: {},
                    [itemByName('Legacy\'s Oath Greaves').hash]: {},
                    [itemByName('Legacy\'s Oath Mark').hash]: {},
                },
            },
            {
                phaseHash: 3847348336,
                traversal: true,
                displayProperties: {
                    name: 'Locate Eramis\'s Followers',
                    description: 'Push deeper into the Crypt and locate Eramis\'s followers.',
                },
            },
            {
                phaseHash: 416127450,
                displayProperties: {
                    name: 'Atraks-1',
                    directive: 'Defeat Atraks-1',
                    description: 'Take down the Fallen Exo Atraks-1.',
                },
                dropTable: {
                    [itemByName('Succession').hash]: {},
                    [itemByName('Heritage').hash]: {},

                    // hunter
                    [itemByName('Legacy\'s Oath Grips').hash]: {},
                    [itemByName('Legacy\'s Oath Strides').hash]: {},
                    [itemByName('Legacy\'s Oath Cloak').hash]: {},

                    // warlock
                    [itemByName('Legacy\'s Oath Gloves').hash]: {},
                    [itemByName('Legacy\'s Oath Boots').hash]: {},
                    [itemByName('Legacy\'s Oath Bond').hash]: {},

                    // titan
                    [itemByName('Legacy\'s Oath Gauntlets').hash]: {},
                    [itemByName('Legacy\'s Oath Greaves').hash]: {},
                    [itemByName('Legacy\'s Oath Mark').hash]: {},
                },
            },
            {
                phaseHash: 1370965191,
                traversal: true,
                displayProperties: {
                    name: 'Locate the Nuclear Contingency Chamber',
                    description: 'Reach the nuclear contingency chamber.',
                },
            },
            {
                phaseHash: 1858926029,
                displayProperties: {
                    name: 'Descent',
                    directive: 'Prevent Europa\'s Destruction',
                    description: 'Disarm the Nuclear Descent Protocol.',
                },
                dropTable: {
                    [itemByName('Posterity').hash]: {},

                    // hunter
                    [itemByName('Legacy\'s Oath Grips').hash]: {},
                    [itemByName('Legacy\'s Oath Vest').hash]: {},
                    [itemByName('Legacy\'s Oath Cloak').hash]: {},

                    // warlock
                    [itemByName('Legacy\'s Oath Gloves').hash]: {},
                    [itemByName('Legacy\'s Oath Robes').hash]: {},
                    [itemByName('Legacy\'s Oath Bond').hash]: {},

                    // titan
                    [itemByName('Legacy\'s Oath Gauntlets').hash]: {},
                    [itemByName('Legacy\'s Oath Plate').hash]: {},
                    [itemByName('Legacy\'s Oath Mark').hash]: {},
                },
            },
            {
                traversal: true,
                phaseHash: 1594577984,
                displayProperties: {
                    name: 'Emerge from the Wreckage',
                    description: 'Make your way out of the wreckage of the Morning Star.',
                },
            },
            {
                phaseHash: 4035296150,
                displayProperties: {
                    name: 'Taniks, the Abomination',
                    directive: 'Defeat Taniks, the Abomination',
                    description: 'Defeat Taniks for good.',
                },
                dropTable: {
                    [itemByName('Bequest').hash]: {},
                    [itemByName('Commemoration').hash]: {},
                    [itemByName('Eyes of Tomorrow').hash]: {},

                    // hunter
                    [itemByName('Legacy\'s Oath Mask').hash]: {},
                    [itemByName('Legacy\'s Oath Vest').hash]: {},
                    [itemByName('Legacy\'s Oath Strides').hash]: {},

                    // warlock
                    [itemByName('Legacy\'s Oath Cowl').hash]: {},
                    [itemByName('Legacy\'s Oath Robes').hash]: {},
                    [itemByName('Legacy\'s Oath Boots').hash]: {},

                    // titan
                    [itemByName('Legacy\'s Oath Helm').hash]: {},
                    [itemByName('Legacy\'s Oath Plate').hash]: {},
                    [itemByName('Legacy\'s Oath Greaves').hash]: {},
                },
            },
        ],
    } satisfies DeepsightDropTableDefinition
}
