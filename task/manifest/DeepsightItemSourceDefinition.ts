import type { ActivityGraphHashes } from '@deepsight.gg/Enums'
import { ActivityHashes, ActivityModeHashes, EventCardHashes, FireteamFinderActivityGraphHashes, InventoryItemHashes, ItemCategoryHashes, ItemTierTypeHashes, MomentHashes, PresentationNodeHashes, SeasonPassHashes, VendorHashes } from '@deepsight.gg/Enums'
import type { DeepsightDisplayPropertiesDefinition, DeepsightItemSourceDefinition } from '@deepsight.gg/Interfaces'
import { DeepsightItemSourceCategory, DeepsightItemSourceType, type DeepsightItemSourceListDefinition } from '@deepsight.gg/Interfaces'
import type { DestinyActivityDefinition, DestinyDisplayCategoryDefinition, DestinyVendorDefinition } from 'bungie-api-ts/destiny2/interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
import type { PromiseOr } from '../utility/Type'
import { getDeepsightCollectionsDefinition } from './DeepsightCollectionsDefinition'
import { getDeepsightMomentDefinition } from './DeepsightMomentDefinition'
import DestinyManifestReference from './DestinyManifestReference'
import manifest from './utility/endpoint/DestinyManifest'

type VendorCategoryTuple = readonly [DestinyDisplayCategoryDefinition, number[]]

async function getVendorCategories (...vendorHashes: (VendorHashes | DestinyVendorDefinition | undefined | (VendorHashes | DestinyVendorDefinition | undefined)[])[]) {
	const result: VendorCategoryTuple[] = []
	const { DestinyVendorDefinition } = manifest
	for (let vendor of vendorHashes.flat()) {
		vendor = typeof vendor === 'number' ? (await DestinyVendorDefinition.get(vendor)) : vendor
		if (!vendor)
			continue

		result.push(...vendor.displayCategories
			.map((category, i) => [
				category,
				vendor.itemList.filter(item => item.displayCategoryIndex === i).map(item => item.itemHash),
			] as const)
		)
	}
	return result
}

async function getVendorCategoryItems (categories: VendorCategoryTuple[]) {
	return await Promise.all(categories.map(([category, items]) => getCollectionsItems(items)))
		.then(items => Array.from(new Set(items.flat())))
}

async function getDropsFromActivityGraphs (...graphs: ActivityGraphHashes[]) {
	return getActivities(...graphs)
		.then(activities => Promise.all(activities.map(getDropsFromActivity)))
		.then(items => Array.from(new Set(items.flat())))
}

async function getActivities (...graphs: ActivityGraphHashes[]) {
	const result: DestinyActivityDefinition[] = []
	for (const graph of graphs) {
		const { DestinyActivityGraphDefinition, DestinyActivityDefinition } = manifest
		const activityGraph = await DestinyActivityGraphDefinition.get(graph)
		if (!activityGraph)
			continue

		result.push(...await Promise.all(activityGraph.nodes.flatMap(node => node.activities.map(activity => DestinyActivityDefinition.get(activity.activityHash))))
			.then(activities => activities.filter(activity => activity !== undefined))
		)
	}
	return result
}

async function getDropsFromActivity (activity: DestinyActivityDefinition) {
	return await Promise.all(activity.rewards.flatMap(reward => reward.rewardItems.map(item => getCollectionsItem(item.itemHash))))
		.then(items => items.filter(item => item !== undefined))
}

async function getCollectionsItems (itemHashes: number[]) {
	return Promise.all(itemHashes.map(itemHash => getCollectionsItem(itemHash)))
		.then(items => items.filter(item => item !== undefined))
}

async function getCollectionsItem (itemHash: number) {
	if ((await getCollectionsItemList()).includes(itemHash))
		return itemHash

	const { DestinyInventoryItemDefinition } = manifest
	const collections = await getCollectionsItemMap()
	const item = await DestinyInventoryItemDefinition.get(itemHash)
	if (!item?.displayProperties.name || !item.iconWatermark)
		return undefined

	return collections[`${item.displayProperties.name}/${item.classType}/${item.iconWatermark}`]
}

