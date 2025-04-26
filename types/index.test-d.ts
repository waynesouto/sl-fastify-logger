import fastify from 'fastify'

import logger from '..'

const app = fastify()

app.register(logger)

app.register(logger, {
	adapter: {
		log: (message: string) => app.log.info(message),
		error: (message: string) => app.log.error(message)
	},
	ignoreStatusCodes: [404],
	level: 'info',
	prefix: 'auth',
	logLevel: 'info'
})