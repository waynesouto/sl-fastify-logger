# fastify-xlog

[![NPM version](https://img.shields.io/npm/v/fastify-xlog.svg?style=flat)](https://www.npmjs.com/package/fastify-xlog)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Advanced HTTP request logging plugin for Fastify with support for custom contexts and flexible configuration.

## Install

```bash
npm i fastify-xlog
```

## Usage

```js
import Fastify from 'fastify'
import fastifyXlog from 'fastify-xlog'

const fastify = Fastify()

// Register the plugin with default options
await fastify.register(fastifyXlog)

// Or with custom options
await fastify.register(fastifyXlog, {
  level: 'info',
  prefix: 'api',
  ignoreStatusCodes: [404],
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
| `adapter` | `{ log: fastify.log.info, error: fastify.log.error }` | Custom logging adapter implementation |

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

await fastify.register(fastifyXlog, { adapter: customAdapter })
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