let _itemMap: Promise<Record<string, number>> | Record<string, number> | undefined
let _itemList: Promise<number[]> | number[] | undefined
async function getCollectionsItemList () {
	if (_itemList)
		return _itemList

	return _itemList = (async () => {
		return Object.values(await getCollectionsItemMap())
	})()
}
async function getCollectionsItemMap () {
	if (_itemMap)
		return _itemMap

	return _itemMap = (async () => {
		const itemMap: Record<string, number> = {}

		const { DestinyInventoryItemDefinition } = manifest
		const collections = await getDeepsightCollectionsDefinition()
		for (const moment of Object.values(collections)) {
			for (const item of Object.values(moment.buckets).flat()) {
				const itemDefinition = await DestinyInventoryItemDefinition.get(item)
				if (itemDefinition?.displayProperties.name && itemDefinition.iconWatermark)
					itemMap[`${itemDefinition.displayProperties.name}/${itemDefinition.classType}/${itemDefinition.iconWatermark}`] = item
			}
		}

		return _itemMap = itemMap
	})()
}

const ORIGIN_TRAITS: [DeepsightItemSourceType, InventoryItemHashes[]][] = [
	[DeepsightItemSourceType.PinnacleOps, [
		InventoryItemHashes.ProblemSolverOriginTraitPlug,
		InventoryItemHashes.ProblemSolverEnhancedOriginTraitPlug,
	]],
	[DeepsightItemSourceType.TrialsOfOsiris, [
		InventoryItemHashes.FleetFootedOriginTraitPlug,
		InventoryItemHashes.FleetFootedEnhancedOriginTraitPlug,
		InventoryItemHashes.AlacrityOriginTraitPlug,
		InventoryItemHashes.AlacrityEnhancedOriginTraitPlug,
	]],
	[DeepsightItemSourceType.CrucibleOpsActivityReward, [
		InventoryItemHashes.OneQuietMomentOriginTraitPlug,
		InventoryItemHashes.OneQuietMomentEnhancedOriginTraitPlug,
		InventoryItemHashes.RoarOfBattleOriginTraitPlug,
		InventoryItemHashes.RoarOfBattleEnhancedOriginTraitPlug,
	]],
	[DeepsightItemSourceType.VanguardOpsActivityReward, [
		InventoryItemHashes.VanguardDeterminationOriginTraitPlug,
		InventoryItemHashes.VanguardDeterminationEnhancedOriginTraitPlug,
		InventoryItemHashes.VanguardsVindicationOriginTraitPlug,
		InventoryItemHashes.VanguardsVindicationEnhancedOriginTraitPlug,
		InventoryItemHashes.StunningRecoveryOriginTraitPlug,
		InventoryItemHashes.StunningRecoveryEnhancedOriginTraitPlug,
	]],
	[DeepsightItemSourceType.IronBannerEvent, [
		InventoryItemHashes.SkulkingWolfOriginTraitPlug,
		InventoryItemHashes.SkulkingWolfEnhancedOriginTraitPlug,
	]],
]

