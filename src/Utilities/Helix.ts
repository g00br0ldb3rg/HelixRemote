//###  App  ###//
import {memoize}               from "Utilities/Class.js"
import * as MIDI               from "Utilities/MIDI.js"
import {REPL_Ignore          } from "Utilities/REPL_Ignore.js"
import {wait                 } from "Utilities/Wait.js"
import {MIDI as MIDI_Settings} from "Settings/index.js"


//####################################################################################################################//
//##>  Aliases                                                                                                      ##//
//####################################################################################################################//

	type Event = MIDI.Event

	const {CC, PC} = MIDI


//####################################################################################################################//
//##>  Exports.Class                                                                                                ##//
//####################################################################################################################//

	export class Helix{

		static _midi:  WebMidi.MIDIAccess
		static _helix: WebMidi.MIDIOutput

		static _midi_Events = {
			noEvent: ([] as EventGroups  ),
			queue:   ([] as EventGroups[]),
		}

		static initialize(
			{midi,                    helix                   }:
			{midi:WebMidi.MIDIAccess, helix:WebMidi.MIDIOutput}
		){
			Helix._midi  = midi
			Helix._helix = helix

			Helix._start_MIDI_Queue()
		}

		@REPL_Ignore
		static send_MIDI(eventGroups:EventGroups)
			{Helix._midi_Events.queue.push(eventGroups)}

		static _start_MIDI_Queue(){
			let processing = false

			setInterval(async function process_MIDI_Queue(){
				if(processing)
					{return}

				processing = true

				const eventGroups = (Helix._midi_Events.queue.shift() ?? Helix._midi_Events.noEvent)

				if(eventGroups.length > 0 ){console.log(JSON.stringify({
					current:   eventGroups,
					remaining: Helix._midi_Events.queue,
				}))}
				for(const group of eventGroups){
					for(const entry of group){
						const event =
							(typeof entry === "string")
							? Helix.Button[entry]
							: entry
						Helix._helix.send(event.message)
					}

					await wait(MIDI_Settings.delay)
				}

				processing = false
			}, MIDI_Settings.delay)
		}

	}


//####################################################################################################################//
//##>  Exports.Namespace                                                                                            ##//
//####################################################################################################################//

	export namespace Helix{

		export class MachineActions{
			@memoize
			static Send_MIDI(eventGroups:EventGroups){
				return function send_MIDI__Callback(){
					Helix.send_MIDI(eventGroups)
				}
			}
		}

		export type  Button = (typeof Button)
		export const Button = {
			FS1:  CC({channel:1, id:49, value:127}),
			FS2:  CC({channel:1, id:50, value:127}),
			FS3:  CC({channel:1, id:51, value:127}),
			FS4:  CC({channel:1, id:52, value:127}),
			FS5:  CC({channel:1, id:53, value:127}),
			FS7:  CC({channel:1, id:54, value:127}),
			FS8:  CC({channel:1, id:55, value:127}),
			FS9:  CC({channel:1, id:56, value:127}),
			FS10: CC({channel:1, id:57, value:127}),
			FS11: CC({channel:1, id:58, value:127}),

			Mode_Stomps:  CC({channel:1, id:71, value:0}),
			Mode_Default: CC({channel:1, id:71, value:1}),
			Mode_Edit:    CC({channel:1, id:71, value:3}),
			Mode_Toggle:  CC({channel:1, id:71, value:4}),

			Looper: CC({channel:1, id:67, value:127}),
			Tuner:  CC({channel:1, id:68, value:127}),

			Setlist_1: CC({channel:1, id:32, value:0}),
			Setlist_2: CC({channel:1, id:32, value:1}),
			Setlist_3: CC({channel:1, id:32, value:2}),
			Setlist_4: CC({channel:1, id:32, value:3}),
			Setlist_5: CC({channel:1, id:32, value:4}),
			Setlist_6: CC({channel:1, id:32, value:5}),
			Setlist_7: CC({channel:1, id:32, value:6}),
			Setlist_8: CC({channel:1, id:32, value:7}),
		}

		export function Setlist (value:number){return [[CC({channel:1, id:32, value}), ...Preset(0)[0]!]]}
		export function Preset  (value:number){return [[PC({channel:1, value,      }),                 ]]}
		export function Snapshot(value:number){return [[CC({channel:1, id:69, value}),                 ]]}

	}


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type EventGroups =
		(Event | (keyof typeof Helix.Button))[][]
