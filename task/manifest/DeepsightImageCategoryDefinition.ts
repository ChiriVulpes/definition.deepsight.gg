import { DeepsightImageCategory, DeepsightImageFraming, type DeepsightImageCategoryDefinition } from '@deepsight.gg/Interfaces'
import fs from 'fs-extra'
import path from 'path'
import { Task } from 'task'
import DestinyManifest from './utility/endpoint/DestinyManifest'

export interface ImageCategoryPathDefinition {
	readonly component: string
	readonly path: string
}

interface DiscoveredImagePath extends ImageCategoryPathDefinition {
	readonly count: number
	readonly samples: readonly string[]
}

type ImageCategoryPathMap = Record<DeepsightImageCategory, readonly ImageCategoryPathDefinition[]>
type MutableDiscoveredImagePathMap = Map<string, {
	component: string
	path: string
	count: number
	samples: Set<string>
}>

const MANUAL_IMAGE_CATEGORY_PATHS = {
	[DeepsightImageCategory.PgcrImage]: [
		{ component: 'DeepsightDropTableDefinition', path: 'pgcrImage' },
	],
	[DeepsightImageCategory.Iconography]: [
		{ component: 'DeepsightDropTableDefinition', path: 'displayProperties.icon' },
	],
	[DeepsightImageCategory.Icon]: [
		{ component: 'DeepsightDropTableDefinition', path: 'displayProperties.icon' },
	],
	[DeepsightImageCategory.Screenshot]: [
		{ component: 'DeepsightMomentDefinition', path: 'primaryImage' },
		{ component: 'DeepsightMomentDefinition', path: 'images.[]' },
		{ component: 'DeepsightWallpaperDefinition', path: 'wallpapers.[]' },
		{ component: 'DeepsightWallpaperDefinition', path: 'secondaryWallpapers.[]' },
	],
	[DeepsightImageCategory.Watermark]: [
		{ component: 'DeepsightIconDefinition', path: 'background' },
		{ component: 'DeepsightIconDefinition', path: 'secondaryBackground' },
		{ component: 'DeepsightIconDefinition', path: 'specialBackground' },
		{ component: 'DeepsightMomentDefinition', path: 'iconWatermark' },
		{ component: 'DeepsightMomentDefinition', path: 'iconWatermarkShelved' },
		{ component: 'DeepsightMomentDefinition', path: 'iconWatermarkFeatured' },
		{ component: 'DeepsightMomentDefinition', path: 'subsumeIconWatermarks.[]' },
	],
	[DeepsightImageCategory.Placeholder]: [],
} as const satisfies ImageCategoryPathMap

const IMAGE_CATEGORY_FRAMING = {
	[DeepsightImageCategory.PgcrImage]: DeepsightImageFraming.CropSafe,
	[DeepsightImageCategory.Iconography]: DeepsightImageFraming.Complete,
	[DeepsightImageCategory.Icon]: DeepsightImageFraming.Complete,
	[DeepsightImageCategory.Screenshot]: DeepsightImageFraming.CropSafe,
	[DeepsightImageCategory.Watermark]: DeepsightImageFraming.Complete,
	[DeepsightImageCategory.Placeholder]: DeepsightImageFraming.Complete,
} as const satisfies Record<DeepsightImageCategory, DeepsightImageFraming>

const ITEM_ICON_PATHS = new Set([
	'displayProperties.icon',
	'displayProperties.highResIcon',
	'displayProperties.iconSequences.[].frames.[]',
	'secondaryIcon',
	'plug.parentItemOverride.pipIcon',
])

const ITEM_ICON_COMPONENTS = new Set([
	'DestinyInventoryItemDefinition',
	'DestinyInventoryItemLiteDefinition',
])

const COLLECTIBLE_ICON_PATHS = new Set([
	'displayProperties.icon',
	'displayProperties.highResIcon',
	'displayProperties.iconSequences.[].frames.[]',
])

const DESTINY_ICON_LAYER_PATHS = new Set([
	'background',
	'secondaryBackground',
	'specialBackground',
])

const DESTINY_ICON_FOREGROUND_PATHS = new Set([
	'foreground',
	'highResForeground',
])

