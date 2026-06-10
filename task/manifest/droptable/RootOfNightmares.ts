import { ActivityHashes, ActivityModifierHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
    const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
    const lightfallItemSet = await getMomentCollectionsItemSet(MomentHashes.Lightfall)
    const itemByName = coalesceItemSet(monumentOfTriumphItemSet, lightfallItemSet).byName

    return {
        hash: ActivityHashes.RootOfNightmaresStandard,
        displayProperties: {
            icon: { DestinyRecordDefinition: RecordHashes.RootOfNightmares_RewardItemsLength1 },
        },
        encounters: [
            {
                phaseHash: 1326836846, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Find Nezarec',
                    description: 'Locate Nezarec\'s body in its encasement.',
                },
            },
            {
                phaseHash: 3172054256,
                displayProperties: {
                    name: 'Cataclysm',
                    directive: 'Survive the Onslaught',
                    description: 'Fight for control and stay alive.',
                },
                dropTable: {
                    [itemByName('Briar\'s Contempt').hash]: {},
                    [itemByName('Koraxis\'s Distress').hash]: {},
                    [itemByName('Nessa\'s Oblation').hash]: {},

                    // hunter
                    [itemByName('Mask of Trepidation').hash]: {},
                    [itemByName('Grips of Trepidation').hash]: {},
                    [itemByName('Vest of Trepidation').hash]: {},

                    // warlock
                    [itemByName('Mask of Detestation').hash]: {},
                    [itemByName('Wraps of Detestation').hash]: {},
                    [itemByName('Robes of Detestation').hash]: {},

                    // titan
                    [itemByName('Helm of Agony').hash]: {},
                    [itemByName('Gauntlets of Agony').hash]: {},
                    [itemByName('Plate of Agony').hash]: {},
                },
            },
            {
                phaseHash: 3920032267, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Enter the Root',
                    description: 'Continue exploring the Pyramid.',
                },
            },
            {
                phaseHash: 1848647602, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Enter the Root',
                    description: 'Reach the entrance of the root.',
                },
            },
            {
                phaseHash: 2224793617,
                displayProperties: {
                    name: 'Scission',
                    directive: 'Charge the Root',
                    description: 'Overcharge the root to fuel Nezarec\'s return.',
                },
                dropTable: {

                    [itemByName('Mykel\'s Reverence').hash]: {},
                    [itemByName('Koraxis\'s Distress').hash]: {},
                    [itemByName('Nessa\'s Oblation').hash]: {},
                    [itemByName('Acasia\'s Dejection').hash]: {},

                    // hunter
                    [itemByName('Grips of Trepidation').hash]: {},
                    [itemByName('Vest of Trepidation').hash]: {},
                    [itemByName('Boots of Trepidation').hash]: {},

                    // warlock
                    [itemByName('Wraps of Detestation').hash]: {},
                    [itemByName('Robes of Detestation').hash]: {},
                    [itemByName('Boots of Detestation').hash]: {},

                    // titan
                    [itemByName('Gauntlets of Agony').hash]: {},
                    [itemByName('Plate of Agony').hash]: {},
                    [itemByName('Greaves of Agony').hash]: {},
                },
            },
            {
                phaseHash: 2184227225, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Cross the Chasm',
                    description: 'Make your way across the chasm.',
                },
            },
            {
                phaseHash: 2046062211,
                displayProperties: {
                    name: 'Macrocosm',
                    directive: 'Defeat the Explicator',
                    description: 'Confront the Explicator and disrupt his influence.',
                },
                dropTable: {

                    [itemByName('Mykel\'s Reverence').hash]: {},
                    [itemByName('Koraxis\'s Distress').hash]: {},
                    [itemByName('Rufus\'s Fury').hash]: {},
                    [itemByName('Acasia\'s Dejection').hash]: {},

                    // hunter
                    [itemByName('Vest of Trepidation').hash]: {},
                    [itemByName('Boots of Trepidation').hash]: {},
                    [itemByName('Cloak of Trepidation').hash]: {},

                    // warlock
                    [itemByName('Robes of Detestation').hash]: {},
                    [itemByName('Boots of Detestation').hash]: {},
                    [itemByName('Bond of Detestation').hash]: {},

                    // titan
                    [itemByName('Plate of Agony').hash]: {},
                    [itemByName('Greaves of Agony').hash]: {},
                    [itemByName('Mark of Agony').hash]: {},

                },
            },
            {
                phaseHash: 3604501642, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Charge the Root',
                    description: 'Overcharge the root to fuel Nezarec\'s return.',
                },
            },
            {
                phaseHash: 3008487717, // best guess
                traversal: true,
                displayProperties: {
                    name: 'Return to Nezarec',
                    description: 'Locate Nezarec at the place of his newfound power.',
                },
            },
            {
                phaseHash: 2779782231,
                displayProperties: {
                    name: 'Defeat Nezarec',
                    description: 'Lay Nezarec to his final rest.',
                },
                dropTable: {
                    [itemByName('Conditional Finality').hash]: {},
                    [itemByName('Briar\'s Contempt').hash]: {},
                    [itemByName('Mykel\'s Reverence').hash]: {},
                    [itemByName('Koraxis\'s Distress').hash]: {},
                    [itemByName('Rufus\'s Fury').hash]: {},
                    [itemByName('Acasia\'s Dejection').hash]: {},
                    [itemByName('Nessa\'s Oblation').hash]: {},

                    // hunter
                    [itemByName('Mask of Trepidation').hash]: {},
                    [itemByName('Boots of Trepidation').hash]: {},
                    [itemByName('Cloak of Trepidation').hash]: {},

                    // warlock
                    [itemByName('Mask of Detestation').hash]: {},
                    [itemByName('Boots of Detestation').hash]: {},
                    [itemByName('Bond of Detestation').hash]: {},

                    // titan
                    [itemByName('Helm of Agony').hash]: {},
                    [itemByName('Greaves of Agony').hash]: {},
                    [itemByName('Mark of Agony').hash]: {},
                },
            },
        ],
        master: {
            activityHash: ActivityHashes.RootOfNightmaresMaster,
            dropTable: {
                [itemByName('Mykel\'s Reverence (Adept)').hash]: {},
                [itemByName('Acasia\'s Dejection (Adept)').hash]: {},
                [itemByName('Rufus\'s Fury (Adept)').hash]: {},
                [itemByName('Koraxis\'s Distress (Adept)').hash]: {},
                [itemByName('Briar\'s Contempt (Adept)').hash]: {},
                [itemByName('Nessa\'s Oblation (Adept)').hash]: {},
            },
        },
        rotations: {
            anchor: '2023-03-28T17:00:00Z',
            challenges: [
                ActivityModifierHashes.IlluminatedTormentChallenge,
                ActivityModifierHashes.CrossfireChallenge,
                ActivityModifierHashes.CosmicEquilibriumChallenge,
                ActivityModifierHashes.AllHandsChallenge,
            ],
        },
    } satisfies DeepsightDropTableDefinition
}
