//###  App  ###//
import {ModeTransitions        } from "./Machines/ModeTransitions"
import {MIDI_Transitioner, wait} from "./Utilities/MIDI_Transitioner"

//###  NPM  ###//
import {onMount   } from "solid-js"
import {atom      } from "solid-use"
import {useMachine} from "@xstate/solid"
import {inspect   } from "@xstate/inspect"
import {
	Button,
	HopeProvider,
} from "@hope-ui/solid"


//####################################################################################################################//
//##>  Utilities                                                                                                       ##//
//####################################################################################################################//

	function is_Helix(name:(string | undefined))
		{return name?.includes("Line 6 Helix")}


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		inspect({iframe:false})

		const [state, send] = useMachine(ModeTransitions, {devTools:true})

		onMount(async ()=>{
			const midi =
				await navigator.requestMIDIAccess()
				.catch((error) => {throw Error(error)})

			const helix =
				[...midi.outputs.values()]
				.filter((output) => is_Helix(output.name))[0]

			if(!helix)
				{throw Error("Helix not connected")}

			MIDI_Transitioner.initialize({midi, helix})

			//helix.send(CC({channel:1, id:68, value:127}))
		})

		return (
			<HopeProvider config={{initialColorMode:"dark"}} enableCssReset={false}>
				<main>
					<Button onClick={async () => {send("RESET"); await wait(500); send("TO_EDIT"     )}}>EDIT     </Button>
					{/*<Button onClick={async () => {send("RESET"); await wait(500); send("TO_LOOPER"   )}}>LOOPER   </Button>*/}
					<Button onClick={async () => {send("RESET"); await wait(500); send("TO_PRESETS"  )}}>PRESETS  </Button>
					<Button onClick={async () => {send("RESET"); await wait(500); send("TO_SNAPSHOTS")}}>SNAPSHOTS</Button>
					<Button onClick={async () => {send("RESET"); await wait(500); send("TO_STOMPS"   )}}>STOMPS   </Button>
				</main>
			</HopeProvider>
		)
	}
