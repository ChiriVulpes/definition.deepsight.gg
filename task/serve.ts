import { Middleware, Server, Task } from 'task'
import Env from './utility/Env'

const _ = undefined

export default Task('serve', async task => {
	const router = Middleware((definition, req, res) => _
		?? Middleware.Static(definition, req, res)
		?? Middleware.E404(definition, req, res)
	)
	const server = await Server({
		port: +Env.PORT!,
		root: 'docs',
		serverIndex: '/index.html',
		router,
	})
	await server.listen()
})
