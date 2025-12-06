import type { AllDestinyManifestComponents } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import * as path from 'path'
import Log from '../../../utility/Log'

type PromiseOr<T> = T | Promise<T>

interface DestinyManifestItem<COMPONENT_NAME extends keyof AllDestinyManifestComponents> {
	get (hash?: number | string): PromiseOr<AllDestinyManifestComponents[COMPONENT_NAME][number] | undefined>
	all (): PromiseOr<AllDestinyManifestComponents[COMPONENT_NAME]>
	filter (predicate: (item: AllDestinyManifestComponents[COMPONENT_NAME][number]) => boolean): PromiseOr<AllDestinyManifestComponents[COMPONENT_NAME][number][]>
}
type DestinyManifest = { [COMPONENT_NAME in keyof AllDestinyManifestComponents]: DestinyManifestItem<COMPONENT_NAME> }
	& { ALL: PromiseOr<(keyof AllDestinyManifestComponents)[]> }

export type DestinyManifestComponentValue = AllDestinyManifestComponents[keyof AllDestinyManifestComponents][number]

const DestinyManifest = new Proxy({} as Partial<DestinyManifest>, {
	get: (target, componentName: keyof AllDestinyManifestComponents) => {
		if (!target[componentName]) {
			if (componentName as string === 'ALL')
				return target.ALL = fs.readdir('static/testiny')

					.then(componentFiles => target.ALL = componentFiles
						.filter(file => file !== '.v')
						.map(file => path.basename(file, '.json') as keyof AllDestinyManifestComponents))

			let manifestItem: PromiseOr<Record<number, DestinyManifestComponentValue>> = fs.readJson(`static/testiny/${componentName}.json`)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				.then(result => manifestItem = result)
				.catch(err => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (err.code === 'ENOENT')
						Log.error(`There is no Destiny Manifest component "${componentName}"`)
					else
						Log.error(`Unable to read Destiny Manifest component "${componentName}":`, err)
					process.exit(1)
				})

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			target[componentName] = {
				get: (hash?: number): PromiseOr<DestinyManifestComponentValue | undefined> => hash === undefined ? undefined : manifestItem instanceof Promise ? manifestItem.then(result => result[hash]) : manifestItem[hash],
				all: () => manifestItem,
				filter: predicate => {
					if (manifestItem instanceof Promise)
						return manifestItem.then(applyFilter)
					else
						return applyFilter(manifestItem)

					function applyFilter (data: Awaited<typeof manifestItem>) {
						const result: DestinyManifestComponentValue[] = []
						for (const key in data) {
							const item = data[key]
							if (predicate(item))
								result.push(item)
						}
						return result
					}
				},
			} as DestinyManifestItem<keyof AllDestinyManifestComponents> as any
		}

		return target[componentName]
	},
})

export default DestinyManifest as DestinyManifest

export const DESTINY_MANIFEST_MISSING_ICON_PATH = '/img/misc/missing_icon_d2.png'