const GENERATED_ICON_FOREGROUND_PATHS = new Set([
	'foreground',
	'highResForeground',
])

const DEEPSIGHT_IMAGE_DISCOVERY_EXCLUDED_COMPONENTS = new Set([
	'DeepsightImageAnalysisDefinition',
	'DeepsightImageCategoryDefinition',
	'DeepsightLinksDefinition',
])

const SCREENSHOT_PATHS = new Set([
	'DestinyInventoryItemDefinition.screenshot',
	'DestinyInventoryItemDefinition.secondarySpecial',
	'DestinyInventoryItemLiteDefinition.screenshot',
	'DestinyInventoryItemLiteDefinition.secondarySpecial',
	'DestinyVendorDefinition.displayProperties.largeIcon',
	'DestinyVendorDefinition.locations.[].backgroundImagePath',
	'DestinyFactionDefinition.vendors.[].backgroundImagePath',
	'DestinySeasonDefinition.backgroundImagePath',
	'DestinySeasonDefinition.preview.images.[].highResImage',
	'DestinySeasonDefinition.preview.images.[].thumbnailImage',
	'DestinySeasonPassDefinition.images.themeBackgroundImagePath',
	'DestinyEventCardDefinition.images.themeBackgroundImagePath',
	'DestinyGlobalConstantsDefinition.questItemTraitToFeaturedQuestImagePath.{}',
	'DestinyMilestoneDefinition.image',
	'DeepsightEmblemDefinition.secondarySpecial',
	'DeepsightMomentDefinition.primaryImage',
	'DeepsightMomentDefinition.images.[]',
	'DeepsightWallpaperDefinition.wallpapers.[]',
	'DeepsightWallpaperDefinition.secondaryWallpapers.[]',
])

const ICONOGRAPHY_PATHS = new Set([
	'DeepsightDropTableDefinition.typeDisplayProperties.icon',
	'DeepsightEmblemDefinition.secondaryOverlay',
	'DeepsightWeaponFoundryDefinition.overlay',
	'DestinyActivityDefinition.releaseIcon',
	'DestinyActivityDefinition.originalDisplayProperties.icon',
	'DestinyActivityDefinition.originalDisplayProperties.highResIcon',
	'DestinyActivityDefinition.selectionScreenDisplayProperties.icon',
	'DestinyActivityDefinition.selectionScreenDisplayProperties.highResIcon',
	'DestinyVendorDefinition.displayProperties.mapIcon',
	'DestinyVendorDefinition.displayProperties.originalIcon',
	'DestinyVendorDefinition.displayProperties.smallTransparentIcon',
	'DestinyVendorDefinition.displayProperties.largeTransparentIcon',
	'DestinyVendorDefinition.displayProperties.requirementsDisplay.[].icon',
	'DestinyVendorDefinition.displayCategories.[].displayProperties.icon',
	'DestinyVendorDefinition.displayCategories.[].displayProperties.iconSequences.[].frames.[]',
	'DestinyVendorDefinition.interactions.[].headerDisplayProperties.icon',
	'DestinyVendorDefinition.interactions.[].headerDisplayProperties.iconSequences.[].frames.[]',
	'DestinyVendorDefinition.categories.[].overlay.icon',
	'DestinyVendorDefinition.originalCategories.[].overlay.icon',
	'DestinyInventoryItemDefinition.secondaryOverlay',
	'DestinyInventoryItemLiteDefinition.secondaryOverlay',
	'DestinyInventoryItemConstantsDefinition.craftedBackgroundPath',
	'DestinyInventoryItemConstantsDefinition.craftedOverlayPath',
	'DestinyInventoryItemConstantsDefinition.enhancedItemOverlayPath',
	'DestinyInventoryItemConstantsDefinition.featuredItemFlagPath',
	'DestinyInventoryItemConstantsDefinition.gearTierOverlayImagePaths.[]',
	'DestinyInventoryItemConstantsDefinition.holofoil900BackgroundOverlayPath',
	'DestinyInventoryItemConstantsDefinition.holofoilBackgroundOverlayPath',
	'DestinyInventoryItemConstantsDefinition.masterworkBorderedOverlayPath',
	'DestinyInventoryItemConstantsDefinition.masterworkExoticBorderedOverlayPath',
	'DestinyInventoryItemConstantsDefinition.masterworkExoticOverlayPath',
	'DestinyInventoryItemConstantsDefinition.masterworkOverlayPath',
	'DestinyInventoryItemConstantsDefinition.universalOrnamentBackgroundOverlayPath',
	'DestinyInventoryItemConstantsDefinition.universalOrnamentExoticBackgroundOverlayPath',
	'DestinyInventoryItemConstantsDefinition.universalOrnamentLegendaryBackgroundOverlayPath',
	'DestinyLocationDefinition.locationReleases.[].mapIcon',
	'DestinyLocationDefinition.locationReleases.[].smallTransparentIcon',
	'DestinyLocationDefinition.locationReleases.[].largeTransparentIcon',
	'DestinyDamageTypeDefinition.transparentIconPath',
	'DestinyGuardianRankDefinition.foregroundImagePath',
	'DestinyGuardianRankDefinition.overlayImagePath',
	'DestinyGuardianRankDefinition.overlayMaskImagePath',
	'DestinyGlobalConstantsDefinition.destinySeasonalHubRankIconImages.seasonalHubRankIconActive',
	'DestinyGlobalConstantsDefinition.destinySeasonalHubRankIconImages.seasonalHubRankIconEarning',
	'DestinyGlobalConstantsDefinition.destinySeasonalHubRankIconImages.seasonalHubRankIconUnearned',
	'DestinyGlobalConstantsDefinition.portalActivityGraphRootNodesWithIcons.{}',
	'DestinyProgressionDefinition.steps.[].icon',
	'DestinyLoadoutIconDefinition.iconImagePath',
	'DestinyLoadoutColorDefinition.colorImagePath',
	'DestinyLoadoutConstantsDefinition.blackIconImagePath',
	'DestinyLoadoutConstantsDefinition.whiteIconImagePath',
	'DestinySocialCommendationDefinition.displayActivities.[].icon',
	'DestinySocialCommendationDefinition.cardImagePath',
	'DestinySocialCommendationNodeDefinition.tintedIcon',
])

