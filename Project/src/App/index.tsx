//###  App  ###//
import {ModeTransitions} from "./Machines/ModeTransitions"

//###  NPM  ###//
import {onMount   } from "solid-js"
import {atom      } from "solid-use"
import {useMachine} from "@xstate/solid"
import {inspect   } from "@xstate/inspect"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		inspect({iframe:false})

		const [state, send] = useMachine(ModeTransitions, {devTools:true})

		onMount(async ()=>{
		})

		return (
			<main>
			</main>
		)
	}
