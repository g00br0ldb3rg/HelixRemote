//###  App  ###//
import {ModeTransitions} from "./Machines/ModeTransitions/index.js"
import {Helix          } from "./Utilities/Helix.js"

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
		//inspect({iframe:false})

		const _transitions = useMachine(ModeTransitions, {
			//devTools: true,
		})
		const transitions = {
			state:       _transitions[0],
			send:        _transitions[1],
			interpreter: _transitions[2],
		}

		onMount(async ()=>{
			const midi =
				await navigator.requestMIDIAccess()
				.catch((error) => {throw Error(error)})

			const helix =
				[...midi.outputs.values()]
				.filter((output) => is_Helix(output.name))[0]

			if(!helix)
				{throw Error("Helix not connected")}

			Helix.initialize({midi, helix})
		})

		return (
			<HopeProvider config={{initialColorMode:"dark"}} enableCssReset={false}>
				<main>

					<section>
						<h2>{"Modes.Available"}</h2>
						<Button colorScheme={(transitions.state.context._history.at(-2) == "Edit"     ) ? "accent" : "primary"} disabled={!transitions.state.can("TO_EDIT"     )} onClick={async () => {transitions.send("TO_EDIT"     )}}>EDIT     </Button>
						<Button colorScheme={(transitions.state.context._history.at(-2) == "Looper"   ) ? "accent" : "primary"} disabled={!transitions.state.can("TO_LOOPER"   )} onClick={async () => {transitions.send("TO_LOOPER"   )}}>LOOPER   </Button>
						<Button colorScheme={(transitions.state.context._history.at(-2) == "Presets"  ) ? "accent" : "primary"} disabled={!transitions.state.can("TO_PRESETS"  )} onClick={async () => {transitions.send("TO_PRESETS"  )}}>PRESETS  </Button>
						<Button colorScheme={(transitions.state.context._history.at(-2) == "Snapshots") ? "accent" : "primary"} disabled={!transitions.state.can("TO_SNAPSHOTS")} onClick={async () => {transitions.send("TO_SNAPSHOTS")}}>SNAPSHOTS</Button>
						<Button colorScheme={(transitions.state.context._history.at(-2) == "Stomps"   ) ? "accent" : "primary"} disabled={!transitions.state.can("TO_STOMPS"   )} onClick={async () => {transitions.send("TO_STOMPS"   )}}>STOMPS   </Button>
					</section>

					<section>
						<h2>{"Modes.Navigation"}</h2>
						<Button colorScheme={transitions.state.matches("Edit"     ) ? "success" : "primary"} onClick={async () => {const from = transitions.state.value; console.log({from, to:"Edit"     }); transitions.send("_TO_EDIT"     );}}>EDIT     </Button>
						<Button colorScheme={transitions.state.matches("Looper"   ) ? "success" : "primary"} onClick={async () => {const from = transitions.state.value; console.log({from, to:"Looper"   }); transitions.send("_TO_LOOPER"   );}}>LOOPER   </Button>
						<Button colorScheme={transitions.state.matches("Presets"  ) ? "success" : "primary"} onClick={async () => {const from = transitions.state.value; console.log({from, to:"Presets"  }); transitions.send("_TO_PRESETS"  );}}>PRESETS  </Button>
						<Button colorScheme={transitions.state.matches("Snapshots") ? "success" : "primary"} onClick={async () => {const from = transitions.state.value; console.log({from, to:"Snapshots"}); transitions.send("_TO_SNAPSHOTS");}}>SNAPSHOTS</Button>
						<Button colorScheme={transitions.state.matches("Stomps"   ) ? "success" : "primary"} onClick={async () => {const from = transitions.state.value; console.log({from, to:"Stomps"   }); transitions.send("_TO_STOMPS"   );}}>STOMPS   </Button>
					</section>

					<br/>

					<section class="Misc">
						<h2>{"Misc"}</h2>
						<div class="Row">
							<Button onClick={async () => {Helix.send_CC_Values([["Tuner"]])()}}>{"Tuner"}</Button>
						</div>
					</section>

					<section class="Temp">
						<div class="Row">
							<h2>{"Temp.Modes"}</h2>
							<Button onClick={async () => {Helix.send_CC_Values([["Mode_Stomps" ]])()}}>{"Stomps"   }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["Mode_Default"]])()}}>{"Snapshots"}</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["Mode_Edit"   ]])()}}>{"Edit"     }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["Mode_Toggle" ]])()}}>{"Toggle"   }</Button>
						</div>
						<div class="Row">
							<h2>{"Temp.Misc"}</h2>
							<Button onClick={async () => {Helix.send_CC_Values([["Looper"]])()}}>{"Looper"}</Button>
						</div>
					</section>

					<br/>

					<section class="Footswitches">
						<h2>{"Footswitches"}</h2>
						<div class="Row">
							<Button onClick={async () => {Helix.send_CC_Values([["FS1" ]])()}}>{"1" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS2" ]])()}}>{"2" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS3" ]])()}}>{"3" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS4" ]])()}}>{"4" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS5" ]])()}}>{"5" }</Button>
						</div>
						<div class="Row">
							<Button onClick={async () => {Helix.send_CC_Values([["FS7" ]])()}}>{"7" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS8" ]])()}}>{"8" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS9" ]])()}}>{"9" }</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS10"]])()}}>{"10"}</Button>
							<Button onClick={async () => {Helix.send_CC_Values([["FS11"]])()}}>{"11"}</Button>
						</div>
					</section>

				</main>
			</HopeProvider>
		)
	}
