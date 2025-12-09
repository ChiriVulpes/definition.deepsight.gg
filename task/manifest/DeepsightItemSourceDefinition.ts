import type { ActivityGraphHashes } from '@deepsight.gg/Enums'
import { ActivityHashes, ActivityModeHashes, EventCardHashes, FireteamFinderActivityGraphHashes, InventoryItemHashes, ItemCategoryHashes, ItemTierTypeHashes, MomentHashes, PresentationNodeHashes, VendorHashes } from '@deepsight.gg/Enums'
import type { DeepsightItemSourceDefinition } from '@deepsight.gg/Interfaces'
import { DeepsightItemSourceCategory, DeepsightItemSourceType, type DeepsightItemSourceListDefinition } from '@deepsight.gg/Interfaces'
import type { DestinyActivityDefinition, DestinyDisplayCategoryDefinition, DestinyVendorDefinition } from 'bungie-api-ts/destiny2/interfaces'
import fs from 'fs-extra'
import { Task } from 'task'
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

	const itemSources: Record<DeepsightItemSourceType, number[]> = {
		[DeepsightItemSourceType.CommanderZavalaLegacyGear]: await getVendorCategories(VendorHashes.VanguardEngramFocusingLegacy)
			.then(categories => categories.filter(([category]) => category.identifier !== 'category_legacy_nightfall'))
			.then(getVendorCategoryItems),
		[DeepsightItemSourceType.LordShaxxLegacyGear]: await getVendorCategories(VendorHashes.CrucibleEngramFocusingLegacy).then(getVendorCategoryItems),
		[DeepsightItemSourceType.DrifterLegacyGear]: await getVendorCategories(VendorHashes.GambitEngramFocusingLegacy).then(getVendorCategoryItems),
		[DeepsightItemSourceType.Saint14LegacyGear]: await getVendorCategories(VendorHashes.TrialsEngramFocusingLegacy).then(getVendorCategoryItems),
		[DeepsightItemSourceType.ExoticKioskLegacyGear]: await getVendorCategories(VendorHashes.TowerExoticArchivePinnacle).then(getVendorCategoryItems),
		[DeepsightItemSourceType.BansheeFocusedDecoding]: await getVendorCategories(VendorHashes.GunsmithFocusedDecoding).then(getVendorCategoryItems),
		[DeepsightItemSourceType.BansheeFeatured]: await getVendorCategories(VendorHashes.Gunsmith)
			.then(categories => categories.filter(([category]) => category.identifier === 'category_weapon_meta'))
			.then(getVendorCategoryItems),
		[DeepsightItemSourceType.XurStrangeGear]: await getVendorCategories(VendorHashes.TowerNineGear).then(getVendorCategoryItems),
		[DeepsightItemSourceType.VanguardOpsActivityReward]: await getVendorEngrams(DeepsightItemSourceType.VanguardOpsActivityReward).then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.PinnacleOps]: await getVendorEngrams(DeepsightItemSourceType.PinnacleOps).then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.CrucibleOpsActivityReward]: await getVendorEngrams(DeepsightItemSourceType.CrucibleOpsActivityReward).then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.TrialsOfOsiris]: await getSeasonVendorEngrams('Trials of Osiris Gear').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.ArmsWeekEvent]: await getVendorCategories(VendorHashes.TowerShootingRangeAda, await getSeasonVendorEngrams('Arms Week')).then(getVendorCategoryItems),
		[DeepsightItemSourceType.SolsticeEvent]: await getSeasonVendorEngrams('Solstice').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.Kepler]: await getVendorCategories(VendorHashes.FocusedDecoding3550596112).then(getVendorCategoryItems),
		[DeepsightItemSourceType.HeavyMetalEvent]: await getSeasonVendorEngrams('Heavy Metal').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.IronBannerEvent]: await Promise.all([getSeasonVendorEngrams('Iron Banner'), getVendorEngrams(DeepsightItemSourceType.IronBannerEvent)]).then(engrams => engrams.flat()).then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.ValusSaladinLegacyGear]: await getVendorCategories(VendorHashes.IronBannerEngramFocusingLegacy).then(getVendorCategoryItems),
		[DeepsightItemSourceType.FestivalOfTheLost]: await getSeasonVendorEngrams('Eerie Weapons').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.CallToArmsEvent]: await getSeasonVendorEngrams('Call to Arms').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.LawlessFrontier]: await getSeasonVendorEngrams('Lawless Frontier').then(getVendorCategories).then(getVendorCategoryItems),
		[DeepsightItemSourceType.TheEdgeOfFate]: await getExoticArmourForMoment(MomentHashes.EdgeOfFate),
		[DeepsightItemSourceType.Renegades]: await getExoticArmourForMoment(MomentHashes.Renegades),
	}

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

	const DeepsightItemSourceDefinition: Record<DeepsightItemSourceType, DeepsightItemSourceDefinition> = {
		[DeepsightItemSourceType.CommanderZavalaLegacyGear]: {
			hash: DeepsightItemSourceType.CommanderZavalaLegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TitanVanguard },
				subtitle: { DestinyVendorDefinition: VendorHashes.VanguardEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.TitanVanguard },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TitanVanguard, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.LordShaxxLegacyGear]: {
			hash: DeepsightItemSourceType.LordShaxxLegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Crucible },
				subtitle: { DestinyVendorDefinition: VendorHashes.CrucibleEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.Crucible },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Crucible, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.DrifterLegacyGear]: {
			hash: DeepsightItemSourceType.DrifterLegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gambit },
				subtitle: { DestinyVendorDefinition: VendorHashes.GambitEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.Gambit },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gambit, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.Saint14LegacyGear]: {
			hash: DeepsightItemSourceType.Saint14LegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TowerSaint14 },
				subtitle: { DestinyVendorDefinition: VendorHashes.TrialsEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.TowerSaint14 },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TowerSaint14, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.ValusSaladinLegacyGear]: {
			hash: DeepsightItemSourceType.ValusSaladinLegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			event: EventCardHashes.IronBanner,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.IronBanner },
				subtitle: { DestinyVendorDefinition: VendorHashes.IronBannerEngramFocusingLegacy },
				description: { DestinyVendorDefinition: VendorHashes.IronBanner },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.IronBanner, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.ExoticKioskLegacyGear]: {
			hash: DeepsightItemSourceType.ExoticKioskLegacyGear,
			category: DeepsightItemSourceCategory.Vendor,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TowerExoticArchive },
				subtitle: { DestinyVendorDefinition: VendorHashes.TowerExoticArchive },
				description: { DestinyVendorDefinition: VendorHashes.TowerExoticArchive },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TowerExoticArchive, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.BansheeFocusedDecoding]: {
			hash: DeepsightItemSourceType.BansheeFocusedDecoding,
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				subtitle: { DestinyVendorDefinition: VendorHashes.GunsmithFocusedDecoding },
				description: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gunsmith, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.BansheeFeatured]: {
			hash: DeepsightItemSourceType.BansheeFeatured,
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				subtitle: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				description: { DestinyVendorDefinition: VendorHashes.Gunsmith },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.Gunsmith, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.XurStrangeGear]: {
			hash: DeepsightItemSourceType.XurStrangeGear,
			category: DeepsightItemSourceCategory.Vendor,
			rotates: true,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyVendorDefinition: VendorHashes.TowerNine },
				subtitle: { DestinyVendorDefinition: VendorHashes.TowerNineGear },
				description: { DestinyVendorDefinition: VendorHashes.TowerNine },
				icon: { DestinyVendorDefinition: { hash: VendorHashes.TowerNine, property: 'mapIcon' } },
			}),
		},
		[DeepsightItemSourceType.VanguardOpsActivityReward]: {
			hash: DeepsightItemSourceType.VanguardOpsActivityReward,
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
				description: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
				icon: { DestinyActivityDefinition: ActivityHashes.VanguardOps },
			}),
		},
		[DeepsightItemSourceType.PinnacleOps]: {
			hash: DeepsightItemSourceType.PinnacleOps,
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.PinnacleOps },
				description: { DestinyActivityDefinition: ActivityHashes.PinnacleOps },
				icon: { DestinyActivityDefinition: ActivityHashes.StarcrossedCustomize },
			}),
		},
		[DeepsightItemSourceType.CrucibleOpsActivityReward]: {
			hash: DeepsightItemSourceType.CrucibleOpsActivityReward,
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyFireteamFinderActivityGraphDefinition: FireteamFinderActivityGraphHashes.CrucibleOps },
				description: { DestinyFireteamFinderActivityGraphDefinition: FireteamFinderActivityGraphHashes.CrucibleOps },
				icon: { DestinyActivityDefinition: ActivityHashes.CuttingEdgeRumbleMatchmade_DurationEstimateObjectLength3 },
			}),
		},
		[DeepsightItemSourceType.TrialsOfOsiris]: {
			hash: DeepsightItemSourceType.TrialsOfOsiris,
			category: DeepsightItemSourceCategory.ActivityReward,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.TrialsOfOsiris1114325415 },
				description: { DestinyActivityDefinition: ActivityHashes.TrialsOfOsiris1114325415 },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.TrialsOfOsiris },
			}),
		},
		[DeepsightItemSourceType.ArmsWeekEvent]: {
			hash: DeepsightItemSourceType.ArmsWeekEvent,
			category: DeepsightItemSourceCategory.EventVendor,
			event: EventCardHashes.ArmsWeek,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.ArmsWeek },
				subtitle: { DestinyVendorDefinition: { hash: VendorHashes.TowerShootingRangeAda, property: 'name' } },
				icon: { DestinyEventCardDefinition: EventCardHashes.ArmsWeek },
			}),
		},
		[DeepsightItemSourceType.SolsticeEvent]: {
			hash: DeepsightItemSourceType.SolsticeEvent,
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.Solstice,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.Solstice },
				icon: { DestinyEventCardDefinition: EventCardHashes.Solstice },
			}),
		},
		[DeepsightItemSourceType.Kepler]: {
			hash: DeepsightItemSourceType.Kepler,
			category: DeepsightItemSourceCategory.Destination,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyPresentationNodeDefinition: PresentationNodeHashes.Kepler },
				subtitle: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
				icon: { DestinyPresentationNodeDefinition: { hash: PresentationNodeHashes.Kepler, iconSequence: 1, frame: 0 } },
			}),
		},
		[DeepsightItemSourceType.TheEdgeOfFate]: {
			hash: DeepsightItemSourceType.TheEdgeOfFate,
			category: DeepsightItemSourceCategory.Campaign,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.TheEdgeOfFate_PlaceHash4076196532 },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Campaign_PlaceHash2961497387 },
				icon: { DestinyPresentationNodeDefinition: { hash: PresentationNodeHashes.Kepler, iconSequence: 1, frame: 0 } },
			}),
		},
		[DeepsightItemSourceType.HeavyMetalEvent]: {
			hash: DeepsightItemSourceType.HeavyMetalEvent,
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.HeavyMetal,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.HeavyMetal },
				icon: { DestinyEventCardDefinition: EventCardHashes.HeavyMetal },
			}),
		},
		[DeepsightItemSourceType.IronBannerEvent]: {
			hash: DeepsightItemSourceType.IronBannerEvent,
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.IronBanner,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.IronBanner },
				icon: { DestinyEventCardDefinition: EventCardHashes.IronBanner },
			}),
		},
		[DeepsightItemSourceType.FestivalOfTheLost]: {
			hash: DeepsightItemSourceType.FestivalOfTheLost,
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.FestivalOfTheLost,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.FestivalOfTheLost },
				icon: { DestinyEventCardDefinition: EventCardHashes.FestivalOfTheLost },
			}),
		},
		[DeepsightItemSourceType.CallToArmsEvent]: {
			hash: DeepsightItemSourceType.CallToArmsEvent,
			category: DeepsightItemSourceCategory.EventReward,
			event: EventCardHashes.CallToArms,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyEventCardDefinition: EventCardHashes.CallToArms },
				icon: { DestinyEventCardDefinition: EventCardHashes.CallToArms },
			}),
		},
		[DeepsightItemSourceType.LawlessFrontier]: {
			hash: DeepsightItemSourceType.LawlessFrontier,
			category: DeepsightItemSourceCategory.Destination,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Renegades_PlaceHash3747705955 },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
			}),
		},
		[DeepsightItemSourceType.Renegades]: {
			hash: DeepsightItemSourceType.Renegades,
			category: DeepsightItemSourceCategory.Campaign,
			displayProperties: await DestinyManifestReference.resolveAll({
				name: { DestinyActivityDefinition: ActivityHashes.Renegades_PlaceHash3747705955 },
				subtitle: { DestinyActivityDefinition: ActivityHashes.Campaign_PlaceHash2961497387 },
				icon: { DestinyActivityModeDefinition: ActivityModeHashes.LawlessFrontier },
			}),
		},
	}

	await fs.mkdir('docs', { recursive: true })
	await fs.writeJson('docs/definitions/DeepsightItemSourceListDefinition.json', DeepsightItemSourceListDefinition, { spaces: '\t' })
	await fs.writeJson('docs/definitions/DeepsightItemSourceDefinition.json', DeepsightItemSourceDefinition, { spaces: '\t' })
})
