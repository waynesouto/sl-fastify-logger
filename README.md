# Fastify Logger

[![NPM Downloads](https://img.shields.io/npm/d18m/%40specter-labs%2Ffastify-logger?style=flat-square&logo=npm)](https://www.npmjs.com/package/@specter-labs/fastify-logger)
[![NPM License](https://img.shields.io/npm/l/%40specter-labs%2Ffastify-logger?style=flat-square&logo=npm)](https://www.npmjs.com/package/@specter-labs/fastify-logger)
[![NPM Version](https://img.shields.io/npm/v/%40specter-labs%2Ffastify-logger?style=flat-square&logo=npm)](https://www.npmjs.com/package/@specter-labs/fastify-logger)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Advanced HTTP request logging plugin for Fastify with support for custom contexts and flexible configuration.

## Install

```bash
npm i @specter-labs/fastify-logger
```

## Usage

```js
import Fastify from 'fastify'
import logger from '@specter-labs/fastify-logger'

const fastify = Fastify()

// Register the plugin with default options
await fastify.register(logger)

// Or with custom options
await fastify.register(logger, {
  level: 'info',
  prefix: 'api',
  ignoreStatusCodes: [400],
  adapter: {
    log: (message) => console.log(message),
    error: (message) => console.error(message)
  }
})
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `level` | `'info'` | The logging level. Can be `'info'` or `'error'` |
| `prefix` | `undefined` | Optional prefix for log messages |
| `ignoreStatusCodes` | `[]` | Array of HTTP status codes to ignore |
| `ignorePaths` | `[]` | Array of URL paths to ignore. If a request URL starts with any of these paths, it won't be logged |
| `adapter` | `{ log: fastify.log.info, error: fastify.log.error }` | Custom logging adapter implementation |
| `logRequestPayload` | `false` | When enabled, logs the request payload for error responses |

### Custom Adapter

You can provide a custom adapter to handle logging:

```js
const customAdapter = {
  log: (message) => {
    // Handle regular logs
  },
  error: (message) => {
    // Handle error logs
  }
}

await fastify.register(logger, { adapter: customAdapter })
```

## Log Format

The plugin logs requests in the following format:

```
[prefix] timestamp | statusCode | responseTime | ip | method | url
```

For errors, the error message is appended:

```
[prefix] timestamp | statusCode | responseTime | ip | method | url | errorMessage
```

## License

Licensed under [MIT](./LICENSE).