let imageCategoryPathsPromise: Promise<ImageCategoryPathMap> | undefined
let imageAnalysisCategoryPathsPromise: Promise<ImageCategoryPathMap> | undefined

export async function getImageCategoryPaths (): Promise<ImageCategoryPathMap> {
	return imageCategoryPathsPromise ??= createImageCategoryPaths()
}

async function createImageCategoryPaths (): Promise<ImageCategoryPathMap> {
	const paths = mutablePathMap(MANUAL_IMAGE_CATEGORY_PATHS)
	const discovered = [
		...await discoverBungieImagePaths(),
		...await discoverDeepsightImagePaths(),
	]

	for (const imagePath of discovered) {
		const categories = categoriseImagePath(imagePath)
		for (const category of categories)
			paths[category].push(toCategoryPath(imagePath))
	}

	return sortPathMap(paths)
}

export async function getImageAnalysisCategoryPaths (): Promise<ImageCategoryPathMap> {
	return imageAnalysisCategoryPathsPromise ??= createImageAnalysisCategoryPaths()
}

async function createImageAnalysisCategoryPaths (): Promise<ImageCategoryPathMap> {
	const sourcePaths = await getImageCategoryPaths()
	return {
		...sourcePaths,
		[DeepsightImageCategory.Placeholder]: uniquePaths(Object.entries(sourcePaths)
			.filter(([category]) => Number(category) !== DeepsightImageCategory.Placeholder)
			.flatMap(([, paths]) => paths)),
	}
}

export default Task('DeepsightImageCategoryDefinition', async () => {
	const paths = await getImageCategoryPaths()
	const output = Object.fromEntries(Object.entries(paths).map(([hash, paths]) => [
		hash,
		{
			hash: Number(hash),
			framing: IMAGE_CATEGORY_FRAMING[Number(hash) as DeepsightImageCategory],
			paths,
		} satisfies DeepsightImageCategoryDefinition,
	]))

	await fs.writeJson('docs/definitions/DeepsightImageCategoryDefinition.json', output, { spaces: '\t' })
})

