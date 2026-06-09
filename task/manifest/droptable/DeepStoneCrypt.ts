import { ActivityHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
                [InventoryItemHashes.TrusteeScoutRifle]: {},

                // hunter
                [InventoryItemHashes.LegacysOathGripsGauntletsPlug2343515647]: {},
                [InventoryItemHashes.LegacysOathStridesLegArmorPlug1264765761]: {},
                [InventoryItemHashes.LegacysOathCloakHunterCloakPlug1021060724]: {},

                // warlock
                [InventoryItemHashes.LegacysOathGlovesGauntletsPlug79460168]: {},
                [InventoryItemHashes.LegacysOathBootsLegArmorPlug756445218]: {},
                [InventoryItemHashes.LegacysOathBondWarlockBondPlug2902277629]: {},

                // titan
                [InventoryItemHashes.LegacysOathGauntletsGauntletsPlug1887490701]: {},
                [InventoryItemHashes.LegacysOathGreavesLegArmorPlug2558289743]: {},
                [InventoryItemHashes.LegacysOathMarkTitanMarkPlug2956588906]: {},
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
                [InventoryItemHashes.SuccessionSniperRifle2990047042]: {},
                [InventoryItemHashes.HeritageShotgun]: {},

                // hunter
                [InventoryItemHashes.LegacysOathGripsGauntletsPlug2343515647]: {},
                [InventoryItemHashes.LegacysOathStridesLegArmorPlug1264765761]: {},
                [InventoryItemHashes.LegacysOathCloakHunterCloakPlug1021060724]: {},

                // warlock
                [InventoryItemHashes.LegacysOathGlovesGauntletsPlug79460168]: {},
                [InventoryItemHashes.LegacysOathBootsLegArmorPlug756445218]: {},
                [InventoryItemHashes.LegacysOathBondWarlockBondPlug2902277629]: {},

                // titan
                [InventoryItemHashes.LegacysOathGauntletsGauntletsPlug1887490701]: {},
                [InventoryItemHashes.LegacysOathGreavesLegArmorPlug2558289743]: {},
                [InventoryItemHashes.LegacysOathMarkTitanMarkPlug2956588906]: {},
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
                [InventoryItemHashes.PosterityHandCannon]: {},

                // hunter
                [InventoryItemHashes.LegacysOathGripsGauntletsPlug2343515647]: {},
                [InventoryItemHashes.LegacysOathVestChestArmorPlug4001862073]: {},
                [InventoryItemHashes.LegacysOathCloakHunterCloakPlug1021060724]: {},

                // warlock
                [InventoryItemHashes.LegacysOathGlovesGauntletsPlug79460168]: {},
                [InventoryItemHashes.LegacysOathRobesChestArmorPlug3975122240]: {},
                [InventoryItemHashes.LegacysOathBondWarlockBondPlug2902277629]: {},

                // titan
                [InventoryItemHashes.LegacysOathGauntletsGauntletsPlug1887490701]: {},
                [InventoryItemHashes.LegacysOathPlateChestArmorPlug751162931]: {},
                [InventoryItemHashes.LegacysOathMarkTitanMarkPlug2956588906]: {},
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
                [InventoryItemHashes.BequestSword]: {},
                [InventoryItemHashes.CommemorationMachineGun]: {},
                [InventoryItemHashes.EyesOfTomorrowRocketLauncher]: {},

                // hunter
                [InventoryItemHashes.LegacysOathMaskHelmetPlug893751566]: {},
                [InventoryItemHashes.LegacysOathVestChestArmorPlug4001862073]: {},
                [InventoryItemHashes.LegacysOathStridesLegArmorPlug1264765761]: {},

                // warlock
                [InventoryItemHashes.LegacysOathCowlHelmetPlug1462908657]: {},
                [InventoryItemHashes.LegacysOathRobesChestArmorPlug3975122240]: {},
                [InventoryItemHashes.LegacysOathBootsLegArmorPlug756445218]: {},

                // titan
                [InventoryItemHashes.LegacysOathHelmHelmetPlug3015085684]: {},
                [InventoryItemHashes.LegacysOathPlateChestArmorPlug751162931]: {},
                [InventoryItemHashes.LegacysOathGreavesLegArmorPlug2558289743]: {},
            },
        },
    ],
} satisfies DeepsightDropTableDefinition
