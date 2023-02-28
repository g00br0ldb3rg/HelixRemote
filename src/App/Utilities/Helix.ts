//###  App  ###//
import {memoize              } from "./Class.js"
import {CC                   } from "./MIDI.js"
import {REPL_Ignore          } from "./REPL_Ignore.js"
import {wait                 } from "./Wait.js"
import {MIDI as MIDI_Settings} from "../../Settings/index.js"


//####################################################################################################################//
//##>  Exports.Class                                                                                                ##//
//####################################################################################################################//

	export class Helix{

		static _midi:  WebMidi.MIDIAccess
		static _helix: WebMidi.MIDIOutput

		static _cc_Values = {
			emptyGroups: ([] as CC_Groups  ),
			queue:       ([] as CC_Groups[]),
		}

		static initialize(
			{midi,                    helix                   }:
			{midi:WebMidi.MIDIAccess, helix:WebMidi.MIDIOutput}
		){
			this._midi  = midi
			this._helix = helix

			this._start_MIDI_Queue()
		}

		@REPL_Ignore
		@memoize
		static send_CC_Values(ccGroups:CC_Groups){
			const self = this

			return async function send_CC_Values__Callback(){
				self._cc_Values.queue.push(ccGroups)
			}
		}

		static _start_MIDI_Queue(){
			const self       = this
			let   processing = false

			setInterval(async function process_MIDI_Queue(){
				if(processing)
					{return}

				processing = true

				const ccGroups = (self._cc_Values.queue.shift() ?? self._cc_Values.emptyGroups)

				if(ccGroups.length > 0 ){console.log(JSON.stringify({
					current:   ccGroups,
					remaining: self._cc_Values.queue,
				}))}
				for(const group of ccGroups){
					for(const key of group){
						const cc = Helix.MIDI[key]

						self._helix.send([
							(176 + (cc.channel - 1)),
							cc.id,
							cc.value,
						])
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

	//@ts-ignore
	window.CC = (...args) => Helix.send_CC_Values(...args)()
	//@ts-ignore
	window.X = (id, value) => {
		Helix._helix.send([
			(176 + (1 - 1)),
			id,
			value,
		])
	}

	export namespace Helix{

		export type  MIDI = (typeof MIDI)
		export const MIDI = {
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
		}

	}


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type CC_Groups = (keyof Helix.MIDI)[][]
