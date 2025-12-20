import fs from 'fs-extra'
import { Task } from 'task'

export default function DefinitionTable<T> (name: string, supplier: () => Promise<T>) {
	let result: T | undefined
	async function get () {
		return result ??= await supplier()
	}
	const task = Task(name, async () => {
		const result = await get()
		await fs.mkdirp('docs/definitions')
		await fs.writeJson(`docs/definitions/${name}.json`, result, { spaces: '\t' })
	})
	return Object.assign(task, { get })
}
