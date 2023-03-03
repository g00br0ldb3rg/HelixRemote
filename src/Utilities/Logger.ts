//###  NPM  ###//
import type {
	Logger        as PinoLogger,
	LoggerOptions as PinoOptions,
} from "pino"
import type {PrettyOptions} from "pino-pretty"
import pino                 from "pino"


//####################################################################################################################//
//##>  Exports.Type                                                                                                 ##//
//####################################################################################################################//

	export type Logger<Options extends Logger.Options> =
		PinoLogger<
			& Omit<Options, "level">
			& {level?:Logger.Level}
		>


//####################################################################################################################//
//##>  Exports.Function                                                                                             ##//
//####################################################################################################################//

	export function Logger<
		Options extends Logger.Options,
		_Logger extends Logger<Options> = Logger<Options>
	>
		(options:Options):
		{logger:_Logger, log:Logger.LogObject}
	{
		const [{prefix}, _options] = Options(options)

		const logger = (pino(_options) as _Logger)

		const prefixes = {
			fatal: Prefix({context:{level:"fatal"}, options:_options, prefix}),
			error: Prefix({context:{level:"error"}, options:_options, prefix}),
			warn:  Prefix({context:{level:"warn" }, options:_options, prefix}),
			info:  Prefix({context:{level:"info" }, options:_options, prefix}),
			debug: Prefix({context:{level:"debug"}, options:_options, prefix}),
			trace: Prefix({context:{level:"trace"}, options:_options, prefix}),
		}

		return {
			logger,
			log: {
				fatal: (function fatal(message, data=NoData){(logger.fatal  as any)(...LoggerArgs(prefixes.fatal, message, data!))} as Logger.LogFunction),
				error: (function error(message, data=NoData){(logger.error  as any)(...LoggerArgs(prefixes.error, message, data!))} as Logger.LogFunction),
				warn : (function warn (message, data=NoData){(logger.warn   as any)(...LoggerArgs(prefixes.warn,  message, data!))} as Logger.LogFunction),
				info : (function info (message, data=NoData){(logger.info   as any)(...LoggerArgs(prefixes.info,  message, data!))} as Logger.LogFunction),
				debug: (function debug(message, data=NoData){(logger.debug  as any)(...LoggerArgs(prefixes.debug, message, data!))} as Logger.LogFunction),
				trace: (function trace(message, data=NoData){(logger.trace  as any)(...LoggerArgs(prefixes.trace, message, data!))} as Logger.LogFunction),
			},
		}
	}


//####################################################################################################################//
//##>  Exports.Namespace                                                                                            ##//
//####################################################################################################################//

	export namespace Logger{

		export type Level =
			| "silent"
			| "fatal"
			| "error"
			| "warn"
			| "info"
			| "debug"
			| "trace"

		export type LogObject =
			{[K in Exclude<Level, "silent">]: LogFunction}

		export type LogFunction = {
			(data:   object,             ): void;
			(message:string, data?:object): void;
		}

		export type Options =
			& Omit<
				PinoOptions,
				/* Modified */
				| "level"
				/* Disabled */
				| "msgPrefix"
			>
			& {
				level:   Level
				prefix?: PrefixFunction
			}

	}


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type  NoData = (typeof NoData)
	const NoData = Symbol()

	type LoggerContext = {
		level: string
	}

	type PrefixFunction =
		((context:LoggerContext, options:PinoOptions) => string)


//####################################################################################################################//
//##>  Utilities                                                                                                    ##//
//####################################################################################################################//

	function LoggerArgs(
		prefix: string,
		arg_1:  (string | object),
		arg_2:  (object | NoData),
	): ([string] | [string, object]){
		return (
			(typeof arg_1 === "string")
			? (arg_2 === NoData)
				? [`${prefix}${arg_1}`,         ] /* {message:true,  data:false} */
				: [`${prefix}${arg_1} %o`, arg_2] /* {message:true,  data:true } */
			:   [`${prefix}%o`,          arg_1] /* {message:false, data:true } */
		)
	}

	function Options(_options:Logger.Options){
		let {prefix, ...options} = _options

		prefix ??= prefix_Default

		options.transport ??= {
			target: "pino-pretty",
			options: <PrettyOptions>{
				ignore: [
					"hostname",
					"pid",
				].join(","),
			},
		}

		const finalOptions: PinoOptions = options

		return [
			{prefix},
			finalOptions,
		] as const
	}

	function Prefix(
		{context,               prefix,                          options            }:
		{context:LoggerContext, prefix:Logger.Options["prefix"], options:PinoOptions}
	){
		return (
			(prefix)
			? prefix(context, options)
			: ""
		)
	}

	const prefix_Default: PrefixFunction =
		function prefix_Default({level}, {name}){
			const namePrefix =
				(name)
				? `[${name}]`
				: ""

			const levelPrefix = `[${level.toUpperCase()}]`

			return `${namePrefix}${levelPrefix} `
		}
