import type { DestinyIconDefinition } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import path from 'path'
import type { Metadata } from 'sharp'
import { Task } from 'task'
import Env from '../utility/Env'
import { DeepsightPlugCategory, DeepsightPlugTypeIntrinsic } from './IDeepsightPlugCategorisation'
import DeepsightPlugCategorisationSource from './plugtype/DeepsightPlugCategorisation'
import ImageManager from './utility/ImageManager'
import DestinyManifest from './utility/endpoint/DestinyManifest'
import { ProgressLogger, runConcurrent } from './utility/Progress'

const iconPath = 'image/generated/icon'
const iconDir = `docs/${iconPath}`
const IMAGE_EXTRACTION_CONCURRENCY = 16

interface IconExtractionJob {
	readonly name: string
	run(): Promise<void>
}

export function getIconPath (iconHash: number) {
	return `${Env.DEEPSIGHT_PATH}/${iconPath}/${iconHash}.png`
}

export default Task('DeepsightIconDefinition', async task => {
	await fs.mkdirp(iconDir)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const DeepsightIconDefinition: Record<number, DestinyIconDefinition> =
		await fs.readJson('static/definitions/DeepsightIconDefinition.json').catch(() => ({}))

	const [DestinyInventoryItemDefinition, DestinyIconDefinition, DeepsightPlugCategorisation] = await Promise.all([
		DestinyManifest.DestinyInventoryItemDefinition.all(),
		DestinyManifest.DestinyIconDefinition.all(),
		DeepsightPlugCategorisationSource.resolve(),
	])

	const invItems = Object.entries(DestinyInventoryItemDefinition)

	const iconURLsExtracted = new Set<number>()
	const jobs: IconExtractionJob[] = []
	for (const [itemHash, def] of invItems) {
		const cat = DeepsightPlugCategorisation[+itemHash]
		if (cat?.category !== DeepsightPlugCategory.Mod)
			continue

		const skippedStates = ['Empty', 'Deprecated', 'Fallback', 'Default', 'Locked', 'Action', 'Exotic']
		if (skippedStates.some(state => cat.fullName.includes(state)))
			continue

		const iconHash = def.displayProperties.iconHash || +itemHash
		const iconDef = DestinyIconDefinition[iconHash]
		const modIcon = iconDef?.foreground ?? def.displayProperties.icon
		if (!modIcon || iconURLsExtracted.has(iconHash))
			continue

		if (!modIcon.endsWith('.png')) {
			console.warn('Can\'t extract foreground layer for non-png mod icon', itemHash, `https://www.bungie.net${modIcon}`)
			continue
		}

		const outputPath = `${iconDir}/${iconHash}.png`
		if (DeepsightIconDefinition[iconHash] && await fs.pathExists(outputPath)) // already extracted
			continue

		iconURLsExtracted.add(iconHash)
		jobs.push({
			name: def.displayProperties.name,
			async run () {
				const sharp = await ImageManager.get(`https://www.bungie.net${modIcon}`)

				const emptySeasonal = 'task/manifest/icon/mod_empty_seasonal.png'
				const emptyVariants = [
					'task/manifest/icon/mod_empty.png',
					'task/manifest/icon/mod_empty_2.png',
					'task/manifest/icon/mod_empty_3.png',
					'task/manifest/icon/mod_empty_4.png',
					'task/manifest/icon/mod_empty_5.png',
					emptySeasonal,
				]

				let { variant, result } = false
					|| await resolveVariants(emptyVariants, async variant => await ImageManager.extractForeground(
						sharp,
						variant,
						validate,
					))
					// fallback for one mod that produces artifacting and i can't figure out why
					|| {
					variant: 'fallback',
					result: await ImageManager.extractForeground(
						sharp,
						'task/manifest/icon/mod_empty_3.png',
					),
				}

				if (!result) {
					console.warn('Failed to extract mod foreground', iconHash, `https://www.bungie.net${modIcon}`)
					return
				}

				const enhancedOverlay = 'task/manifest/icon/mod_enhanced_overlay.png'
				const fragileOverlays = [
					'task/manifest/icon/mod_fragile_overlay.png',
					'task/manifest/icon/mod_fragile_overlay_3.png',
					'task/manifest/icon/mod_fragile_overlay_2.png',
					'task/manifest/icon/mod_fragile_overlay_4.png',
				]
				const artifactsToStrip = [
					'task/manifest/icon/mod_empty_artifacts_1.png',
					'task/manifest/icon/mod_empty_artifacts_2.png',
					'task/manifest/icon/mod_empty_artifacts_3.png',
					'task/manifest/icon/mod_empty_artifacts_4.png',
				]

				if (result) {
					const subtractionResult = await ImageManager.subtractOverlays([enhancedOverlay, ...fragileOverlays, ...artifactsToStrip], result)
					result = subtractionResult.result
					const isSeasonal = variant === emptySeasonal
					const isEnhanced = subtractionResult.subtracted.includes(enhancedOverlay)
					const isFragile = fragileOverlays.some(overlay => subtractionResult.subtracted.includes(overlay))
					DeepsightIconDefinition[iconHash] = {
						hash: iconHash,
						foreground: `/image/generated/icon/${iconHash}.png`,
						background: `/image/png/mod/${isSeasonal ? 'mod_empty_seasonal' : 'mod_empty'}.png`,
						secondaryBackground: isEnhanced ? '/image/png/mod/mod_enhanced_overlay.png' : '',
						specialBackground: !isFragile ? '' : `/image/png/mod/mod_fragile_overlay${isSeasonal ? '_seasonal' : ''}${isEnhanced ? '' : '_glow'}.png`,
						highResForeground: '',
						index: iconDef?.index ?? 0,
						redacted: false,
						...{ blacklisted: false },
					}
				}

				await result.png().toFile(outputPath)
			},
		})
	}

	for (const [itemHash, def] of invItems) {
		const cat = DeepsightPlugCategorisation[+itemHash]
		if (cat?.category !== DeepsightPlugCategory.Intrinsic)
			continue

		if (cat.type !== DeepsightPlugTypeIntrinsic.Exotic)
			continue

		const iconHash = def.displayProperties.iconHash || +itemHash
		const iconDef = DestinyIconDefinition[iconHash]
		const intrinsicIcon = iconDef?.foreground ?? def.displayProperties.icon
		if (!intrinsicIcon || iconURLsExtracted.has(iconHash))
			continue

		if (!intrinsicIcon.endsWith('.png')) {
			console.warn('Can\'t extract foreground layer for non-png exotic intrinsic icon', itemHash, `https://www.bungie.net${intrinsicIcon}`)
			continue
		}

		const outputPath = `${iconDir}/${iconHash}.png`
		if (DeepsightIconDefinition[iconHash] && await fs.pathExists(outputPath)) // already extracted
			continue

		iconURLsExtracted.add(iconHash)
		jobs.push({
			name: def.displayProperties.name,
			async run () {
				const sharp = await ImageManager.get(`https://www.bungie.net${intrinsicIcon}`)

				let result = await ImageManager.extractForeground(
					sharp,
					'task/manifest/icon/exotic_intrinsic_empty.png',
				)

				if (!result) {
					console.warn('Failed to extract mod foreground', iconHash, `https://www.bungie.net${intrinsicIcon}`)
					return
				}

				const artifactsToStrip = [
					'task/manifest/icon/exotic_intrinsic_artifacts_1.png',
					'task/manifest/icon/exotic_intrinsic_artifacts_2.png',
				]

				if (result) {
					const subtractionResult = await ImageManager.subtractOverlays([...artifactsToStrip], result)
					result = subtractionResult.result
					DeepsightIconDefinition[iconHash] = {
						hash: iconHash,
						foreground: `/image/generated/icon/${iconHash}.png`,
						background: '/image/png/mod/exotic_intrinsic_empty.png',
						secondaryBackground: '',
						specialBackground: '',
						highResForeground: '',
						index: iconDef?.index ?? 0,
						redacted: false,
						...{ blacklisted: false },
					}
				}

				await result.png().toFile(outputPath)
			},
		})
	}

	const progress = new ProgressLogger('icon extraction', jobs.length, 'icon')
	progress.start()
	await runConcurrent(jobs, IMAGE_EXTRACTION_CONCURRENCY, async job => {
		await job.run()
		progress.advance('Extracted', job.name)
	})

	await pruneMissingGeneratedIcons(DeepsightIconDefinition)

	await fs.mkdirp('docs/definitions')
	await fs.writeJson('static/definitions/DeepsightIconDefinition.json', DeepsightIconDefinition, { spaces: '\t' })
	await fs.copyFile('static/definitions/DeepsightIconDefinition.json', 'docs/definitions/DeepsightIconDefinition.json')
})

async function pruneMissingGeneratedIcons (definitions: Record<number, DestinyIconDefinition>) {
	for (const [hash, definition] of Object.entries(definitions)) {
		if (!definition.foreground?.startsWith('/image/generated/icon/'))
			continue

		const localPath = path.join('docs', ...definition.foreground.split('/').filter(Boolean))
		if (!await fs.pathExists(localPath))
			delete definitions[Number(hash)]
	}
}

const ensureTransparentCoords = [
	[0, 0],
	[9, 9],
	[9, 89],
]
function validate (buffer: Buffer, metadata: Metadata) {
	for (const [x, y] of ensureTransparentCoords) {
		const channels = 4

		const i = (y * metadata.width + x) * channels
		if (buffer[i + 3] >= 5)
			return false
	}

	return true
}

async function resolveVariants<T> (variants: string[], action: (variant: string) => Promise<T>) {
	for (const variant of variants) {
		const result = await action(variant)
		if (result)
			return {
				result,
				variant,
			}
	}
	return undefined
}