function mutablePathMap (paths: ImageCategoryPathMap): Record<DeepsightImageCategory, ImageCategoryPathDefinition[]> {
	return {
		[DeepsightImageCategory.PgcrImage]: [...paths[DeepsightImageCategory.PgcrImage]],
		[DeepsightImageCategory.Iconography]: [...paths[DeepsightImageCategory.Iconography]],
		[DeepsightImageCategory.Icon]: [...paths[DeepsightImageCategory.Icon]],
		[DeepsightImageCategory.Screenshot]: [...paths[DeepsightImageCategory.Screenshot]],
		[DeepsightImageCategory.Watermark]: [...paths[DeepsightImageCategory.Watermark]],
		[DeepsightImageCategory.Placeholder]: [...paths[DeepsightImageCategory.Placeholder]],
	}
}

function sortPathMap (paths: Record<DeepsightImageCategory, ImageCategoryPathDefinition[]>): ImageCategoryPathMap {
	return {
		[DeepsightImageCategory.PgcrImage]: uniquePaths(paths[DeepsightImageCategory.PgcrImage]),
		[DeepsightImageCategory.Iconography]: uniquePaths(paths[DeepsightImageCategory.Iconography]),
		[DeepsightImageCategory.Icon]: uniquePaths(paths[DeepsightImageCategory.Icon]),
		[DeepsightImageCategory.Screenshot]: uniquePaths(paths[DeepsightImageCategory.Screenshot]),
		[DeepsightImageCategory.Watermark]: uniquePaths(paths[DeepsightImageCategory.Watermark]),
		[DeepsightImageCategory.Placeholder]: uniquePaths(paths[DeepsightImageCategory.Placeholder]),
	}
}

function uniquePaths (paths: readonly ImageCategoryPathDefinition[]) {
	return Array.from(new Map(paths
		.map(path => [`${path.component}.${path.path}`, path]))
		.values())
		.sort(comparePaths)
}

function comparePaths (a: ImageCategoryPathDefinition, b: ImageCategoryPathDefinition) {
	return a.component.localeCompare(b.component)
		|| a.path.localeCompare(b.path)
}

async function discoverBungieImagePaths (): Promise<DiscoveredImagePath[]> {
	const discovered: MutableDiscoveredImagePathMap = new Map()

	for (const component of await DestinyManifest.ALL) {
		const defs = await getDestinyDefinitions(component)
		for (const definition of Object.values(defs))
			discoverImagePathsInValue(discovered, component, definition, [])
	}

	return Array.from(discovered.values(), ({ samples, ...path }) => ({
		...path,
		samples: Array.from(samples),
	})).sort(comparePaths)
}

async function discoverDeepsightImagePaths (): Promise<DiscoveredImagePath[]> {
	const discovered: MutableDiscoveredImagePathMap = new Map()
	const definitionDirectory = 'docs/definitions'
	if (!await fs.pathExists(definitionDirectory))
		return []

	const definitionFiles = await fs.readdir(definitionDirectory)
	for (const definitionFile of definitionFiles) {
		if (!definitionFile.startsWith('Deepsight') || !definitionFile.endsWith('Definition.json'))
			continue

		const component = path.basename(definitionFile, '.json')
		if (DEEPSIGHT_IMAGE_DISCOVERY_EXCLUDED_COMPONENTS.has(component))
			continue

		const defs = await fs.readJson(path.join(definitionDirectory, definitionFile)).catch(() => undefined) as unknown
		if (!defs || typeof defs !== 'object')
			continue

		for (const definition of Object.values(defs))
			discoverImagePathsInValue(discovered, component, definition, [])
	}

	return Array.from(discovered.values(), ({ samples, ...path }) => ({
		...path,
		samples: Array.from(samples),
	})).sort(comparePaths)
}

async function getDestinyDefinitions (component: string) {
	const destinyComponent = (DestinyManifest as Record<string, { all?: () => Promise<Record<string, unknown>> | Record<string, unknown> } | undefined>)[component]
	return destinyComponent?.all
		? await destinyComponent.all()
		: {}
}

