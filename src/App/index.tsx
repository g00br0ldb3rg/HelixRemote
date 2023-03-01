//###  App  ###//
import {ModeTransitions} from "./Machines/ModeTransitions/index.js"
import {Helix          } from "Utilities/Helix.js"
import * as MIDI         from "Utilities/MIDI.js"
import {useMachine}      from "Utilities/XState-Solid.js"

//###  NPM  ###//
import {atom       } from "solid-use"
import {inspect    } from "@xstate/inspect"
import {destructure} from "@solid-primitives/destructure"
import {
	For,
	onMount,
	ParentProps,
} from "solid-js"
import {
	Button,
	HopeProvider,
} from "@hope-ui/solid"


//####################################################################################################################//
//##>  Aliases                                                                                                      ##//
//####################################################################################################################//

	const {
		ActualEvent,
		EnsuredEvent,
		StateNames: modes,
	} = ModeTransitions

	const {send_MIDI} = Helix


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		//inspect({iframe:false})

		const modeTransitions = useMachine(ModeTransitions.Machine, {
			//devTools: true,
		})

		const {state} = modeTransitions

		function send(event:ModeTransitions.EventName){
			modeTransitions.send(event)
			console.log(JSON.stringify({"@":"FINISHED", state:state.value}))
		}

		onMount(async ()=>{
			const midi =
				await navigator.requestMIDIAccess()
				.catch((error) => {throw Error(error)})

			const helix =
				[...midi.outputs.values()]
				.filter((output) => MIDI.Device.is_Helix(output.name))[0]

			if(!helix)
				{throw Error("Helix not connected")}

			Helix.initialize({midi, helix})
		})

		return (
			<HopeProvider config={{initialColorMode:"dark"}} enableCssReset={false}>
				<main>

					{/*<Section title="_Modes-Available">
						<Row>
							<For each={modes}>{(mode) => (
								<Button
									colorScheme = {(state.context._path.at(-2) == mode) ? "accent" : "primary"}
									disabled    = {!state.nextEvents.includes(ActualEvent(mode))              }
									onClick     = {() => {send(ActualEvent(mode))}                            }
								>
									{ActualEvent(mode)}
								</Button>
							)}</For>
						</Row>
					</Section>*/}

					{/*<Section title="_Modes-Navigation">
						<Row>
							<For each={modes}>{(mode) => (
								<Button
									colorScheme = {state.matches(mode) ? "success" : "primary"}
									onClick     = {() => {send(EnsuredEvent(mode))}           }
								>
									{EnsuredEvent(mode)}
								</Button>
							)}</For>
						</Row>
					</Section>*/}

					<Section title="Modes">
						<Row>
							<For each={modes}>{(mode) => (
								<Button
									colorScheme = {state.matches(mode) ? "success" : "primary"}
									onClick     = {() => {send(EnsuredEvent(mode))}           }
								>
									{mode}
								</Button>
							)}</For>
						</Row>
					</Section>

					<br/>

					<Section title="Utilities">
						<Row>
							<Button onClick={() => {send_MIDI([["Tuner"]])}}>{"Tuner"}</Button>
						</Row>
					</Section>

					{/*<Section title="_Controls-All" heading={false}>
						<Row title="_Modes-Native">
							<Button onClick={() => {send_MIDI([["Mode_Stomps" ]])}}>{"Stomps"   }</Button>
							<Button onClick={() => {send_MIDI([["Mode_Default"]])}}>{"Snapshots"}</Button>
							<Button onClick={() => {send_MIDI([["Mode_Edit"   ]])}}>{"Edit"     }</Button>
							<Button onClick={() => {send_MIDI([["Mode_Toggle" ]])}}>{"Toggle"   }</Button>
						</Row>
						<Row title="_Utilities">
							<Button onClick={() => {send_MIDI([["Tuner" ]])}}>{"Tuner" }</Button>
							<Button onClick={() => {send_MIDI([["Looper"]])}}>{"Looper"}</Button>
						</Row>
					</Section>*/}

					<br/>

					<Section title="Setlists">
						<Row>
							<Button onClick={() => {send_MIDI(Helix.Setlist(0))}}>{"1"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(1))}}>{"2"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(2))}}>{"3"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(3))}}>{"4"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(4))}}>{"5"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(5))}}>{"6"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(6))}}>{"7"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(7))}}>{"8"}</Button>
						</Row>
					</Section>

					<Section title="Snapshots">
						<Row>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(0))}}>{"1"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(1))}}>{"2"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(2))}}>{"3"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(3))}}>{"4"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(4))}}>{"5"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(5))}}>{"6"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(6))}}>{"7"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Snapshot(7))}}>{"8"}</Button>
						</Row>
					</Section>

					<Section title="Footswitches">
						<Row>
							<Button onClick={() => {send_MIDI([["FS1" ]])}}>{"1"}</Button>
							<Button onClick={() => {send_MIDI([["FS2" ]])}}>{"2"}</Button>
							<Button onClick={() => {send_MIDI([["FS3" ]])}}>{"3"}</Button>
							<Button onClick={() => {send_MIDI([["FS4" ]])}}>{"4"}</Button>
							<Button onClick={() => {send_MIDI([["FS5" ]])}}>{"5"}</Button>
						</Row>
						<Row>
							<Button onClick={() => {send_MIDI([["FS7" ]])}}>{"7" }</Button>
							<Button onClick={() => {send_MIDI([["FS8" ]])}}>{"8" }</Button>
							<Button onClick={() => {send_MIDI([["FS9" ]])}}>{"9" }</Button>
							<Button onClick={() => {send_MIDI([["FS10"]])}}>{"10"}</Button>
							<Button onClick={() => {send_MIDI([["FS11"]])}}>{"11"}</Button>
						</Row>
					</Section>

				</main>
			</HopeProvider>
		)
	}


//####################################################################################################################//
//##>  Components                                                                                                   ##//
//####################################################################################################################//

	function Section(props:ParentProps<{
		title:    string
		heading?: boolean
	}>){
		const {
			children,
			title,
			heading = ()=>true,
		} = destructure(props)

		return (
			<section classList={{SECTION:true, [title()]:true}}>
				{(heading()) && (
					<h2>{title()}</h2>
				)}
				{children}
			</section>
		)
	}

	function Row(props:ParentProps<{
		title?: string
	}>){
		const {
			children,
			title,
		} = destructure(props)

		return (
			<div class="ROW">
				{(title?.()) && (
					<h2>{title()}</h2>
				)}
				{children}
			</div>
		)
	}
