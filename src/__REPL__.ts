//###  Setup  ###//
export {}
console.clear()

//###  App  ###//
import {ModeTransitions} from "./App/Machines/ModeTransitions/index.js"

//###  NPM  ###//
import {interpret} from "xstate"
import {
	getSimplePaths,
	getShortestPaths,
	getPathFromEvents,
} from "@xstate/graph"



//####################################################################################################################//
//##>  Script                                                                                                       ##//
//####################################################################################################################//

	const modeTransitions = interpret(ModeTransitions)
	modeTransitions.start()
	modeTransitions.send("TO_EDIT")
	modeTransitions.send("TO_LOOPER")
	const state = modeTransitions.getSnapshot()

	let matched = false

	const basePaths = getShortestPaths(ModeTransitions, {
		filter: ((state) => {

			return false
		})
		//events: {},
	})

	for(const [key, basePath] of Object.entries(basePaths)){
		console.log(`@@@ ${key}`)
		for(const path of basePath.paths){
			console.log(`  @ Segment`)
			for(const segment of path.segments){
				console.log(segment.event)
			}
		}
		//if(HistoryString(basePath.state.context) == "Presets"){
		//	console.log({key})
		//	//console.log({key, ...basePath})
		//	console.log(basePath.paths)
		//}
	}










	function HistoryString(context:any){
		//console.log({context})
		return context._history.join(".")
	}
	//function HistoryString({history}:Context)
		//{return history.join(".")}