function discoverImagePathsInValue (
	discovered: MutableDiscoveredImagePathMap,
	component: string,
	value: unknown,
	path: readonly string[],
) {
	if (typeof value === 'string' && isSupportedImageValue(value)) {
		const sourcePath = path.map(normalisePathSegment).join('.')
		const key = `${component}.${sourcePath}`
		const existing = discovered.get(key) ?? {
			component,
			path: sourcePath,
			count: 0,
			samples: new Set<string>(),
		}

		existing.count++
		if (existing.samples.size < 3)
			existing.samples.add(value)

		discovered.set(key, existing)
		return
	}

	if (Array.isArray(value)) {
		for (const item of value)
			discoverImagePathsInValue(discovered, component, item, [...path, '[]'])
		return
	}

	if (value && typeof value === 'object')
		for (const [key, item] of Object.entries(value))
			discoverImagePathsInValue(discovered, component, item, [...path, key])
}

function normalisePathSegment (segment: string) {
	return /^\d+$/.test(segment) ? '{}' : segment
}

function categoriseImagePath (imagePath: DiscoveredImagePath): readonly DeepsightImageCategory[] {
	if (imagePath.path === 'pgcrImage')
		return [DeepsightImageCategory.PgcrImage]

	if (SCREENSHOT_PATHS.has(`${imagePath.component}.${imagePath.path}`))
		return [DeepsightImageCategory.Screenshot]

	if (isWatermarkPath(imagePath))
		return [DeepsightImageCategory.Watermark]

	if (isIconPath(imagePath))
		return [DeepsightImageCategory.Icon, DeepsightImageCategory.Iconography]

	throw new Error([
		`Uncategorised image path: ${imagePath.component}.${imagePath.path}`,
		`count: ${imagePath.count}`,
		`samples: ${imagePath.samples.join(', ')}`,
	].join('\n'))
}

function toCategoryPath (imagePath: ImageCategoryPathDefinition): ImageCategoryPathDefinition {
	return {
		component: imagePath.component,
		path: imagePath.path,
	}
}

function isIconPath (imagePath: ImageCategoryPathDefinition) {
	return false
		|| ITEM_ICON_COMPONENTS.has(imagePath.component) && ITEM_ICON_PATHS.has(imagePath.path)
		|| imagePath.component === 'DestinyCollectibleDefinition' && COLLECTIBLE_ICON_PATHS.has(imagePath.path)
		|| imagePath.component === 'DestinyIconDefinition' && DESTINY_ICON_FOREGROUND_PATHS.has(imagePath.path)
		|| imagePath.component === 'DeepsightIconDefinition' && GENERATED_ICON_FOREGROUND_PATHS.has(imagePath.path)
		|| isIconographyPath(imagePath)
}

function isWatermarkPath (imagePath: ImageCategoryPathDefinition) {
	return imagePath.path.toLowerCase().includes('watermark')
		|| imagePath.component === 'DestinyIconDefinition' && DESTINY_ICON_LAYER_PATHS.has(imagePath.path)
		|| imagePath.component === 'DeepsightIconDefinition' && DESTINY_ICON_LAYER_PATHS.has(imagePath.path)
}

function isIconographyPath (imagePath: ImageCategoryPathDefinition) {
	if (ICONOGRAPHY_PATHS.has(`${imagePath.component}.${imagePath.path}`))
		return true

	return false
		|| imagePath.path.endsWith('displayProperties.icon')
		|| imagePath.path.endsWith('displayProperties.highResIcon')
		|| imagePath.path.endsWith('displayProperties.iconSequences.[].frames.[]')
		|| imagePath.path.endsWith('Icon')
		|| imagePath.path.endsWith('IconPath')
		|| imagePath.path.endsWith('ImagePath') && !imagePath.path.endsWith('backgroundImagePath')
}

export function isSupportedImageValue (value: string) {
	if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('/') && !value.startsWith('./'))
		return false

	return /\.(?:png|jpe?g|jfif|webp)(?:[?#].*)?$/i.test(value)
}
