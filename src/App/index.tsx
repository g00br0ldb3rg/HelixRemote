//###  App  ###//
import {ModeTransitions      } from "./Machines/ModeTransitions/index.js"
import {MIDI as MIDI_Settings} from "Settings/index.js"
import {Helix                } from "Utilities/Helix.js"
import * as MIDI               from "Utilities/MIDI.js"
import {useMachine}            from "Utilities/XState-Solid.js"
import {wait      }            from "Utilities/Wait"

//###  NPM  ###//
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
			log.Helix.debug({"@":"FINISHED", state:JSON.stringify(state.value)})
		}

		onMount(async ()=>{

			const midi = await Promise.race([
				new Promise<WebMidi.MIDIAccess>(async (resolve) => {
					const midi =
						await navigator.requestMIDIAccess()
						.catch((error) => {throw Error(error)})

					resolve(midi)
				}),
				new Promise<void>(async (resolve) => {
					await wait(MIDI_Settings.timeout)
					resolve()
				}),
			])

			if(!midi){throw new MIDI.Error("`MIDIAccess` connection was unsuccessful.")}
			else     {log.MIDI.debug("`MIDIAccess` connected")                         }

			const helix =
				[...midi.outputs.values()]
				.filter((output) => MIDI.Device.is_Helix(output.name))[0]

			if(!helix){throw new MIDI.Error("Helix device is not connected.")}
			else      {log.MIDI.debug("Helix connected")                     }

			Helix.initialize({midi, helix})
		})

		return (
			<HopeProvider
				config         = {{initialColorMode:"dark"}}
				enableCssReset = {false                    }
			>
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
							<Button onClick={() => {send_MIDI([["Tuner"    ],                                 ])}}>{"Tuner"    }</Button>
							<Button onClick={() => {send_MIDI([["Tempo_Tap"],                                 ])}}>{"Tap Tempo"}</Button>
							<Button onClick={() => {send_MIDI([["Mode_Edit"], ["Mode_Stomps"], ["Mode_Toggle"]])}}>{"Reset"    }</Button>
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

					<Section title="Navigation" heading={false}>
						<Row title="Navigation.Setlists">
							<Button onClick={() => {send_MIDI(Helix.Setlist(0))}}>{"1"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(1))}}>{"2"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(2))}}>{"3"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(3))}}>{"4"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(4))}}>{"5"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(5))}}>{"6"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(6))}}>{"7"}</Button>
							<Button onClick={() => {send_MIDI(Helix.Setlist(7))}}>{"8"}</Button>
						</Row>
						<Row title="Navigation.Presets">
							<Range onChange={(value) => {send_MIDI(Helix.Preset(value))}}>{"Preset"}</Range>
						</Row>
						<Row title="Navigation.Snapshots">
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

					<br/>

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

					<br/>

					<Section title="Looper" heading={false}>
						<Row title="Looper.Transport">
							<Button onClick={() => {send_MIDI([["Looper_Transport_Overdub" ]])}}>{"Overdub" }</Button>
							<Button onClick={() => {send_MIDI([["Looper_Transport_Play"    ]])}}>{"Play"    }</Button>
							<Button onClick={() => {send_MIDI([["Looper_Transport_PlayOnce"]])}}>{"PlayOnce"}</Button>
							<Button onClick={() => {send_MIDI([["Looper_Transport_Record"  ]])}}>{"Record"  }</Button>
							<Button onClick={() => {send_MIDI([["Looper_Transport_Stop"    ]])}}>{"Stop"    }</Button>
						</Row>
						<Row title="Looper.Utilities">
							<Button onClick={() => {send_MIDI([["Looper_Toggle_UndoRedo"]])}}>{"UndoRedo"}</Button>
						</Row>
						<Row title="Looper.Speed">
							<Button onClick={() => {send_MIDI([["Looper_Speed_Full"]])}}>{"Full"}</Button>
							<Button onClick={() => {send_MIDI([["Looper_Speed_Half"]])}}>{"Half"}</Button>
						</Row>
						<Row title="Looper.Direction">
							<Button onClick={() => {send_MIDI([["Looper_Direction_Forward"]])}}>{"Forward"}</Button>
							<Button onClick={() => {send_MIDI([["Looper_Direction_Reverse"]])}}>{"Reverse"}</Button>
						</Row>
					</Section>

					<br/>

					<Section title="Navigate" heading={false}>
						<Row title="Navigate.ParameterPages">
							<Button onClick={() => {send_MIDI([["Navigate_ParameterPage_Previous"]])}}>{"Previous"}</Button>
							<Button onClick={() => {send_MIDI([["Navigate_ParameterPage_Next"    ]])}}>{"Next"    }</Button>
						</Row>
						<Row title="Navigate.Presets">
							<Button onClick={() => {send_MIDI([["Navigate_Preset_Previous"]])}}>{"Previous"}</Button>
							<Button onClick={() => {send_MIDI([["Navigate_Preset_Next"    ]])}}>{"Next"    }</Button>
						</Row>
					</Section>

					<br/>

					<Section title="Parameters">
						<Row>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_1(value))}}>{"1"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_2(value))}}>{"2"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_3(value))}}>{"3"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_4(value))}}>{"4"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_5(value))}}>{"5"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Parameter_6(value))}}>{"6"}</Range>
						</Row>
					</Section>

					<Section title="Expression" heading={false}>
						<Row title="Expression.Values">
							<Range onInput={(value) => {send_MIDI(Helix.Expression_1(value))}}>{"1"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Expression_2(value))}}>{"2"}</Range>
							<Range onInput={(value) => {send_MIDI(Helix.Expression_3(value))}}>{"3"}</Range>
						</Row>
						<Row title="Expression.Utilities">
							<Button onClick={() => {send_MIDI([["ExpressionPedal_Toggle"]])}}>{"Toggle_Pedal"}</Button>
						</Row>
					</Section>

					<br/>

					<Section title="PlayEdit">
						<Row>
							<Button onClick={() => {send_MIDI([["PlayEdit_Toggle"   ]])}}>{"Toggle"}</Button>
							<Button onClick={() => {send_MIDI([["PlayEdit_ToggleOff"]])}}>{"Off"   }</Button>
						</Row>
					</Section>

				</main>
			</HopeProvider>
		)
	}


//####################################################################################################################//
//##>  Components                                                                                                   ##//
//####################################################################################################################//

	function Range(props:ParentProps<{
		onChange?: ((value:number) => void)
		onInput?:  ((value:number) => void)
	}>){
		return (
			<div>
				<span>
					{props.children}
				</span>

				<input
					type     = {"range"                                                               }
					value    = {0                                                                     }
					min      = {0                                                                     }
					max      = {127                                                                   }
					step     = {1                                                                     }
					onChange = {({currentTarget:{valueAsNumber}}) => {props.onChange?.(valueAsNumber)}}
					onInput  = {({currentTarget:{valueAsNumber}}) => {props.onInput ?.(valueAsNumber)}}
				/>
			</div>
		)
	}

	function Section(props:ParentProps<{
		title:    string
		heading?: boolean
	}>){
		const {
			children,
			title,
			heading = (() => true),
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