export default Task('DeepsightItemSourceDefinition', async task => {
	const DeepsightMomentDefinition = await getDeepsightMomentDefinition()
	// const DestinySeasonDefinition = await manifest.DestinySeasonDefinition.all()
	const currentSeason = Object.values(DeepsightMomentDefinition)
		.filter(moment => moment.seasonHash)
		.sort((a, b) => (b.season ?? 0) - (a.season ?? 0))
		.at(0)!

	// Log.info('Season:', currentSeason.displayProperties.name)
	const watermark = currentSeason.iconWatermark
	const DestinyInventoryItemDefinition = await manifest.DestinyInventoryItemDefinition.all()
	const seasonItems = await manifest.DestinyInventoryItemDefinition
		.filter(item => item.iconWatermark === watermark)
		.toArray()

	async function getSeasonVendorEngrams (name: string) {
		name = name.toLowerCase()
		const vendors = await manifest.DestinyVendorDefinition
			.filter(vendor => vendor.displayProperties.name.toLowerCase().includes(name))
			.toArray()

		const vendorsFromSeason = vendors.filter(vendor => vendor.itemList?.some(item => seasonItems.some(seasonItem => seasonItem.hash === item.itemHash)))
		return vendorsFromSeason.length ? vendorsFromSeason : vendors
	}

	async function getVendorEngrams (source: DeepsightItemSourceType) {
		const engrams = await getSeasonVendorEngrams('')
		const result: DestinyVendorDefinition[] = []
		for (const engram of engrams)
			if (matchesSingleSource(engram))
				result.push(engram)
		return result

		function matchesSingleSource (engram: DestinyVendorDefinition) {
			const matchingSources: DeepsightItemSourceType[] = []
			for (const [source, plugHashes] of ORIGIN_TRAITS) {
				const includesPlug = engram.itemList
					.flatMap(item => Object.values(DestinyInventoryItemDefinition[item.itemHash]?.sockets?.socketEntries ?? {}).map(socket => socket.singleInitialItemHash))
					.some(plugHash => plugHashes.includes(plugHash))

				if (includesPlug)
					matchingSources.push(source)
			}
			return matchingSources.length === 1 && matchingSources[0] === source
		}
	}

	async function getExoticArmourForMoment (moment: MomentHashes) {
		return await Promise.resolve(manifest.DestinyInventoryItemDefinition.filter(item => true
			&& item.inventory?.tierTypeHash === ItemTierTypeHashes.Exotic
			&& item.iconWatermark === DeepsightMomentDefinition[moment].iconWatermark
			&& !!item.itemCategoryHashes?.includes(ItemCategoryHashes.Armor)
			&& !item.itemCategoryHashes.includes(ItemCategoryHashes.Dummies)
		).toArray())
			.then(items => items.map(item => item.hash))
	}

	interface ItemSourceDefinition extends Omit<DeepsightItemSourceDefinition, 'hash' | 'displayProperties'> {
		items: PromiseOr<InventoryItemHashes[] | VendorCategoryTuple[] | DestinyVendorDefinition[]>
		displayProperties: PromiseOr<DeepsightDisplayPropertiesDefinition>
	}

	const itemSourceDefs: Record<DeepsightItemSourceType, ItemSourceDefinition> = {

		////////////////////////////////////
		//#region Tower Vendors

		[DeepsightItemSourceType.CommanderZavalaLegacyGear]: {
			items: getVendorCategories(VendorHashes.VanguardEngramFocusingLegacy)
				.then(categories => categories.filter(([category]) => category.identifier !== 'category_legacy_nightfall')),
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TitanVanguard },
				subtitle: { DestinyVendorDefinition: VendorHashes.VanguardEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.TitanVanguard },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TitanVanguard, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.LordShaxxLegacyGear]: {
			items: getVendorCategories(VendorHashes.CrucibleEngramFocusingLegacy),
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Crucible },
				subtitle: { DestinyVendorDefinition: VendorHashes.CrucibleEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.Crucible },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Crucible, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.DrifterLegacyGear]: {
			items: getVendorCategories(VendorHashes.GambitEngramFocusingLegacy),
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gambit },
				subtitle: { DestinyVendorDefinition: VendorHashes.GambitEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.Gambit },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gambit, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.Saint14LegacyGear]: {
			items: getVendorCategories(VendorHashes.TrialsEngramFocusingLegacy),
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TowerSaint14 },
				subtitle: { DestinyVendorDefinition: VendorHashes.TrialsEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.TowerSaint14 },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TowerSaint14, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.ExoticKioskLegacyGear]: {
			items: getVendorCategories(VendorHashes.TowerExoticArchivePinnacle),
			category: DeepsightItemSourceCategory.Vendor,
			event: EventCardHashes.IronBanner,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.IronBanner },
				subtitle: { DestinyVendorDefinition: VendorHashes.IronBannerEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.IronBanner },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.IronBanner, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.BansheeFocusedDecoding]: {
			items: getVendorCategories(VendorHashes.GunsmithFocusedDecoding),
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				subtitle: { DestinyVendorDefinition: VendorHashes.GunsmithFocusedDecoding },
				description: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gunsmith, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.BansheeFeatured]: {
			items: getVendorCategories(VendorHashes.Gunsmith)
				.then(categories => categories.filter(([category]) => category.identifier === 'category_weapon_meta')),
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				subtitle: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				description: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gunsmith, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.XurStrangeGear]: {
			items: getVendorCategories(VendorHashes.TowerNineGear),
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TowerNine },
				subtitle: { DestinyVendorDefinition: VendorHashes.TowerNineGear },
				description: { DestinyVendorDefinition: VendorHashes.TowerNine },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TowerNine, property: 'mapIcon' } },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Portal

		[DeepsightItemSourceType.VanguardOpsActivityReward]: {
			items: getVendorEngrams(DeepsightItemSourceType.VanguardOpsActivityReward),
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
				description: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
				icon: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
			}),
		},
		[DeepsightItemSourceType.PinnacleOps]: {
			items: getVendorEngrams(DeepsightItemSourceType.PinnacleOps),
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.PinnacleOps },
				description: { DestinyActivityDefinition: ActivityHashes.PinnacleOps },
				icon: { DestinyActivityDefinition: ActivityHashes.StarcrossedCustomize },
			}),
		},
		[DeepsightItemSourceType.CrucibleOpsActivityReward]: {
			items: getVendorEngrams(DeepsightItemSourceType.CrucibleOpsActivityReward),
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyFireteamFinderActivityGraphDefinition: FireteamFinderActivityGraphHashes.CrucibleOps },
				description: { DestinyFireteamFinderActivityGraphDefinition: FireteamFinderActivityGraphHashes.CrucibleOps },
				icon: { DestinyActivityDefinition: ActivityHashes.CuttingEdgeRumbleMatchmade },
			}),
		},
		[DeepsightItemSourceType.TrialsOfOsiris]: {
			items: getSeasonVendorEngrams('Trials of Osiris Gear'),
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.TrialsOfOsiris1114325415 },
				description: { DestinyActivityDefinition: ActivityHashes.TrialsOfOsiris1114325415 },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.TrialsOfOsiris },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Events

		[DeepsightItemSourceType.ArmsWeekEvent]: {
			items: getSeasonVendorEngrams('Arms Week').then(engrams => getVendorCategories(engrams, VendorHashes.TowerShootingRangeAda)),
			category: DeepsightItemSourceCategory.EventVendor,
			event: EventCardHashes.ArmsWeek,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.ArmsWeek },
				subtitle: { DestinyVendorDefinition: { hash: VendorHashes.TowerShootingRangeAda, property: 'name' } },
				icon: { DestinyEventCardDefinition: EventCardHashes.ArmsWeek },
			}),
		},
		[DeepsightItemSourceType.SolsticeEvent]: {
			items: getSeasonVendorEngrams('Solstice'),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.Solstice,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.Solstice },
				icon: { DestinyEventCardDefinition: EventCardHashes.Solstice },
			}),
		},
		[DeepsightItemSourceType.HeavyMetalEvent]: {
			items: getSeasonVendorEngrams('Heavy Metal'),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.HeavyMetal,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.HeavyMetal },
				icon: { DestinyEventCardDefinition: EventCardHashes.HeavyMetal },
			}),
		},
		[DeepsightItemSourceType.IronBannerEvent]: {
			items: Promise.all([getSeasonVendorEngrams('Iron Banner'), getVendorEngrams(DeepsightItemSourceType.IronBannerEvent)]).then(engrams => engrams.flat()),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.IronBanner,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.IronBanner },
				icon: { DestinyEventCardDefinition: EventCardHashes.IronBanner },
			}),
		},
		[DeepsightItemSourceType.ValusSaladinLegacyGear]: {
			items: getVendorCategories(VendorHashes.IronBannerEngramFocusingLegacy),
			category: DeepsightItemSourceCategory.Vendor,
			event: EventCardHashes.IronBanner,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.IronBanner },
				subtitle: { DestinyVendorDefinition: VendorHashes.IronBannerEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.IronBanner },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.IronBanner, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.FestivalOfTheLost]: {
			items: getSeasonVendorEngrams('Eerie Weapons'),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.FestivalOfTheLost,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.FestivalOfTheLost },
				icon: { DestinyEventCardDefinition: EventCardHashes.FestivalOfTheLost },
			}),
		},
		[DeepsightItemSourceType.CallToArmsEvent]: {
			items: getSeasonVendorEngrams('Call to Arms'),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.CallToArms,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.CallToArms },
				icon: { DestinyEventCardDefinition: EventCardHashes.CallToArms },
			}),
		},
		[DeepsightItemSourceType.TheDawning]: {
			items: getSeasonVendorEngrams('Dawning').then(vendors => vendors.filter(vendor => vendor.hash !== VendorHashes.DawningEngram)),
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.TheDawning,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.TheDawning },
				icon: { DestinyEventCardDefinition: EventCardHashes.TheDawning },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Campaigns

		[DeepsightItemSourceType.Kepler]: {
			items: resolveSources(
				getVendorCategories(VendorHashes.FocusedDecoding3550596112),
				[InventoryItemHashes.GravitonSpikeHandCannon],
			),
			category: DeepsightItemSourceCategory.Destination,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyPresentationNodeDefinition: PresentationNodeHashes.Kepler },
				subtitle: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
				icon: { DestinyPresentationNodeDefinition: { hash: PresentationNodeHashes.Kepler, iconSequence: 1, frame: 0 } },
			}),
		},
		[DeepsightItemSourceType.TheEdgeOfFate]: {
			items: getExoticArmourForMoment(MomentHashes.EdgeOfFate),
			category: DeepsightItemSourceCategory.Campaign,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Campaign_PlaceHash2961497387 },
				icon: { DestinyPresentationNodeDefinition: { hash: PresentationNodeHashes.Kepler, iconSequence: 1, frame: 0 } },
			}),
		},
		[DeepsightItemSourceType.Renegades]: {
			items: getExoticArmourForMoment(MomentHashes.Renegades),
			category: DeepsightItemSourceCategory.Campaign,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.Renegades },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Campaign_PlaceHash2961497387 },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
			}),
		},
		[DeepsightItemSourceType.LawlessFrontier]: {
			items: getSeasonVendorEngrams('Lawless Frontier'),
			category: DeepsightItemSourceCategory.Destination,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Renegades },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Seasons

		[DeepsightItemSourceType.SeasonReclamation]: {
			items: [InventoryItemHashes.ThirdIterationScoutRifle, InventoryItemHashes.NewMalpaisPulseRifle],
			category: DeepsightItemSourceCategory.SeasonPass,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinySeasonPassDefinition: SeasonPassHashes.Reclamation },
				icon: { DestinySeasonPassDefinition: SeasonPassHashes.Reclamation },
			}),
		},
		[DeepsightItemSourceType.SeasonLawless]: {
			items: [InventoryItemHashes.ServiceOfLuzakuMachineGun],
			category: DeepsightItemSourceCategory.SeasonPass,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinySeasonPassDefinition: SeasonPassHashes.Lawless_ColorObjectLength4 },
				icon: { DestinySeasonPassDefinition: SeasonPassHashes.Lawless_ColorObjectLength4 },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Exotic Missions

		[DeepsightItemSourceType.Heliostat]: {
			items: [InventoryItemHashes.WolfsbaneSword],
			category: DeepsightItemSourceCategory.ExoticMission,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: { hash: ActivityHashes.HeliostatCustomize1402745928, property: ['originalDisplayProperties', 'name'] } },
				subtitle: { DestinyActivityDefinition: { hash: ActivityHashes.HeliostatCustomize1402745928, property: ['originalDisplayProperties', 'description'] } },
				icon: { DestinySeasonPassDefinition: SeasonPassHashes.Reclamation },
			}),
		},
		[DeepsightItemSourceType.FireAndIce]: {
			items: [InventoryItemHashes.PraxicBladeSword],
			category: DeepsightItemSourceCategory.ExoticMission,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: { hash: ActivityHashes.FireAndIceBrave, property: ['originalDisplayProperties', 'name'] } },
				subtitle: { DestinyActivityDefinition: { hash: ActivityHashes.FireAndIceBrave, property: ['originalDisplayProperties', 'description'] } },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
			}),
		},

		//#endregion
		////////////////////////////////////

		////////////////////////////////////
		//#region Raids & Dungeons

		[DeepsightItemSourceType.TheDesertPerpetual]: {
			items: resolveSources(
				getVendorCategories(VendorHashes.TheDesertPerpetualGear1522421872),
				[InventoryItemHashes.WhirlingOvationRocketLauncher],
			),
			category: DeepsightItemSourceCategory.Raid,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: { hash: ActivityHashes.TheDesertPerpetualStandard, property: ['originalDisplayProperties', 'name'] } },
				subtitle: { DestinyActivityDefinition: { hash: ActivityHashes.TheDesertPerpetualStandard, property: ['originalDisplayProperties', 'description'] } },
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.FrameOfReferenceOriginTraitPlug },
			}),
		},
		[DeepsightItemSourceType.TheDesertPerpetualEpic]: {
			items: resolveSources(
				getVendorCategories(VendorHashes.TheDesertPerpetualGear1310497352),
				[InventoryItemHashes.WhirlingOvationRocketLauncher],
			),
			category: DeepsightItemSourceCategory.Raid,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: { hash: ActivityHashes.TheDesertPerpetualEpicStandard, property: ['originalDisplayProperties', 'name'] } },
				subtitle: { DestinyActivityDefinition: { hash: ActivityHashes.TheDesertPerpetualEpicStandard, property: ['originalDisplayProperties', 'description'] } },
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.FrameOfReferenceOriginTraitPlug },
			}),
		},
		[DeepsightItemSourceType.Equilibrium]: {
			items: resolveSources(
				getSeasonVendorEngrams('Equilibrium'),
				[InventoryItemHashes.HeirloomCombatBow],
			),
			category: DeepsightItemSourceCategory.Dungeon,
			displayProperties: DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: { hash: ActivityHashes.EquilibriumStandard, property: ['originalDisplayProperties', 'name'] } },
				subtitle: { DestinyActivityDefinition: { hash: ActivityHashes.EquilibriumStandard, property: ['originalDisplayProperties', 'description'] } },
				icon: { DestinyInventoryItemDefinition: InventoryItemHashes.ImperialAllegianceOriginTraitPlug },
			}),
		},

		//#endregion
		////////////////////////////////////

	}

	async function resolveSources (...sources: PromiseOr<InventoryItemHashes[] | VendorCategoryTuple[] | DestinyVendorDefinition[]>[]) {
		return await Promise.all(sources.map(resolveSource)).then(items => items.flat())
	}

	async function resolveSource (sources: PromiseOr<InventoryItemHashes[] | VendorCategoryTuple[] | DestinyVendorDefinition[]>) {
		const items = await sources
		if (!items.length)
			return []

		if (typeof items[0] === 'number')
			return items as InventoryItemHashes[]

		if (Array.isArray(items[0]))
			return getVendorCategoryItems(items as VendorCategoryTuple[])

		return getVendorCategories(items as DestinyVendorDefinition[])
			.then(getVendorCategoryItems)
	}

	const itemSources = await Object.entries(itemSourceDefs)
		.map(async ([type, def]) => [
			+type as DeepsightItemSourceType,
			await resolveSource(def.items),
		] as const)
		.collect(promises => Promise.all(promises).then(entries => Object.fromEntries(entries) as Record<DeepsightItemSourceType, InventoryItemHashes[]>))

	itemSources[DeepsightItemSourceType.CrucibleOpsActivityReward] = itemSources[DeepsightItemSourceType.CrucibleOpsActivityReward]
		.filter(item => !itemSources[DeepsightItemSourceType.TrialsOfOsiris].includes(item))

	const items = new Set(Object.values(itemSources).flat())

	const DeepsightItemSourceListDefinition: Record<number, DeepsightItemSourceListDefinition> = {}

	for (const itemHash of items) {
		DeepsightItemSourceListDefinition[itemHash] = {
			hash: itemHash,
			sources: (Object.entries(itemSources)
				.filter(([, items]) => items.includes(itemHash))
				.map(([type]) => +type as DeepsightItemSourceType)
			),
		}
	}

	const DeepsightItemSourceDefinition = await Object.entries(itemSourceDefs)
		.map(async ([type, def]) => [+type as DeepsightItemSourceType, {
			hash: +type as DeepsightItemSourceType,
			...def,
			displayProperties: await def.displayProperties,
			items: undefined,
		} as DeepsightItemSourceDefinition] as const)
		.collect(promises => Promise.all(promises).then(entries => Object.fromEntries(entries) as Record<DeepsightItemSourceType, DeepsightItemSourceDefinition>))

	await fs.mkdir('docs', { recursive: true })
	await fs.writeJson('docs/definitions/DeepsightItemSourceListDefinition.json', DeepsightItemSourceListDefinition, { spaces: '\t' })
	await fs.writeJson('docs/definitions/DeepsightItemSourceDefinition.json', DeepsightItemSourceDefinition, { spaces: '\t' })
})
