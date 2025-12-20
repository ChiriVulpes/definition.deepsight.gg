import { Task } from 'task'

export default Task('install', async task => {
	await task.install({
		path: '.',
		dependencies: {
			lint: { repo: 'fluff4me/lint' },
			task: { repo: 'chirivulpes/task', branch: 'package' },
			'bungie-api-ts': { name: 'bungie-api-ts' },
		},
	})
})
