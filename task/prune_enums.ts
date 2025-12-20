import { InventoryItemHashes } from '@deepsight.gg/Enums'
import fs from 'fs-extra'
import { Task } from 'task'
import { getDeepsightCollectionsDefinition } from './manifest/DeepsightCollectionsDefinition'
import DeepsightVariantDefinition from './manifest/DeepsightVariantDefinition'
import DeepsightPlugCategorisation from './manifest/plugtype/DeepsightPlugCategorisation'
import Categorisation from './manifest/utility/Categorisation'

export default Task('prune_enums', async task => {
	let enums = await fs.readFile('docs/definitions/Enums.d.ts', 'utf-8')
	await fs.writeFile('docs/definitions/Enums.unpruned.temp', enums, 'utf-8')

	const inventoryItemHashesRegex = /(?<=export declare const enum InventoryItemHashes \{)[\s\S]*?(?=\})/
	const InventoryItemHashes = enums.match(inventoryItemHashesRegex)?.[0]
		.split('\n')
		.filter(line => line.trim().length)
		.map(line => line
			.replace(/,/, '')
			.split('=')
			.map(p => p.trim())
		)
		.toMap(([name, value]) => [name, +value as InventoryItemHashes])
	if (!InventoryItemHashes)
		throw new Error('Failed to find InventoryItemHashes enum in Enums.d.ts')

	const usedItemHashes = new Set<InventoryItemHashes>()
	for await (const file of fs.promises.glob('task/manifest/**/*.ts')) {
		const content = await fs.readFile(file, 'utf-8')
		for (const itemHashName of content.matchAll(/(?<=InventoryItemHashes\.)\w+/g)) {
			const itemHash = InventoryItemHashes.get(itemHashName[0])
			if (itemHash !== undefined)
				usedItemHashes.add(itemHash)
		}
	}

	const collections = await getDeepsightCollectionsDefinition()
	for (const def of Object.values(collections))
		for (const bucket of Object.values(def.buckets))
			for (const itemHash of bucket)
				usedItemHashes.add(itemHash)

	const variants = await DeepsightVariantDefinition.get()
	for (const itemHash of Object.keys(variants.variantGroupLookupTable))
		usedItemHashes.add(+itemHash as InventoryItemHashes)

	const plugs = await DeepsightPlugCategorisation.resolve()
	for (const plugCat of Object.values(plugs)) {
		if (Categorisation.IsDeprecated(plugCat))
			continue

		if (Categorisation.IsShaderOrnament(plugCat))
			continue

		usedItemHashes.add(plugCat.hash)
	}

	const pruned = [...InventoryItemHashes]
		.filter(([, hash]) => usedItemHashes.has(hash))
		.map(([name, value]) => `\t${name} = ${value},\n`)
		.join('')

	enums = enums.replace(inventoryItemHashesRegex, `\n${pruned}`)
	await fs.writeFile('docs/definitions/Enums.d.ts', enums, 'utf-8')
})
