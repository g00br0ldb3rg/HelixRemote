//###  App  ###//
import {ToggleMachine} from "./ToggleMachine"

//###  NPM  ###//
import {onMount}         from "solid-js"
import {atom   }         from "solid-use"
import StartAudioContext from "startaudiocontext"
import * as Tone         from "tone"
import {useMachine}      from "@xstate/solid"
import {
	Button,
	HopeProvider,
} from "@hope-ui/solid"

//###  NPM.Icons  ###//
import Icon_Wave from "~icons/mdi/hand-wave-outline"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		const [state, send] = useMachine(ToggleMachine)
		const noteCount     = atom(0)

		let synth: Tone.Synth

		onMount(async ()=>{
			StartAudioContext(Tone.context)
			synth = new Tone.Synth().toDestination()
		})

		return (
			<HopeProvider config={{initialColorMode:"dark"}} enableCssReset={false}>
				<main>

					<h1>{"Hello World"}</h1>
					<Icon_Wave width="6rem" height="6rem"/>

					<div>
						<Button onClick={() => {
							send("TOGGLE")

							const currentNoteCount = noteCount()
							const note             = (((currentNoteCount % 2) == 0) ? "C4" : "B3")

							synth.triggerAttackRelease(note, "8n")
							noteCount(currentNoteCount + 1)

						}}>
							Click me ({state.matches("active") ? "✅" : "❌"})
						</Button>
						<br/>
						<code>
							Toggled <strong>{state.context.count}</strong> times
						</code>
					</div>

				</main>
			</HopeProvider>
		)
	}
