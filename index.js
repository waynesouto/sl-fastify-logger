import fp from 'fastify-plugin'

function fastifyLogger(fastify, options) {
	const adapter = options.adapter || {
		log: (msg) => fastify.log.info(msg),
		error: (msg) => fastify.log.error(msg)
	}
	const level = options.level || 'info'
	const ignoreStatusCodes = options.ignoreStatusCodes || []

	fastify.addHook('onResponse', async(request, reply) => {
		if (ignoreStatusCodes.includes(reply.statusCode)) {
			return
		}

		const ip = request.headers['cf-connecting-ip'] || request.ip
		const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })

		// Cloudflare sets this header for the client's IP address
		let message = (options.prefix ? `[${options.prefix}] ` : '') +
			`${timestamp} | ` +
			`${reply.statusCode} | ` +
			`${reply.elapsedTime.toFixed(5)}ms | ` +
			`${ip} | ` +
			`${request.method} | ` +
			`${request.url}`

		if (reply.error !== undefined) {
			message += ` | ${reply.error.message}`
			adapter.error(message)

			return
		}

		// Log all messages
		if (level === 'info') {
			adapter.log(message)
		}
	})
}

export default fp(fastifyLogger, {
	fastify: '5.x',
	name: 'fastify-xlog'
})