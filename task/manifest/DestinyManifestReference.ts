import type { AllDestinyManifestComponents, DestinyDisplayPropertiesDefinition } from 'bungie-api-ts/destiny2'
import type { BungieIconPath, DeepsightDisplayPropertiesDefinition, DeepsightIconPath } from '../../static/definitions/Interfaces'
import Log from '../utility/Log'
import type { PromiseOr } from '../utility/Type'
import type { DestinyManifestComponentValue } from './utility/endpoint/DestinyManifest'
import manifest, { DESTINY_MANIFEST_MISSING_ICON_PATH } from './utility/endpoint/DestinyManifest'

const _ = undefined

interface HasDisplayPropertiesOrIconWatermark {
	displayProperties?: DestinyDisplayPropertiesDefinition
	iconWatermark?: string
	iconWatermarkShelved?: string
}

interface ManifestReferenceWhichFrame {
	hash: number
	iconSequence: number
	frame: number
}

interface ManifestReferenceWhichProperty {
	hash: number
	property: string | string[]
}

interface ManifestReferenceResolver<T> {
	hash: number
	resolve (value: T): PromiseOr<string | undefined>
}

type DestinyManifestReference = { [KEY in keyof AllDestinyManifestComponents]?: number | ManifestReferenceWhichProperty | ManifestReferenceWhichFrame | ManifestReferenceResolver<AllDestinyManifestComponents[KEY][number]> }
namespace DestinyManifestReference {
	export interface DisplayPropertiesDefinition {
		name?: string | DestinyManifestReference
		subtitle?: string | DestinyManifestReference
		description?: string | DestinyManifestReference
		icon?: string | DestinyManifestReference
	}

	export async function resolve (ref: string | DestinyManifestReference | undefined, type: 'name' | 'subtitle' | 'description' | 'icon' | 'iconWatermark' | 'iconWatermarkShelved' | 'iconWatermarkFeatured' | 'pgcrImage' | 'secondaryIcon', alternativeSources?: Record<string, HasDisplayPropertiesOrIconWatermark | undefined>) {
		if (typeof ref === 'string')
			return ref

		for (const [key, which] of Object.entries(ref ?? {})) {
			const hash = typeof which === 'number' ? which : which.hash
			const componentName = key as keyof AllDestinyManifestComponents
			const definition = await manifest[componentName].get(hash) as DestinyManifestComponentValue | undefined
			if (!definition)
				continue

			if (typeof which === 'object' && 'frame' in which && 'displayProperties' in definition) {
				const icon = definition.displayProperties.iconSequences[which.iconSequence]?.frames[which.frame]
				if (!icon) {
					Log.error(`Unable to resolve icon from manifest reference: ${definition.displayProperties.name} (${componentName}), icon sequence ${which.iconSequence}, frame ${which.frame}`)
					return undefined
				}

				return icon
			}

			const propertyError = (definition: DestinyManifestComponentValue, property: string) => {
				const name = 'displayProperties' in definition ? definition.displayProperties.name : 'No name'
				Log.error(`Unable to resolve property from manifest reference: ${name} (${componentName} ${hash}), property ${property}`)
			}
			if (typeof which === 'object' && 'property' in which && Array.isArray(which.property)) {
				let cursor: any = definition
				for (const property of which.property) {
					if (!cursor || !(property in cursor)) {
						propertyError(definition, which.property.join('.'))
						return undefined
					}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					cursor = cursor[property]
				}

				return `${cursor}`
			}

			if (typeof which === 'object' && 'resolve' in which && typeof which.resolve === 'function')
				return await which.resolve(definition as never)

			if (typeof which === 'object' && 'property' in which && typeof which.property === 'string' && which.property in definition) {
				const propertyValue = definition[which.property as keyof typeof definition]
				if (!propertyValue) {
					propertyError(definition, which.property)
					return undefined
				}

				return `${propertyValue}`
			}

			if (typeof which === 'object' && 'property' in which && typeof which.property === 'string' && 'displayProperties' in definition) {
				const propertyValue = definition.displayProperties[which.property as 'name']
				if (!propertyValue) {
					propertyError(definition, which.property)
					return undefined
				}

				return `${propertyValue}`
			}

			const result = resolveSource(definition, type)
			if (result)
				return result
		}

		for (const [key, definition] of Object.entries(alternativeSources ?? {})) {
			if (!definition)
				continue

			const result = resolveSource(definition as DestinyManifestComponentValue, type)
			if (result)
				return result
		}

		return undefined
	}

	function resolveSource (definition: DestinyManifestComponentValue, type: 'name' | 'subtitle' | 'description' | 'icon' | 'iconWatermark' | 'iconWatermarkShelved' | 'iconWatermarkFeatured' | 'pgcrImage' | 'secondaryIcon') {
		if (!definition)
			return undefined

		if (type === 'iconWatermark') {
			if ('iconWatermark' in definition)
				return definition.iconWatermark || undefined
			return undefined
		}

		if (type === 'iconWatermarkShelved') {
			if ('iconWatermarkShelved' in definition)
				return definition.iconWatermarkShelved || undefined
			return undefined
		}

		if (type === 'iconWatermarkFeatured') {
			if ('iconWatermarkFeatured' in definition)
				return definition.iconWatermarkFeatured || undefined
			return undefined
		}

		if (type === 'pgcrImage') {
			if ('pgcrImage' in definition)
				return definition.pgcrImage || undefined
			return undefined
		}

		if (type === 'secondaryIcon') {
			if ('secondaryIcon' in definition)
				return definition.secondaryIcon || undefined
			return undefined
		}

		const displayProperties = 'displayProperties' in definition ? definition.displayProperties : undefined
		if (!displayProperties)
			return undefined

		return displayProperties[type as keyof typeof displayProperties] as string || undefined
	}

	export async function resolveAll (displayProperties?: DestinyManifestReference.DisplayPropertiesDefinition, alternativeSources?: Record<string, HasDisplayPropertiesOrIconWatermark | undefined>) {
		const givenDisplayProperties = displayProperties
		displayProperties ??= {}
		if (givenDisplayProperties || alternativeSources) {
			displayProperties.name = await DestinyManifestReference.resolve(givenDisplayProperties?.name, 'name', alternativeSources)
			displayProperties.subtitle = _
				?? await DestinyManifestReference.resolve(givenDisplayProperties?.subtitle, 'subtitle', alternativeSources)
				?? await DestinyManifestReference.resolve(givenDisplayProperties?.subtitle, 'name', alternativeSources)
			displayProperties.description = await DestinyManifestReference.resolve(givenDisplayProperties?.description, 'description', alternativeSources)
			const icon = await DestinyManifestReference.resolve(givenDisplayProperties?.icon, 'icon', alternativeSources)
			if (icon !== DESTINY_MANIFEST_MISSING_ICON_PATH)
				displayProperties.icon = icon as DeepsightIconPath | BungieIconPath
		}

		displayProperties.name ??= ''
		displayProperties.description ??= ''

		return displayProperties as DeepsightDisplayPropertiesDefinition
	}

	export async function displayOf (type: keyof AllDestinyManifestComponents, which: number) {
		return (await manifest[type].get(which) as HasDisplayPropertiesOrIconWatermark)?.displayProperties
	}
}

export default DestinyManifestReference
