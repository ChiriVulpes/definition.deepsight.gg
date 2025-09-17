import { ActivityHashes, ActivityTypeHashes, EventCardHashes, InventoryItemHashes, PresentationNodeHashes, RecordHashes, SandboxPerkHashes, SeasonHashes } from '@deepsight.gg/Enums'
import { DeepsightMomentDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
import type { PromiseOr } from '../utility/Type'
import DestinyManifestReference from './DestinyManifestReference'
import { MomentHashes } from './enum/MomentHashes'
import manifest, { DESTINY_MANIFEST_MISSING_ICON_PATH } from './utility/endpoint/DestinyManifest'

type KeySelector<T, K extends keyof T> = K
type MomentOmitKeys = KeySelector<DeepsightMomentDefinition, 'hash' | 'displayProperties' | 'iconWatermark' | 'subsumeIconWatermarks'>
type MomentPartialKeys = KeySelector<DeepsightMomentDefinition, 'iconWatermarkShelved'>
type MomentManifestReferenceKeys = KeySelector<DeepsightMomentDefinition, 'iconWatermarkShelved'>
type DeepsightMomentDefinitionData =
	& Omit<DeepsightMomentDefinition, MomentOmitKeys | MomentPartialKeys>
	& Partial<Pick<DeepsightMomentDefinition, MomentPartialKeys>>
	& Partial<Record<MomentManifestReferenceKeys, number | DestinyManifestReference>>
	& {
		hash?: MomentHashes
		iconWatermark: string | DestinyManifestReference
		subsumeIconWatermarks?: (string | DestinyManifestReference)[]
		displayProperties?: DestinyManifestReference.DisplayPropertiesDefinition
	}

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
			icon: { DestinyInventoryItemDefinition: InventoryItemHashes.WelcomeToCrimsonDaysQuest },
		},
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
		expansion: true,
		season: 4,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfTheOutlaw,
	},
	SeasonOfTheForge: {
		id: 'forge',
		// no icon :(
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.RustPunkShellGhostShell },
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
		season: 6,
		year: 2,
		seasonHash: SeasonHashes.SeasonOfTheDrifter,
	},
	SeasonOfOpulence: {
		id: 'opulence',
		// no icon :(
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.OneFellSwoopVehicle },
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
		expansion: true,
		year: 3,
	},
	SeasonOfTheUndying: {
		id: 'undying',
		displayProperties: {
			icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.BlackheartGrowth555491412 },
		},
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.TheVowQuestStep_Step0 },
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
		expansion: true,
		year: 4,
	},
	SeasonOfTheHunt: {
		id: 'hunt',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.StasisEntrance },
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.SteeplechaseGauntletsTitanUniversalOrnamentPlug },
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
		expansion: true,
		year: 5,
	},
	SeasonOfTheRisen: {
		id: 'risen',
		// displayProperties: {
		// 	icon: { DestinySandboxPerkDefinition: SandboxPerkHashes.LucentShriekerEntrance }
		// },
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.PsionicSpeakerHoodWarlockUniversalOrnamentPlug },
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
		season: 18,
		year: 5,
		seasonHash: SeasonHashes.SeasonOfPlunder,
	},
	SeasonOfTheSeraph: {
		id: 'seraph',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.StandoutPoseEmotePlug },
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
		expansion: true,
		year: 6,
	},
	SeasonOfDefiance: {
		id: 'defiance',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.KeepingTimeEmotePlug },
		season: 20,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfDefiance,
	},
	SeasonOfTheDeep: {
		id: 'deep',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.DeepProjectionGhostProjectionPlug },
		season: 21,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfTheDeep,
	},
	SeasonOfTheWitch: {
		id: 'witch',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.KeptConfidenceHandCannon },
		season: 22,
		year: 6,
		seasonHash: SeasonHashes.SeasonOfTheWitch,
	},
	SeasonOfTheWish: {
		id: 'wish',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.LethalAbundanceAutoRifle2189073092 },
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
		expansion: true,
		year: 7,
	},
	EpisodeEchoes: {
		id: 'echoes',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.RedDeathReformedPulseRifle },
		season: 24,
		year: 7,
		seasonHash: SeasonHashes.EpisodeEchoes,
	},
	EpisodeRevenant: {
		id: 'revenant',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.IceBreakerSniperRifle },
		season: 25,
		year: 7,
		seasonHash: SeasonHashes.EpisodeRevenant,
	},
	EpisodeHeresy: {
		id: 'heresy',
		iconWatermark: { DestinyInventoryItemDefinition: InventoryItemHashes.LodestarTraceRifle },
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

let DeepsightMomentDefinition: PromiseOr<Record<number, DeepsightMomentDefinition>> | undefined

export async function getDeepsightMomentDefinition () {
	DeepsightMomentDefinition ??= computeDeepsightMomentDefinition()
	return DeepsightMomentDefinition = await DeepsightMomentDefinition
}

async function computeDeepsightMomentDefinition () {
	const { DestinySeasonDefinition, DestinyEventCardDefinition } = manifest

	const result: Record<number, DeepsightMomentDefinition> = {}
	for (const [id, definitionData] of Object.entries(DeepsightMomentDefinitionData)) {
		const hash = MomentHashes[id as keyof typeof MomentHashes]
		const definition = { ...definitionData }
		result[hash] = definition as never as DeepsightMomentDefinition
		definition.hash = hash

		definition.iconWatermarkShelved = await DestinyManifestReference.resolve(definition.iconWatermarkShelved ?? (typeof definition.iconWatermark === 'object' ? definition.iconWatermark : undefined), 'iconWatermarkShelved') ?? definition.iconWatermarkShelved
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
	}

	return result
}

export default Task('DeepsightMomentDefinition', async () => {
	DeepsightMomentDefinition = undefined
	const manifest = await getDeepsightMomentDefinition()

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('docs/definitions/DeepsightMomentDefinition.json', manifest, { spaces: '\t' })
})
