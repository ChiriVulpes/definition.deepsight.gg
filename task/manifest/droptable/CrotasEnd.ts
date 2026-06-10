import { ActivityHashes, InventoryItemHashes, MomentHashes, RecordHashes } from '@deepsight.gg/Enums'
import { coalesceItemSet, getMomentCollectionsItemSet } from '../DeepsightCollectionsDefinition'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default async function () {
    const monumentOfTriumphItemSet = await getMomentCollectionsItemSet(MomentHashes.MonumentOfTriumph)
    const seasonOfTheWitchItemSet = await getMomentCollectionsItemSet(MomentHashes.SeasonOfTheWitch)
    const itemByName = coalesceItemSet(monumentOfTriumphItemSet, seasonOfTheWitchItemSet).byName

    return {
        hash: ActivityHashes.CrotasEndNormal,
        displayProperties: {
            icon: { DestinyRecordDefinition: RecordHashes.CrotasEnd2045739672 },
        },
        encounters: [
            {
                traversal: true,
                displayProperties: {
                    name: 'Descend into the Hellmouth',
                    description: 'Find a safe path into the Hellmouth.',
                },
            },
            {

                phaseHash: 2890972472,
                displayProperties: {
                    name: 'The Abyss',
                    directive: 'Traverse the Abyss',
                    description: 'Uncover the illuminated path in the darkness.',
                },
                dropTable: {
                    [itemByName('Song of Ir Yût').hash]: {},
                    [itemByName('Fang of Ir Yût').hash]: {},
                    [itemByName('Abyss Defiant').hash]: {},

                    // hunter
                    [itemByName('Unyielding Casque').hash]: {},
                    [itemByName('Dogged Gage').hash]: {},
                    [itemByName('Relentless Harness').hash]: {},

                    // warlock
                    [itemByName('Deathsinger\'s Gaze').hash]: {},
                    [itemByName('Deathsinger\'s Grip').hash]: {},
                    [itemByName('Deathsinger\'s Mantle').hash]: {},

                    // titan
                    [itemByName('Willbreaker\'s Watch').hash]: {},
                    [itemByName('Willbreaker\'s Fists').hash]: {},
                    [itemByName('Willbreaker\'s Resolve').hash]: {},

                },
            },
            {
                phaseHash: 3768812794,
                displayProperties: {
                    name: 'Oversoul Throne Bridge',
                    directive: 'Cross the Bridge',
                    description: 'Find a way across the chasm.',
                },
                dropTable: {
                    [itemByName('Swordbreaker').hash]: {},
                    [itemByName('Fang of Ir Yût').hash]: {},
                    [itemByName('Oversoul Edict').hash]: {},

                    // hunter
                    [itemByName('Dogged Gage').hash]: {},
                    [itemByName('Relentless Harness').hash]: {},
                    [itemByName('Tireless Striders').hash]: {},

                    // warlock
                    [itemByName('Deathsinger\'s Grip').hash]: {},
                    [itemByName('Deathsinger\'s Mantle').hash]: {},
                    [itemByName('Deathsinger\'s Herald').hash]: {},

                    // titan
                    [itemByName('Willbreaker\'s Fists').hash]: {},
                    [itemByName('Willbreaker\'s Resolve').hash]: {},
                    [itemByName('Willbreaker\'s Greaves').hash]: {},
                },
            },
            {
                phaseHash: 3580589436,
                traversal: true,
                displayProperties: {
                    name: 'Enter Crota\'s Chamber',
                    description: 'Breach the Hive barrier to access Crota\'s Chamber.',
                },
            },
            {
                phaseHash: 1463700798,
                displayProperties: {
                    name: 'Ir Yût, the Deathsinger',
                    directive: 'Reach the Summoning Crystal',
                    description: 'Defeat the Hive Wizard guarding the summoning crystal.',
                },
                dropTable: {
                    [itemByName('Word of Crota').hash]: {},
                    [itemByName('Song of Ir Yût').hash]: {},
                    [itemByName('Oversoul Edict').hash]: {},

                    // hunter
                    [itemByName('Relentless Harness').hash]: {},
                    [itemByName('Tireless Striders').hash]: {},
                    [itemByName('Shroud of Flies').hash]: {},

                    // warlock
                    [itemByName('Deathsinger\'s Mantle').hash]: {},
                    [itemByName('Deathsinger\'s Herald').hash]: {},
                    [itemByName('Bone Circlet').hash]: {},

                    // titan
                    [itemByName('Willbreaker\'s Resolve').hash]: {},
                    [itemByName('Willbreaker\'s Greaves').hash]: {},
                    [itemByName('Mark of the Pit').hash]: {},
                },
            },
            {
                phaseHash: 4240994016,
                displayProperties: {
                    name: 'Crota, Son of Oryx',
                    directive: 'Defeat Crota',
                    description: 'Use Crota\'s most powerful weapon against him.',
                },
                dropTable: {
                    [itemByName('Necrochasm').hash]: { requiresQuest: InventoryItemHashes.BottomlessPitQuestStep_Step2 },
                    [itemByName('Word of Crota').hash]: {},
                    [itemByName('Abyss Defiant').hash]: {},
                    [itemByName('Swordbreaker').hash]: {},

                    // hunter
                    [itemByName('Unyielding Casque').hash]: {},
                    [itemByName('Tireless Striders').hash]: {},
                    [itemByName('Shroud of Flies').hash]: {},

                    // warlock
                    [itemByName('Deathsinger\'s Gaze').hash]: {},
                    [itemByName('Deathsinger\'s Herald').hash]: {},
                    [itemByName('Bone Circlet').hash]: {},

                    // titan
                    [itemByName('Willbreaker\'s Watch').hash]: {},
                    [itemByName('Willbreaker\'s Greaves').hash]: {},
                    [itemByName('Mark of the Pit').hash]: {},
                },
            },
        ],
        master: {
            activityHash: ActivityHashes.CrotasEndMaster,
            dropTable: {
                [itemByName('Song of Ir Yût (Adept)').hash]: {},
                [itemByName('Oversoul Edict (Adept)').hash]: {},
                [itemByName('Word of Crota (Adept)').hash]: {},
                [itemByName('Abyss Defiant (Adept)').hash]: {},
                [itemByName('Fang of Ir Yût (Adept)').hash]: {},
                [itemByName('Swordbreaker (Adept)').hash]: {},
            },
        },
        // bungie broke the crota's end challenges
        // rotations: {
        //     anchor: "2023-10-17T17:00:00Z",
        //     challenges: [
        //         ActivityModifierHashes.ConservationOfEnergy,
        //         ActivityModifierHashes.PrecariousBalance,
        //         ActivityModifierHashes.EqualVessels,
        //         ActivityModifierHashes.AllForOne,
        //     ],
        // },
    } satisfies DeepsightDropTableDefinition
}
