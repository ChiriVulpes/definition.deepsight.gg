import { ActivityHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
                [InventoryItemHashes.SongOfIrYutMachineGun]: {},
                [InventoryItemHashes.FangOfIrYutScoutRifle]: {},
                [InventoryItemHashes.AbyssDefiantAutoRifle]: {},

                // hunter
                [InventoryItemHashes.UnyieldingCasqueHelmetPlug859929450]: {},
                [InventoryItemHashes.DoggedGageGauntletsPlug441033139]: {},
                [InventoryItemHashes.RelentlessHarnessChestArmorPlug3714937821]: {},

                // warlock
                [InventoryItemHashes.DeathsingersGazeHelmetPlug1964816829]: {},
                [InventoryItemHashes.DeathsingersGripGauntletsPlug427348780]: {},
                [InventoryItemHashes.DeathsingersMantleChestArmorPlug1386180724]: {},

                // titan
                [InventoryItemHashes.WillbreakersWatchHelmetPlug1328334240]: {},
                [InventoryItemHashes.WillbreakersFistsGauntletsPlug3189374833]: {},
                [InventoryItemHashes.WillbreakersResolveChestArmorPlug1261894567]: {},

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
                [InventoryItemHashes.SwordbreakerShotgun]: {},
                [InventoryItemHashes.FangOfIrYutScoutRifle]: {},
                [InventoryItemHashes.OversoulEdictPulseRifle]: {},

                // hunter
                [InventoryItemHashes.DoggedGageGauntletsPlug441033139]: {},
                [InventoryItemHashes.RelentlessHarnessChestArmorPlug3714937821]: {},
                [InventoryItemHashes.TirelessStridersLegArmorPlug175883909]: {},

                // warlock
                [InventoryItemHashes.DeathsingersGripGauntletsPlug427348780]: {},
                [InventoryItemHashes.DeathsingersMantleChestArmorPlug1386180724]: {},
                [InventoryItemHashes.DeathsingersHeraldLegArmorPlug1497538390]: {},

                // titan
                [InventoryItemHashes.WillbreakersFistsGauntletsPlug3189374833]: {},
                [InventoryItemHashes.WillbreakersResolveChestArmorPlug1261894567]: {},
                [InventoryItemHashes.WillbreakersGreavesLegArmorPlug3020524483]: {},
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
                [InventoryItemHashes.WordOfCrotaHandCannon]: {},
                [InventoryItemHashes.SongOfIrYutMachineGun]: {},
                [InventoryItemHashes.OversoulEdictPulseRifle]: {},

                // hunter
                [InventoryItemHashes.RelentlessHarnessChestArmorPlug3714937821]: {},
                [InventoryItemHashes.TirelessStridersLegArmorPlug175883909]: {},
                [InventoryItemHashes.ShroudOfFliesHunterCloakPlug1306415888]: {},

                // warlock
                [InventoryItemHashes.DeathsingersMantleChestArmorPlug1386180724]: {},
                [InventoryItemHashes.DeathsingersHeraldLegArmorPlug1497538390]: {},
                [InventoryItemHashes.BoneCircletWarlockBondPlug2130010697]: {},

                // titan
                [InventoryItemHashes.WillbreakersResolveChestArmorPlug1261894567]: {},
                [InventoryItemHashes.WillbreakersGreavesLegArmorPlug3020524483]: {},
                [InventoryItemHashes.MarkOfThePitTitanMarkPlug2401746614]: {},
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
                [InventoryItemHashes.NecrochasmAutoRifle]: { requiresQuest: InventoryItemHashes.BottomlessPitQuestStep_Step2 },
                [InventoryItemHashes.WordOfCrotaHandCannon]: {},
                [InventoryItemHashes.AbyssDefiantAutoRifle]: {},
                [InventoryItemHashes.SwordbreakerShotgun]: {},

                // hunter
                [InventoryItemHashes.UnyieldingCasqueHelmetPlug859929450]: {},
                [InventoryItemHashes.TirelessStridersLegArmorPlug175883909]: {},
                [InventoryItemHashes.ShroudOfFliesHunterCloakPlug1306415888]: {},

                // warlock
                [InventoryItemHashes.DeathsingersGazeHelmetPlug1964816829]: {},
                [InventoryItemHashes.DeathsingersHeraldLegArmorPlug1497538390]: {},
                [InventoryItemHashes.BoneCircletWarlockBondPlug2130010697]: {},

                // titan
                [InventoryItemHashes.WillbreakersWatchHelmetPlug1328334240]: {},
                [InventoryItemHashes.WillbreakersGreavesLegArmorPlug3020524483]: {},
                [InventoryItemHashes.MarkOfThePitTitanMarkPlug2401746614]: {},
            },
        },
    ],
    master: {
        activityHash: ActivityHashes.CrotasEndMaster,
        dropTable: {
            [InventoryItemHashes.SongOfIrYutAdeptMachineGun]: {},
            [InventoryItemHashes.OversoulEdictAdeptPulseRifle]: {},
            [InventoryItemHashes.WordOfCrotaAdeptHandCannon]: {},
            [InventoryItemHashes.AbyssDefiantAdeptAutoRifle]: {},
            [InventoryItemHashes.FangOfIrYutAdeptScoutRifle]: {},
            [InventoryItemHashes.SwordbreakerAdeptShotgun]: {},
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
