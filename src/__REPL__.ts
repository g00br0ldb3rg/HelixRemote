//###  Setup  ###//
export {}
console.clear()

//###  App  ###//
import {Logger} from "./Utilities/Logger.js"



//####################################################################################################################//
//##>  Script                                                                                                       ##//
//####################################################################################################################//


	const {logger, Log: log} = Logger({

		name:  "App",
		level: "trace",

		//prefix({level}, {name}){
		//	return `[${name}][${level.toUpperCase()}]`
		//},

		//useOnlyCustomLevels: true,
		//customLevels: {
		//	silent: Infinity,
		//	fatal:  60,
		//	error:  50,
		//	warn:   40,
		//	info:   30,
		//	debug:  20,
		//	trace:  10,
		//}

		//transport: {
		//	target: "pino-pretty",
		//	options: <PrettyOptions>{
		//		ignore: [
		//			"hostname",
		//			"pid",
		//		].join(","),
		//	}
		//},

	})

	//pinoDebug(logger, {})




	function x(){
		Log.info("-------------------------------")
		//Log.fatal ("@@@ fatal @@@", {lol:"YEEEEEE", wat:new Date()})
		//Log.error ("@@@ error @@@", {lol:"YEEEEEE", wat:new Date()})
		//Log.warn  ("@@@ warn  @@@", {lol:"YEEEEEE", wat:new Date()})
		//Log.info  ("@@@ info  @@@", {lol:"YEEEEEE", wat:new Date()})
		Log.debug ("@@@ debug @@@", {lol:"YEEEEEE", wat:new Date()})
		//Log.trace ("@@@ trace @@@", {lol:"YEEEEEE", wat:new Date()})
		Log.info("-------------------------------")
	}

	;(globalThis as any).x = x
	x()
