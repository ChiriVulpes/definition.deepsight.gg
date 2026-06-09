import { ActivityHashes, ActivityModifierHashes, InventoryItemHashes, RecordHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition } from './DeepsightDropTableDefinition'

export default {
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
                [InventoryItemHashes.BriarsContemptLinearFusionRifle]: {},
                [InventoryItemHashes.KoraxissDistressGrenadeLauncher]: {},
                [InventoryItemHashes.NessasOblationShotgun]: {},

                // hunter
                [InventoryItemHashes.MaskOfTrepidationHelmetPlug3810243376]: {},
                [InventoryItemHashes.GripsOfTrepidationGauntletsPlug3608027009]: {},
                [InventoryItemHashes.VestOfTrepidationChestArmorPlug2787963735]: {},

                // warlock
                [InventoryItemHashes.MaskOfDetestationHelmetPlug4123705451]: {},
                [InventoryItemHashes.WrapsOfDetestationGauntletsPlug2445962586]: {},
                [InventoryItemHashes.RobesOfDetestationChestArmorPlug2597227950]: {},

                // titan
                [InventoryItemHashes.HelmOfAgonyHelmetPlug3475635982]: {},
                [InventoryItemHashes.GauntletsOfAgonyGauntletsPlug630432767]: {},
                [InventoryItemHashes.PlateOfAgonyChestArmorPlug824228793]: {},
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

                [InventoryItemHashes.MykelsReverenceSidearm]: {},
                [InventoryItemHashes.KoraxissDistressGrenadeLauncher]: {},
                [InventoryItemHashes.NessasOblationShotgun]: {},
                [InventoryItemHashes.AcasiasDejectionTraceRifle]: {},

                // hunter
                [InventoryItemHashes.GripsOfTrepidationGauntletsPlug3608027009]: {},
                [InventoryItemHashes.VestOfTrepidationChestArmorPlug2787963735]: {},
                [InventoryItemHashes.BootsOfTrepidationLegArmorPlug807905267]: {},

                // warlock
                [InventoryItemHashes.WrapsOfDetestationGauntletsPlug2445962586]: {},
                [InventoryItemHashes.RobesOfDetestationChestArmorPlug2597227950]: {},
                [InventoryItemHashes.BootsOfDetestationLegArmorPlug3702434452]: {},

                // titan
                [InventoryItemHashes.GauntletsOfAgonyGauntletsPlug630432767]: {},
                [InventoryItemHashes.PlateOfAgonyChestArmorPlug824228793]: {},
                [InventoryItemHashes.GreavesOfAgonyLegArmorPlug3846650177]: {},
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

                [InventoryItemHashes.MykelsReverenceSidearm]: {},
                [InventoryItemHashes.KoraxissDistressGrenadeLauncher]: {},
                [InventoryItemHashes.RufussFuryAutoRifle]: {},
                [InventoryItemHashes.AcasiasDejectionTraceRifle]: {},

                // hunter
                [InventoryItemHashes.VestOfTrepidationChestArmorPlug2787963735]: {},
                [InventoryItemHashes.BootsOfTrepidationLegArmorPlug807905267]: {},
                [InventoryItemHashes.CloakOfTrepidationHunterCloakPlug621315878]: {},

                // warlock
                [InventoryItemHashes.RobesOfDetestationChestArmorPlug2597227950]: {},
                [InventoryItemHashes.BootsOfDetestationLegArmorPlug3702434452]: {},
                [InventoryItemHashes.BondOfDetestationWarlockBondPlug2915322487]: {},

                // titan
                [InventoryItemHashes.PlateOfAgonyChestArmorPlug824228793]: {},
                [InventoryItemHashes.GreavesOfAgonyLegArmorPlug3846650177]: {},
                [InventoryItemHashes.MarkOfAgonyTitanMarkPlug2138394740]: {},

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
                [InventoryItemHashes.ConditionalFinalityShotgun]: {},
                [InventoryItemHashes.BriarsContemptLinearFusionRifle]: {},
                [InventoryItemHashes.MykelsReverenceSidearm]: {},
                [InventoryItemHashes.KoraxissDistressGrenadeLauncher]: {},
                [InventoryItemHashes.RufussFuryAutoRifle]: {},
                [InventoryItemHashes.AcasiasDejectionTraceRifle]: {},
                [InventoryItemHashes.NessasOblationShotgun]: {},

                // hunter
                [InventoryItemHashes.MaskOfTrepidationHelmetPlug3810243376]: {},
                [InventoryItemHashes.BootsOfTrepidationLegArmorPlug807905267]: {},
                [InventoryItemHashes.CloakOfTrepidationHunterCloakPlug621315878]: {},

                // warlock
                [InventoryItemHashes.MaskOfDetestationHelmetPlug4123705451]: {},
                [InventoryItemHashes.BootsOfDetestationLegArmorPlug3702434452]: {},
                [InventoryItemHashes.BondOfDetestationWarlockBondPlug2915322487]: {},

                // titan
                [InventoryItemHashes.HelmOfAgonyHelmetPlug3475635982]: {},
                [InventoryItemHashes.GreavesOfAgonyLegArmorPlug3846650177]: {},
                [InventoryItemHashes.MarkOfAgonyTitanMarkPlug2138394740]: {},
            },
        },
    ],
    master: {
        activityHash: ActivityHashes.RootOfNightmaresMaster,
        dropTable: {
            [InventoryItemHashes.MykelsReverenceAdeptSidearm]: {},
            [InventoryItemHashes.AcasiasDejectionAdeptTraceRifle]: {},
            [InventoryItemHashes.RufussFuryAdeptAutoRifle]: {},
            [InventoryItemHashes.KoraxissDistressAdeptGrenadeLauncher]: {},
            [InventoryItemHashes.BriarsContemptAdeptLinearFusionRifle]: {},
            [InventoryItemHashes.NessasOblationAdeptShotgun]: {},
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
