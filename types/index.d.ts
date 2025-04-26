import { FastifyPluginCallback } from 'fastify'

interface FastifyLoggerAdapter {
	log(message: string): void
	error(message: string): void
}

type FastifyLoggerPlugin = FastifyPluginCallback<NonNullable<fastifyLogger.FastifyLoggerOptions>>

declare namespace fastifyLogger {
	export interface FastifyLoggerOptions {
		/**
		 * An optional custom logger adapter that provides methods for logging messages and errors. If not provided, console is used
		 */
		adapter?: FastifyLoggerAdapter

		/**
		 * The logging level to use. Defaults to 'error' if not specified.
		 */
		level?: 'info' | 'error'

		/**
		 * An array of HTTP status codes to ignore
		 */
		ignoreStatusCodes?: number[]

		/**
		 * Prefix for the log messages
		 */
		prefix?: string
	}

	export const fastifyLogger: FastifyLoggerPlugin
	export { fastifyLogger as default }
}

declare function fastifyLogger(
	...params: Parameters<FastifyLoggerPlugin>
): ReturnType<FastifyLoggerPlugin>

export = fastifyLogger