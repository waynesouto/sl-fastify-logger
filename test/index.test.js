import fastify from 'fastify'
import { test } from 'node:test'

import logger from '../index.js'

test('Should log requests with default format', async(t) => {
	t.plan(3)

	const app = fastify()

	app.get('/', (_req, reply) => {
		reply.send('ok')
	})

	app.register(logger)

	const res = await app.inject({
		method: 'GET',
		url: '/'
	})

	t.assert.ok(res)
	t.assert.strictEqual(res.statusCode, 200)
	t.assert.strictEqual(res.payload, 'ok')
})

test('Should log errors when present', async(t) => {
	t.plan(1)

	const app = fastify()
	const logs = []

	app.get('/error', (_req, reply) => {
		reply.error = new Error('Test error')
		reply.send('error')
	})

	app.register(logger, {
		adapter: {
			error: (msg) => logs.push(msg)
		}
	})

	await app.inject({
		method: 'GET',
		url: '/error'
	})

	t.assert.strictEqual(logs.length, 1)
})

test('Should respect ignoreStatusCodes', async(t) => {
	t.plan(1)

	const app = fastify()
	const logs = []

	app.get('/not-found', (_req, reply) => {
		reply.status(404).send()
	})

	app.register(logger, {
		ignoreStatusCodes: [404],
		adapter: {
			log: (msg) => logs.push(msg)
		}
	})

	await app.inject({
		method: 'GET',
		url: '/not-found'
	})

	t.assert.strictEqual(logs.length, 0)
})

test('Should include prefix when configured', async(t) => {
	t.plan(1)

	const app = fastify()
	const logs = []

	app.get('/', (_req, reply) => {
		reply.send('ok')
	})

	app.register(logger, {
		prefix: 'TEST',
		adapter: {
			log: (msg) => logs.push(msg)
		}
	})

	await app.inject({
		method: 'GET',
		url: '/'
	})

	t.assert.ok(logs[0].includes('[TEST]'))
})

test('Should respect log level', async(t) => {
	t.plan(2)

	const app = fastify()
	const logs = []

	app.get('/', (_req, reply) => {
		reply.send('ok')
	})

	app.get('/error', (_req, reply) => {
		reply.error = new Error('Test')
		reply.send('error')
	})

	app.register(logger, {
		level: 'error',
		adapter: {
			log: (msg) => logs.push(msg),
			error: (msg) => logs.push(msg)
		}
	})

	await app.inject({
		method: 'GET',
		url: '/'
	})

	t.assert.strictEqual(logs.length, 0)

	await app.inject({
		method: 'GET',
		url: '/error'
	})

	t.assert.strictEqual(logs.length, 1)
})

test('Should log request payload when logRequestPayload is enabled', async(t) => {
	t.plan(1)

	const app = fastify()
	const logs = []

	app.post('/with-payload', async(_req, reply) => {
		reply.error = new Error('Payload error')
		reply.send('error')
	})

	app.register(logger, {
		logRequestPayload: true,
		adapter: {
			error: (msg) => logs.push(msg)
		}
	})

	const payload = { test: 'data' }
	await app.inject({
		method: 'POST',
		url: '/with-payload',
		payload
	})

	t.assert.ok(
		logs[0].includes(JSON.stringify(payload)),
		'Should include request payload in error log'
	)
})

test('Should cover all function paths', async(t) => {
	t.plan(3)

	const app = fastify()
	app.register(logger)

	const logs = []
	app.register(logger, {
		adapter: {
			log: (msg) => {
				globalThis.console.log('LOG:', msg)
				logs.push(msg)
			},
			error: (msg) => logs.push(msg)
		},
		level: 'info',
		prefix: 'TEST',
		ignoreStatusCodes: [404]
	})

	app.get('/', (_req, reply) => {
		reply.send('ok')
	})

	app.get('/error', (_req, reply) => {
		reply.error = new Error('Test error')
		reply.send('error')
	})

	app.get('/not-found', (_req, reply) => {
		reply.status(404).send()
	})

	await app.inject('/')
	await app.inject('/error')
	await app.inject('/not-found')

	t.assert.strictEqual(logs.length, 2, 'Should log only non-ignored requests')
	t.assert.ok(logs[0].includes('[TEST]'), 'Should include prefix')
	t.assert.ok(logs[1].includes('Test error'), 'Should log errors')
})
