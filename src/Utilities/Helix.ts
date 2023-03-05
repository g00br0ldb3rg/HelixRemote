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
			noEvent: ([[]] as [EventGroups, EventOptions?]  ),
			queue:   ([]   as [EventGroups, EventOptions?][]),
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
		static send_MIDI(eventGroups:EventGroups, options?:EventOptions)
			{Helix._midi_Events.queue.push([eventGroups, options])}

		static _start_MIDI_Queue()
			{setTimeout(process_MIDI_Queue, MIDI_Settings.Delay.queuedEvent)}

	}


//####################################################################################################################//
//##>  Exports.Namespace                                                                                            ##//
//####################################################################################################################//

	export namespace Helix{

		export namespace Send_MIDI{
			export type Options = Parameters<(typeof Helix.send_MIDI)>[1]

			export const NoDelay: Options = {
				delay: {
					eventGroup:  0,
					queuedEvent: 0,
				}
			}
		}

		export class MachineActions{
			@memoize
			static Send_MIDI(eventGroups:EventGroups){
				return function send_MIDI__Callback()
					{Helix.send_MIDI(eventGroups)}
			}
		}

		export type  Button = (typeof Button)
		export const Button = {
			ExpressionPedal_Toggle: CC({channel:1, id:59, value:127}),

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

			Looper_Activate:           CC({channel:1, id:67, value:127}),
			Looper_Direction_Forward:  CC({channel:1, id:65, value:0  }),
			Looper_Direction_Reverse:  CC({channel:1, id:65, value:127}),
			Looper_Speed_Full:         CC({channel:1, id:66, value:0  }),
			Looper_Speed_Half:         CC({channel:1, id:66, value:127}),
			Looper_Toggle_UndoRedo:    CC({channel:1, id:63, value:127}),
			Looper_Transport_Overdub:  CC({channel:1, id:60, value:0  }),
			Looper_Transport_Play:     CC({channel:1, id:61, value:127}),
			Looper_Transport_PlayOnce: CC({channel:1, id:62, value:127}),
			Looper_Transport_Record:   CC({channel:1, id:60, value:127}),
			Looper_Transport_Stop:     CC({channel:1, id:61, value:0  }),

			Mode_Stomps:  CC({channel:1, id:71, value:0}),
			Mode_Primary: CC({channel:1, id:71, value:1}),
			Mode_Edit:    CC({channel:1, id:71, value:3}),
			Mode_Toggle:  CC({channel:1, id:71, value:4}),

			Navigate_ParameterPage_Previous: CC({channel:1, id:81, value:0  }),
			Navigate_ParameterPage_Next:     CC({channel:1, id:81, value:127}),

			Navigate_Preset_Previous: CC({channel:1, id:72, value:0  }),
			Navigate_Preset_Next:     CC({channel:1, id:72, value:127}),

			Tempo_Tap: CC({channel:1, id:64, value:127}),
			Tuner:     CC({channel:1, id:68, value:127}),
		}

		export function Setlist (value:number){return [[CC({channel:1, id:32, value}), ...Preset(0)[0]!]]}
		export function Preset  (value:number){return [[PC({channel:1, value,      }),                 ]]}
		export function Snapshot(value:number){return [[CC({channel:1, id:69, value}),                 ]]}

		export function Expression_1(value:number){return [[CC({channel:1, id:1, value})]]}
		export function Expression_2(value:number){return [[CC({channel:1, id:2, value})]]}
		export function Expression_3(value:number){return [[CC({channel:1, id:3, value})]]}

		export function Parameter_1(value:number){return [[CC({channel:1, id:75, value})]]}
		export function Parameter_2(value:number){return [[CC({channel:1, id:76, value})]]}
		export function Parameter_3(value:number){return [[CC({channel:1, id:77, value})]]}
		export function Parameter_4(value:number){return [[CC({channel:1, id:78, value})]]}
		export function Parameter_5(value:number){return [[CC({channel:1, id:79, value})]]}
		export function Parameter_6(value:number){return [[CC({channel:1, id:80, value})]]}

	}


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type EventGroups =
		(Event | (keyof typeof Helix.Button))[][]

	type EventOptions = {
		delay: {
			eventGroup:  number
			queuedEvent: number
		}
	}


//####################################################################################################################//
//##>  Utilities                                                                                                    ##//
//####################################################################################################################//

	async function process_MIDI_Queue(){
		const [eventGroups, options] = (Helix._midi_Events.queue.shift() ?? Helix._midi_Events.noEvent)

		const delay = {
			eventGroup:  (options?.delay.eventGroup  ?? MIDI_Settings.Delay.eventGroup ),
			queuedEvent: (options?.delay.queuedEvent ?? MIDI_Settings.Delay.queuedEvent),
		}

		if(eventGroups.length > 0){
			log.MIDI.debug({
				"@":       "MIDI_Queue",
				current:   JSON.stringify(eventGroups             ),
				remaining: JSON.stringify(Helix._midi_Events.queue),
			})
		}

		for(const group of eventGroups){
			for(const entry of group){
				const event =
					(typeof entry === "string")
					? Helix.Button[entry]
					: entry

				Helix._helix.send(event.message)
				await wait(delay.eventGroup)
			}
		}

		setTimeout(process_MIDI_Queue, delay.queuedEvent)
	}
