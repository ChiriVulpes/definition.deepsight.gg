import { Task } from 'task'
import { filterSelection, getHelpMarkdown, loadMainSelection, loadUsingSources, parseArgs, printSelection, saveSelection } from './utility/search/JsonSearch'
import { getOpenApiDocsMarkdown, printOpenApiDocs } from './utility/search/OpenApiDocs'

export default Task(null, async (_task, ...args: string[]) => {
	const options = parseArgs(args)
	if (options.help) {
		const source = options.load ? await loadMainSelection(options) : undefined
		const sections = [await getHelpMarkdown(options, source)]
		if (options.tables.length || source)
			sections.push(await getOpenApiDocsMarkdown(options, source))

		console.log(sections.join('\n\n'))
		return
	}

	if (options.docs) {
		const source = options.load ? await loadMainSelection(options) : undefined
		await printOpenApiDocs(options, source)
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
