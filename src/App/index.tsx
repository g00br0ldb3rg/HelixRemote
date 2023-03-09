//###  App  ###//
import {ModeTransitions      }  from "./Machines/ModeTransitions/index.js"
import {MIDI as MIDI_Settings}  from "Settings/index.js"
import {Helix                }  from "Utilities/Helix.js"
import * as MIDI                from "Utilities/MIDI.js"
import {useMachine, UseMachine} from "Utilities/XState-Solid.js"
import {wait                  } from "Utilities/Wait"

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
	const {NoDelay  } = Helix.Send_MIDI


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function App(){
		//inspect({iframe:false})

		const modeTransitions = useMachine(ModeTransitions.Machine, {
			//devTools: true,
		})

		const {state} = modeTransitions

		const _send = modeTransitions.send
		modeTransitions.send =
			function send(event:ModeTransitions.EventName){
				_send(event)
				log.Helix.debug({"@":"FINISHED", state:JSON.stringify(state.value)})
			} as any

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

					<Row>

						<Column>
							<Button onClick={() => {send_MIDI([["Tuner"]])}}>{"Tuner"}</Button>
						</Column>

						<Spacer/>

						<Column>
							<Button onClick={() => {send_MIDI([["Tempo_Tap"]])}}>{"Tempo"}</Button>
						</Column>

					</Row>

					<br/>

					<Row>

						<Column>
							<Button onClick={() => {send_MIDI([["Mode_Edit"], ["Mode_Stomps"], ["Mode_Toggle"]])}}>{"Reset"    }</Button>
						</Column>

						<Spacer/>

						<Column>
							<Row>
								<ModeButton mode="Presets"   {...{modeTransitions}}>{"Preset"  }</ModeButton>
								<ModeButton mode="Snapshots" {...{modeTransitions}}>{"Snapshot"}</ModeButton>
							</Row>
							<Row>
								<ModeButton mode="Edit"   {...{modeTransitions}}>{"Edit" }</ModeButton>
								<ModeButton mode="Stomps" {...{modeTransitions}}>{"Stomp"}</ModeButton>
							</Row>
							<Row>
								<ModeButton mode="Looper" {...{modeTransitions}}>{"Looper"}</ModeButton>
							</Row>
						</Column>

					</Row>

					<br/>

					<Column>
						<Row>
							<Button onClick={() => {send_MIDI([["ExpressionPedal_Toggle"]])}}>{"Toggle_Pedal"}</Button>
						</Row>
						<Row>
							<Slider onInput={(value) => {send_MIDI(Helix.Expression_1(value), NoDelay)}}>{"1"}</Slider>
							<Slider onInput={(value) => {send_MIDI(Helix.Expression_2(value), NoDelay)}}>{"2"}</Slider>
							<Slider onInput={(value) => {send_MIDI(Helix.Expression_3(value), NoDelay)}}>{"3"}</Slider>
						</Row>
					</Column>

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

				</main>
			</HopeProvider>
		)
	}


//####################################################################################################################//
//##>  Components                                                                                                   ##//
//####################################################################################################################//

	function ModeButton(props:ParentProps<{
		mode:            ModeTransitions.StateName
		modeTransitions: UseMachine<ModeTransitions.Machine>
	}>){
		const {
			children,
			mode,
			modeTransitions,
		} = destructure(props)

		const {state, send} = modeTransitions()

		return (
			<Button
				colorScheme = {state.matches(mode()) ? "success" : "primary"}
				onClick     = {() => {send(EnsuredEvent(mode()))}           }
			>
				{children}
			</Button>
		)
	}

	function Slider(props:ParentProps<{
		onChange?: ((value:number) => void)
		onInput?:  ((value:number) => void)
	}>){
		return (
			<div>
				<span>
					{props.children}
				</span>

				<input
					class    = {"SLIDER"                                                              }
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

	function Column(props:ParentProps<{
		title?: string
	}>){
		const {
			children,
			title,
		} = destructure(props)

		return (
			<div class="COLUMN">
				{(title?.()) && (
					<h2>{title()}</h2>
				)}
				{children}
			</div>
		)
	}

	function Spacer(){
		return (
			<div class="SPACER"/>
		)
	}
