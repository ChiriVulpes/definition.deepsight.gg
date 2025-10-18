import { ActivityHashes, ActivityTypeHashes, EventCardHashes, InventoryItemHashes, PresentationNodeHashes, RecordHashes, SandboxPerkHashes, SeasonHashes } from '@deepsight.gg/Enums'
import { DeepsightMomentDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
import type { PromiseOr } from '../utility/Type'
import DestinyManifestReference from './DestinyManifestReference'
import { MomentHashes } from './enum/MomentHashes'
import manifest, { DESTINY_MANIFEST_MISSING_ICON_PATH } from './utility/endpoint/DestinyManifest'

////////////////////////////////////
//#region Data Types

type KeySelector<T, K extends keyof T> = K
type MomentOmitKeys = KeySelector<DeepsightMomentDefinition,
	| 'hash'
	| 'displayProperties'
	| 'iconWatermark' | 'subsumeIconWatermarks'
	| 'images'
>
type MomentPartialKeys = KeySelector<DeepsightMomentDefinition, 'iconWatermarkShelved'>
type MomentManifestReferenceKeys = KeySelector<DeepsightMomentDefinition, 'iconWatermarkShelved' | 'primaryImage'>
type DeepsightMomentDefinitionData =
	& Omit<DeepsightMomentDefinition, MomentOmitKeys | MomentPartialKeys | MomentManifestReferenceKeys>
	& Partial<Pick<DeepsightMomentDefinition, MomentPartialKeys>>
	& Partial<Record<MomentManifestReferenceKeys, string | DestinyManifestReference>>
	& {
		hash?: MomentHashes
		iconWatermark: string | DestinyManifestReference
		subsumeIconWatermarks?: (string | DestinyManifestReference)[]
		images?: (string | DestinyManifestReference)[]
		displayProperties?: DestinyManifestReference.DisplayPropertiesDefinition
	}

//#endregion
////////////////////////////////////

////////////////////////////////////
//#region Moment Data

const DeepsightMomentDefinitionData: Record<keyof typeof MomentHashes, DeepsightMomentDefinitionData> = {
	TheRevelry: {
		id: 'revelry',
		displayProperties: {
			name: 'The Revelry',
			description: 'Celebrate the joy of Spring. The Tower is overflowing with colorful arrangements, and Eva Levante has a new activity for you to enjoy with new rewards to claim.',
			// no icon :(
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.VerdantCrownShaderPlug },
		event: true,
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheVerdantForest, property: 'pgcrImage' } },
		],
		itemHashes: [
			InventoryItemHashes.VernalGrowthMaskHelmet,
			InventoryItemHashes.VernalGrowthGripsGauntlets,
			InventoryItemHashes.VernalGrowthVestChestArmor,
			InventoryItemHashes.VernalGrowthStridesLegArmor,
			InventoryItemHashes.VernalGrowthCloakHunterCloak,

			InventoryItemHashes.VernalGrowthHelmHelmet,
			InventoryItemHashes.VernalGrowthGauntletsGauntlets,
			InventoryItemHashes.VernalGrowthPlateChestArmor,
			InventoryItemHashes.VernalGrowthGreavesLegArmor,
			InventoryItemHashes.VernalGrowthMarkTitanMark,

			InventoryItemHashes.VernalGrowthHoodHelmet,
			InventoryItemHashes.VernalGrowthGlovesGauntlets,
			InventoryItemHashes.VernalGrowthRobesChestArmor,
			InventoryItemHashes.VernalGrowthBootsLegArmor,
			InventoryItemHashes.VernalGrowthBondWarlockBond,

			InventoryItemHashes.ArbalestLinearFusionRifle,
		],
	},
	TheDawning: {
		id: 'dawning',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ZephyrSword3400256755 },
		event: EventCardHashes.TheDawning,
	},
	CrimsonDays: {
		id: 'crimsondays',
		displayProperties: {
			name: { DestinyActivityTypeDefinition: ActivityTypeHashes.CrimsonDays },
			description: { DestinyActivityTypeDefinition: ActivityTypeHashes.CrimsonDays },
			icon: { DestinyInventoryItemDefinition: { hash: InventoryItemHashes.WelcomeToCrimsonDaysQuest, iconSequence: 0, frame: 2 } },
		},
		images: [
			{ DestinyInventoryItemDefinition: { hash: InventoryItemHashes.FireOfTheCrimsonDaysEmblem, property: 'secondarySpecial' } },
		],
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.EntwiningHeartShellGhostShell },
		event: true,
	},
	GuardianGames: {
		id: 'guardiangames',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TheTitleSubmachineGun294129361 },
		event: EventCardHashes.GuardianGames,
	},
	Solstice: {
		id: 'solstice',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.CandescentGlovesGauntletsPlug },
		event: EventCardHashes.Solstice,
	},
	FestivalOfTheLost: {
		id: 'festivalofthelost',
		aliases: ['fotl'],
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.BraytechWerewolfAutoRifle528834068 },
		event: EventCardHashes.FestivalOfTheLost,
	},
	TheRedWar: {
		id: 'redwar',
		displayProperties: {
			name: { DestinyInventoryItemDefinition: InventoryItemHashes.TheRedWarDummy },
			description: { DestinyInventoryItemDefinition: InventoryItemHashes.TheRedWarDummy },
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.CabalArrival },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.RatKingSidearm },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.Chosen_Tier1, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.Homecoming4034557395, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Adieu, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Spark_ActivityLightLevel750, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Combustion, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Hope_Tier1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Riptide, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Utopia, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Looped, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Six, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Sacrilege, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Fury_Tiern1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Payback_ActivityLightLevel750, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Unbroken, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Larceny, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes['1au_PlaceHash2555959872'], property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Chosen_Tier1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Leviathan89727599, property: 'pgcrImage' } },
		],
		expansion: true,
		season: 1,
		year: 1,
		seasonHash: 965757574 as SeasonHashes,
	},
	CurseOfOsiris: {
		id: 'osiris',
		displayProperties: {
			name: { DestinyInventoryItemDefinition: InventoryItemHashes.CurseOfOsirisDummy },
			description: { DestinyInventoryItemDefinition: InventoryItemHashes.CurseOfOsirisDummy },
			// no icon :(
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.EyeOfOsirisWeaponOrnamentPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.BeyondInfinity, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheGateway1512980468, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ADeadlyTrial, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BeyondInfinity, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DeepStorage, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TreeOfProbabilities561345572, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Hijacked, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.AGardenWorld117447065, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Omega, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.LeviathanEaterOfWorldsNormal, property: 'pgcrImage' } },
		],
		expansion: true,
		season: 2,
		year: 1,
		seasonHash: SeasonHashes.CurseOfOsiris,
	},
	Warmind: {
		id: 'warmind',
		displayProperties: {
			name: { DestinyInventoryItemDefinition: InventoryItemHashes.WarmindDummy },
			description: { DestinyInventoryItemDefinition: InventoryItemHashes.WarmindDummy },
			icon: { DestinyInventoryItemDefinition: InventoryItemHashes.AiComRspnRebootTransmatEffectPlug },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ZeusLikePhysiqueEmotePlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.DailyHeroicStoryMissionPilgrimage, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.IceAndShadow1967025365, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DailyHeroicStoryMissionPilgrimage, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OffWorldRecovery, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Hephaestus_Tiern1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.StrangeTerrain2992505404, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.WillOfTheThousands3944547192, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.LeviathanSpireOfStarsNormal, property: 'pgcrImage' } },
		],
		expansion: true,
		season: 3,
		year: 1,
		seasonHash: SeasonHashes.Resurgence,
	},
	Forsaken: {
		id: 'forsaken',
		aliases: ['outlaw'],
		displayProperties: {
			name: 'Forsaken',
			description: { DestinyActivityDefinition: ActivityHashes.Destiny2Forsaken },
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.CorruptEther },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.JeweledProjectionGhostProjectionPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.HighPlainsBlues_ModifiersLength2, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.DailyHeroicStoryMissionLastCall, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.HighPlainsBlues_ModifiersLength2, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Scorned, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheMachinist, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.NothingLeftToSay3559661941, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.LastWishNormal, property: 'pgcrImage' } },
		],
		expansion: true,
		season: 4,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfTheOutlaw,
	},
	SeasonOfTheForge: {
		id: 'forge',
		// no icon :(
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.RustPunkShellGhostShell },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.BergusiaForge, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.GofannonForge, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BergusiaForge, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.VolundrForge, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.IzanamiForge, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ScourgeOfThePast_ModifiersLength5, property: 'pgcrImage' } },
		],
		season: 5,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfTheForge,
	},
	SeasonOfTheDrifter: {
		id: 'drifter',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: 1723139242 }, // "Adds the illusion of a Gambit coin to your transmat effects."
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TotemShellGhostShell },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheReckoningTierI, property: 'pgcrImage' } },
		],
		season: 6,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfTheDrifter,
	},
	SeasonOfOpulence: {
		id: 'opulence',
		// no icon :(
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.OneFellSwoopVehicle },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheMenagerie228586976, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.CrownOfSorrowNormal_GuidedGameUndefined, property: 'pgcrImage' } },
		],
		season: 7,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfOpulence,
	},
	Shadowkeep: {
		id: 'shadowkeep',
		displayProperties: {
			name: { DestinyRecordDefinition: RecordHashes.Shadowkeep },
			description: { DestinyActivityDefinition: ActivityHashes.Destiny2Shadowkeep_TraitHashesUndefined },
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.BlindClutch },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.SymphonyOfDeathQuestStep_Step0 },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.TheScarletKeep346345236, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.AMysteriousDisturbance845208861, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.InSearchOfAnswers_PlaceHash3325508439, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheScarletKeep346345236, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.InTheDeep471727774, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Beyond778535230, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.GardenOfSalvation1042180643, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 3,
	},
	SeasonOfTheUndying: {
		id: 'undying',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.BlackheartGrowth555491412 },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TheVowQuestStep_Step0 },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.VexOffensive_IsPlaylistfalse, property: 'pgcrImage' } },
		],
		season: 8,
		year: 3,
		seasonHash: SeasonHashes.SeasonOfTheUndying,
	},
	SeasonOfDawn: {
		id: 'dawn',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.VexGateArrival },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TimesweptShellGhostShell },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheSundialNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExploringTheCorridorsOfTime, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.CorridorsOfTimePart1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.CorridorsOfTimePart2, property: 'pgcrImage' } },
		],
		season: 9,
		year: 3,
		seasonHash: SeasonHashes.SeasonOfDawn,
	},
	SeasonOfTheWorthy: {
		id: 'worthy',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.WarsatArrival },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.MasterfulFlowEmotePlug },
		images: [
			{ DestinyInventoryItemDefinition: { hash: InventoryItemHashes.WarmindedEmblem, property: 'secondarySpecial' } },
		],
		season: 10,
		year: 3,
		seasonHash: SeasonHashes.SeasonOfTheWorthy,
	},
	SeasonOfArrivals: {
		id: 'arrivals',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.TravelerEntrance },
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.WhiteCollarCrimeWeaponOrnamentPlug },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.Interference, property: 'pgcrImage' } },
		],
		season: 11,
		year: 3,
		seasonHash: SeasonHashes.SeasonOfArrivals,
	},
	BeyondLight: {
		id: 'beyondlight',
		displayProperties: {
			name: { DestinyRecordDefinition: RecordHashes.BeyondLight },
			description: { DestinyActivityDefinition: ActivityHashes.Destiny2BeyondLight1082553800 },
			icon: { DestinyRecordDefinition: RecordHashes.BeyondLightChapter1 },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.NoLoveLostGhostShell },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.TheKellOfDarkness, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheNewKell, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.RisingResistance, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheWarrior_ActivityLightLevel0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheTechnocrat_ActivityLightLevel0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheGlassway376759502, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheKellOfDarkness, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DeepStoneCrypt_RewardsLength0, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 4,
	},
	SeasonOfTheHunt: {
		id: 'hunt',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.StasisEntrance },
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.SteeplechaseGauntletsTitanUniversalOrnamentPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.Harbinger, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TrackTheWrathborn519856941, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TrackTheWrathborn998164660, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TrackTheWrathborn1340699221, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TrackTheWrathborn3931434236, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Harbinger, property: 'pgcrImage' } },
		],
		season: 12,
		year: 4,
		seasonHash: SeasonHashes.SeasonOfTheHunt,
	},
	SeasonOfTheChosen: {
		id: 'chosen',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.HeartbreakingEntrance },
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.FistPumpEmotePlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundBehemoth1469356655, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundBehemoth1469356655, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundHailstone24843407, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundFoothold176258399, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundOracle679234423, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ProvingGroundsCustomize_RewardsLength1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.PresageStandard, property: 'pgcrImage' } },
		],
		season: 13,
		year: 4,
		seasonHash: SeasonHashes.SeasonOfTheChosen,
	},
	SeasonOfTheSplicer: {
		id: 'splicer',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.VitreousEntrance },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.NoSignalEmotePlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.OverrideLastCity, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeTartarusNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeCorruptedTartarus, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeStyxNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeCorruptedStyx, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeLabyrinthNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeCorruptedLabyrinth, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpungeDelphi, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OverrideTangledShore, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OverrideTheMoon, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OverrideEuropa, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OverrideLastCity, property: 'pgcrImage' } },
		],
		season: 14,
		year: 4,
		seasonHash: SeasonHashes.SeasonOfTheSplicer,
	},
	SeasonOfTheLost: {
		id: 'lost',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.WayfindersEntrance },
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.QueensCrestProjectionGhostProjectionPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.Exorcism_ModifiersLength3, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionCocoon3863662327, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.AstralAlignmentNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ShatteredRealmDebrisOfDreamsNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ShatteredRealmForestOfEchoesNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ShatteredRealmRuinsOfWrathNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.AHollowCoronation_ActivityLightLevel1250, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Exorcism_ModifiersLength3, property: 'pgcrImage' } },
		],
		season: 15,
		year: 4,
		seasonHash: SeasonHashes.SeasonOfTheLost,
	},
	Bungie30thAnniversary: {
		id: '30th',
		displayProperties: {
			name: { DestinyRecordDefinition: RecordHashes['30thAnniversary'] },
			description: { DestinyActivityDefinition: ActivityHashes.Destiny2Bungies30thAnniversaryPack },
			icon: { DestinyRecordDefinition: RecordHashes['30thExotics'] },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.SeventhColumnProjectionGhostProjectionPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.DaresOfEternityStandard, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.DaresOfEternityStandard, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.GraspOfAvariceStandard, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 4,
	},
	TheWitchQueen: {
		id: 'witchqueen',
		displayProperties: {
			name: { DestinyRecordDefinition: RecordHashes.TheWitchQueen },
			description: { DestinyActivityDefinition: ActivityHashes.Destiny2TheWitchQueen },
			icon: { DestinyRecordDefinition: RecordHashes.TheWitchQueenChapter1 },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.DoneAndDustyWeaponOrnamentPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.TheRitualNormal, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheArrivalNormal_PlaceHash2809578934, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheInvestigationNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheGhostsNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheCommunionNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheMirrorNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.AltarOfReflectionInsight, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheLightblade1012655911, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheCunningNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheLastChanceNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheRitualNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ParasiticPilgrimage, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.VowOfTheDiscipleStandard, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 5,
	},
	SeasonOfTheRisen: {
		id: 'risen',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.LucentShriekerEntrance }
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.PsionicSpeakerHoodWarlockUniversalOrnamentPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.PsiopsBattlegroundCosmodrome_OptionalUnlockStringsLength0, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.PsiopsBattlegroundCosmodrome_OptionalUnlockStringsLength0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.PsiopsBattlegroundEdz3367406520, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.PsiopsBattlegroundMoon2128786079, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.VoxObscuraNormal, property: 'pgcrImage' } },
		],
		season: 16,
		year: 5,
		seasonHash: SeasonHashes.SeasonOfTheRisen,
		itemHashes: [
			// move hunter armour from the witch queen source to the risen source to match other classes' armours
			InventoryItemHashes.TuskedAllegianceStridesLegArmorPlug,
			InventoryItemHashes.TuskedAllegianceVestChestArmorPlug,
			InventoryItemHashes.TuskedAllegianceCloakHunterCloakPlug,
			InventoryItemHashes.TuskedAllegianceGripsGauntletsPlug,
			InventoryItemHashes.TuskedAllegianceMaskHelmetPlug,
		],
	},
	SeasonOfTheHaunted: {
		id: 'haunted',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.InsubordinationWeaponOrnamentPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.OperationMidas_PlaceHash1446501763, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationMidas_PlaceHash1446501763, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.NightmareContainmentContainment, property: 'pgcrImage' } },
			// { DestinyActivityDefinition: { hash: ActivityHashes.SeverRage, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.SeverResolve, property: 'pgcrImage' } },
			// { DestinyActivityDefinition: { hash: ActivityHashes.SeverShame, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.SeverReconciliation, property: 'pgcrImage' } },
			// { DestinyActivityDefinition: { hash: ActivityHashes.SeverGrief, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.SeverForgiveness, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Catharsis, property: 'pgcrImage' } },
		],
		season: 17,
		year: 5,
		seasonHash: SeasonHashes.SeasonOfTheHaunted,
	},
	SeasonOfPlunder: {
		id: 'plunder',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.EndOfTheRainbow },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.IntendedAuthorityWeaponOrnamentPlug },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.SalvageAndSalvation_Tiern1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExpeditionCosmodrome_ActivityLightLevel0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Ketchcrash, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.PirateHideoutTheBeastTamer, property: 'pgcrImage' } },
		],
		season: 18,
		year: 5,
		seasonHash: SeasonHashes.SeasonOfPlunder,
	},
	SeasonOfTheSeraph: {
		id: 'seraph',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.StandoutPoseEmotePlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.OperationDiocles, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.AbhorrentImperative_ModifiersLength4, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationDiocles, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationSancus, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationSonOfSaturn, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationArchimedes, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Hierarchy_ModifiersLength1, property: 'pgcrImage' } },
		],
		season: 19,
		year: 5,
		seasonHash: SeasonHashes.SeasonOfTheSeraph,
	},
	Lightfall: {
		id: 'lightfall',
		displayProperties: {
			name: { DestinyActivityDefinition: ActivityHashes.Lightfall },
			description: { DestinyInventoryItemDefinition: InventoryItemHashes.Destiny2LightfallDummy },
			icon: { DestinyInventoryItemDefinition: { hash: InventoryItemHashes.LightfallQuestStep_Step1_StatsObjectLength4, iconSequence: 0, frame: 2 } },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ScintillantTrajectoryShaderPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.OnTheVergeNormal, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.FirstContactNormal_ModifiersLength6, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.UnderSiegeNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DownfallNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BreakneckNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OnTheVergeNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.NoTimeLeftNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.HeadlongNormal_InsertionPointsLength1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DesperateMeasuresNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.RootOfNightmaresStandard, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 6,
	},
	SeasonOfDefiance: {
		id: 'defiance',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.KeepingTimeEmotePlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.DefiantBattlegroundEdz_ModifiersLength20, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.DefiantBattlegroundCosmodrome_ModifiersLength20, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DefiantBattlegroundEdz_ModifiersLength20, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DefiantBattlegroundOrbitalPrison_ModifiersLength20, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionJailbreak, property: 'pgcrImage' } },
		],
		season: 20,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfDefiance,
	},
	SeasonOfTheDeep: {
		id: 'deep',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.DeepProjectionGhostProjectionPlug },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.BarotraumaOperationFulguriteAbyss, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheDescent_Tiern1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Salvage1190991948, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DeepDivesDeepDivesMatchmade, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationThunderboltTwilight, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.OperationFulguriteAbyss, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BarotraumaOperationFulguriteAbyss, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.GhostsOfTheDeepStandard, property: 'pgcrImage' } },
		],
		season: 21,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfTheDeep,
	},
	SeasonOfTheWitch: {
		id: 'witch',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.KeptConfidenceHandCannon },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.AltarsOfSummoning, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.AltarsOfSummoning, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.SavathunsSpire, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheImbaruEngine, property: 'pgcrImage' } },
		],
		season: 22,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfTheWitch,
	},
	SeasonOfTheWish: {
		id: 'wish',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.LethalAbundanceAutoRifle2189073092 },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.FinalWish, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheCoilCustomize_RewardsLength1, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Chiasmus_ModifiersLength2, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.StarcrossedCustomize, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Starcrossed, property: 'pgcrImage' } },
		],
		season: 23,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfTheWish,
	},
	IntoTheLight: {
		id: 'intothelight',
		aliases: ['itl'],
		displayProperties: {
			name: { DestinyPresentationNodeDefinition: PresentationNodeHashes.IntoTheLight },
			description: { DestinyActivityTypeDefinition: ActivityTypeHashes.Onslaught },
			icon: { DestinyRecordDefinition: RecordHashes.BraveCollector },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ParadeHelmHelmetPlug },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.VostokOnslaught_ChallengesLength0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MidtownOnslaught_ChallengesLength0, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MothyardsOnslaught_ChallengesLength0, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 6,
		itemHashes: [
			InventoryItemHashes.OutbreakPerfectedPulseRifle_TooltipNotificationsLength3,
			InventoryItemHashes.WhisperOfTheWormSniperRifle_TooltipNotificationsLength3,
		],
	},
	TheFinalShape: {
		id: 'finalshape',
		displayProperties: {
			name: { DestinyActivityDefinition: ActivityHashes.TheFinalShape },
			description: { DestinyActivityDefinition: ActivityHashes.TheFinalShape },
			icon: { DestinyInventoryItemDefinition: { hash: InventoryItemHashes.TheFinalShapeQuestStep_Step0_SetDataSetIsFeaturedfalse, iconSequence: 0, frame: 1 } },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ErgoSumSword },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.DissentNormal, property: 'pgcrImage' } },
		images: [
			// https://github.com/Bungie-net/api/issues/2037
			// the correct order should be:
			// transmigration, temptation, exegesis, requiem, ascent, dissent, iconoclasm
			{ DestinyActivityDefinition: { hash: ActivityHashes.TemptationNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DissentNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExegesisNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.AscentNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.RequiemNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.IconoclasmNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TransmigrationNormal, property: 'pgcrImage' } },

			{ DestinyActivityDefinition: { hash: ActivityHashes.SalvationsEdgeStandard_ModifiersLength10, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.DualDestiny, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 7,
	},
	EpisodeEchoes: {
		id: 'echoes',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.RedDeathReformedPulseRifle },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundDelveCustomize, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundDelveCustomize, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundConduitCustomize, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.BattlegroundCoreCustomize, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ArenaBreachExecutableStandard, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.EncoreOvertureStandard, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.EncoreCustomize, property: 'pgcrImage' } },
		],
		season: 24,
		year: 7,
		seasonHash: SeasonHashes.EpisodeEchoes,
	},
	EpisodeRevenant: {
		id: 'revenant',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.IceBreakerSniperRifle },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.KellsFallCustomize, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TombOfEldersMatchmade, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.KellsGraveOnslaughtSalvation, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.WidowsCourtOnslaughtSalvation, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.EventideRuinsOnslaughtSalvation, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.KellsFallCustomize, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.VespersHostNormal, property: 'pgcrImage' } },
		],
		season: 25,
		year: 7,
		seasonHash: SeasonHashes.EpisodeRevenant,
	},
	EpisodeHeresy: {
		id: 'heresy',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.LodestarTraceRifle },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.Appellation, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.Espial, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Recce, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Appellation, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Renascence, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionCaptis, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheNetherAdvanced, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.CourtOfBladesStandard_IsPlaylistfalse, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Kludge, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.Resile, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheSunlessCellNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ExoticMissionDerealize, property: 'pgcrImage' } },
		],
		season: 26,
		year: 7,
		seasonHash: SeasonHashes.EpisodeHeresy,
	},
	RiteOfTheNine: {
		id: 'riteofthenine',
		aliases: ['rotn'],
		displayProperties: {
			name: { DestinyPresentationNodeDefinition: PresentationNodeHashes.RiteOfTheNine },
			description: 'The Emmisary brings you a message from The Nine. They put forth a challenge to the Lightbearers — We ask: make known your value, so divided gods may wield you in time.',
			// description: { DestinyActivityDefinition: ActivityHashes.TheRiteOfTheNine },
			icon: { DestinyRecordDefinition: RecordHashes.SeekerOfTheNine },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TerminusHorizonMachineGun2730671571 },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheRiteOfTheNine, property: 'pgcrImage' } },
		],
		year: 7,
		expansion: true,
	},
	EdgeOfFate: {
		id: 'edgeoffate',
		aliases: ['eof'],
		displayProperties: {
			name: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
			description: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
			icon: { DestinyInventoryItemDefinition: { hash: InventoryItemHashes.TheEdgeOfFateQuestStep_Step0_SetDataSetIsFeaturedfalse, iconSequence: 0, frame: 2 } },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.GravitonSpikeHandCannon },
		primaryImage: { DestinyActivityDefinition: { hash: ActivityHashes.MissionTheInvitationNormal, property: 'pgcrImage' } },
		images: [
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionTheInvitationNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionFallowNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionNostosNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.CommencementNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionTransientNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionSaturnismNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.GougeNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionMorphologyNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.ChargeNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionDisruptionNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionCalculusNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.QuarantineNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.MissionCriticalityNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheMessageNormal, property: 'pgcrImage' } },
			{ DestinyActivityDefinition: { hash: ActivityHashes.TheSieve_ModifiersLength1, property: 'pgcrImage' } },
		],
		expansion: true,
		year: 8,
	},
	SeasonReclamation: {
		id: 'reclamation',
		aliases: ['ashandiron', 'ash&iron'],
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.ThirdIterationScoutRifle },
		subsumeIconWatermarks: [
			{ DestinyInventoryItemDefinition: InventoryItemHashes.SubmersionCombatBow_IsHolofoilfalse },
		],
		season: 27,
		year: 8,
		seasonHash: SeasonHashes.SeasonReclamation,
	},
}

