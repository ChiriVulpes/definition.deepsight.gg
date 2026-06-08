import { Task } from 'task'
import { filterSelection, loadMainSelection, loadUsingSources, parseArgs, printHelp, printSelection, saveSelection } from './utility/search/JsonSearch'

export default Task(null, async (_task, ...args: string[]) => {
	const options = parseArgs(args)
	if (options.help) {
		const source = options.load ? await loadMainSelection(options) : undefined
		await printHelp(options, source)
		return
	}

	const using = await loadUsingSources(options.using)
	const source = await loadMainSelection(options)
	const selection = {
		...filterSelection(source, options.where, using),
		query: { where: options.where },
	}

	if (options.save)
		await saveSelection(selection, selection.query)

	printSelection(selection, options)
})