//#endregion
////////////////////////////////////

let DeepsightMomentDefinition: PromiseOr<Record<number, DeepsightMomentDefinition>> | undefined

export async function getDeepsightMomentDefinition () {
	DeepsightMomentDefinition ??= computeDeepsightMomentDefinition()
	return DeepsightMomentDefinition = await DeepsightMomentDefinition
}

////////////////////////////////////
//#region Resolve Manifest References

async function computeDeepsightMomentDefinition () {
	const { DestinySeasonDefinition, DestinySeasonPassDefinition, DestinyEventCardDefinition } = manifest

	const result: Record<number, DeepsightMomentDefinition> = {}
	for (const [id, definitionData] of Object.entries(DeepsightMomentDefinitionData)) {
		const hash = MomentHashes[id as keyof typeof MomentHashes]
		const definition = { ...definitionData }
		result[hash] = definition as never as DeepsightMomentDefinition
		definition.hash = hash

		definition.iconWatermarkShelved = await DestinyManifestReference.resolve(definition.iconWatermarkShelved ?? (typeof definition.iconWatermark === 'object' ? definition.iconWatermark : undefined), 'iconWatermarkShelved') ?? definition.iconWatermarkShelved
		definition.iconWatermarkFeatured = await DestinyManifestReference.resolve(definition.iconWatermarkFeatured ?? (typeof definition.iconWatermark === 'object' ? definition.iconWatermark : undefined), 'iconWatermarkFeatured') ?? definition.iconWatermarkFeatured
		definition.iconWatermark = await DestinyManifestReference.resolve(definition.iconWatermark, 'iconWatermark') ?? definition.iconWatermark
		definition.subsumeIconWatermarks = await definition.subsumeIconWatermarks
			?.map(icon => DestinyManifestReference.resolve(typeof icon === 'object' ? icon : undefined, 'iconWatermark') ?? icon)
			.collect(watermarkPromises => Promise.all(watermarkPromises))
			.then(watermarks => watermarks.filter(wm => wm !== undefined))

		if (definition.displayProperties) {
			definition.displayProperties.name = await DestinyManifestReference.resolve(definition.displayProperties.name, 'name')
			definition.displayProperties.description = await DestinyManifestReference.resolve(definition.displayProperties.description, 'description')
			const icon = await DestinyManifestReference.resolve(definition.displayProperties.icon, 'icon')
			if (icon !== DESTINY_MANIFEST_MISSING_ICON_PATH)
				definition.displayProperties.icon = icon
		}

		definition.displayProperties ??= {}

		const season = await DestinySeasonDefinition.get(definition.seasonHash)
		if (season) {
			definition.displayProperties.name ??= season.displayProperties.name
			definition.displayProperties.description ??= season.displayProperties.description
			if (season.displayProperties.icon !== DESTINY_MANIFEST_MISSING_ICON_PATH)
				definition.displayProperties.icon ??= season.displayProperties.icon
		}

		const event = await DestinyEventCardDefinition.get(definition.event === true ? undefined : definition.event)
		if (event) {
			definition.displayProperties.name ??= event.displayProperties.name
			definition.displayProperties.description ??= event.displayProperties.description
			if (event.displayProperties.icon !== DESTINY_MANIFEST_MISSING_ICON_PATH)
				definition.displayProperties.icon ??= event.displayProperties.icon
		}

		definition.displayProperties.name ??= ''
		definition.displayProperties.description ??= ''

		definition.primaryImage = await DestinyManifestReference.resolve(definition.primaryImage ?? (typeof definition.primaryImage === 'object' ? definition.primaryImage : undefined), 'pgcrImage') ?? definition.primaryImage
		definition.images = await definition.images
			?.map(image => DestinyManifestReference.resolve(typeof image === 'object' ? image : undefined, 'pgcrImage') ?? image)
			.collect(imagePromises => Promise.all(imagePromises))
			.then(images => images.filter(img => img !== undefined))

		if (event?.images?.themeBackgroundImagePath) {
			definition.images ??= []
			definition.images.push(event.images?.themeBackgroundImagePath)
		}

		const seasonPasses = await season?.seasonPassList
			.map(sp => DestinySeasonPassDefinition.get(sp.seasonPassHash))
			.collect(spPromises => Promise.all(spPromises))
			.then(sps => sps.filter(sp => sp !== undefined))
		const seasonPassImages = seasonPasses
			?.map(sp => sp.images?.themeBackgroundImagePath)
			.filter(img => img)
		if (seasonPassImages?.length) {
			definition.images ??= []
			definition.images.push(...seasonPassImages)
		}

		definition.primaryImage ??= definition.images?.[0]
		if (definition.primaryImage && !definition.images?.length)
			definition.images = [definition.primaryImage]
		if (definition.primaryImage && !definition.images?.includes(definition.primaryImage))
			definition.images?.unshift(definition.primaryImage)
	}

	return result
}

//#endregion
////////////////////////////////////

export default Task('DeepsightMomentDefinition', async () => {
	DeepsightMomentDefinition = undefined
	const manifest = await getDeepsightMomentDefinition()

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightMomentDefinition.json', manifest, { spaces: '\t' })
})
