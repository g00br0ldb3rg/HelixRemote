
//####################################################################################################################//
//##>  Setup                                                                                                        ##//
//####################################################################################################################//

	const delay = 50

	const Helix = {
		FS1:               CC({channel:1, id:49, value:127}),
		FS6:               CC({channel:1, id:73, value:127}),
		FS7:               CC({channel:1, id:54, value:127}),

		Stomps:            CC({channel:1, id:71, value:0  }),
		Presets:           CC({channel:1, id:71, value:1  }),
		Snapshots:         CC({channel:1, id:71, value:2  }),
		Edit:              CC({channel:1, id:71, value:3  }),
		StompPresetToggle: CC({channel:1, id:71, value:4  }),

		Looper:            CC({channel:1, id:67, value:127}),
	}

//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export namespace MIDI_Transitioner{

		let _midi:  WebMidi.MIDIAccess
		let _helix: WebMidi.MIDIOutput

		export function initialize(
			{midi,                    helix                   }:
			{midi:WebMidi.MIDIAccess, helix:WebMidi.MIDIOutput}
		){
			_midi  = midi
			_helix = helix
		}

		export function goFrom_Presets_To_Snapshots          (){send_CC_Values([[Helix.StompPresetToggle]])} // [x]
		export function goFrom_Snapshots_To_Presets          (){send_CC_Values([[Helix.FS1, Helix.FS7   ]])} // [x]

		export function goFrom_EditFromSnapshots_To_Snapshots(){send_CC_Values([[Helix.StompPresetToggle], [Helix.StompPresetToggle]])} // []
		export function goFrom_EditFromStomps_To_Stomps      (){send_CC_Values([[Helix.Stomps           ]])} // []
		export function goFrom_Looper_To_Stomps              (){send_CC_Values([[Helix.StompPresetToggle]])} // []
		export function goFrom_Snapshots_To_Edit             (){send_CC_Values([[Helix.Edit             ]])} // []
		export function goFrom_Snapshots_To_Stomps           (){send_CC_Values([[Helix.Stomps           ]])} // []
		export function goFrom_Stomps_To_Edit                (){send_CC_Values([[Helix.Edit             ]])} // []
		export function goFrom_Stomps_To_Looper              (){send_CC_Values([[Helix.Looper           ]])} // []
		export function goFrom_Stomps_To_Snapshots           (){send_CC_Values([[Helix.StompPresetToggle]])} // []

		async function send_CC_Values(ccValues:CC[][]){
			for(const group of ccValues){
				for(const cc of group){
					_helix.send([
						(176 + (cc.channel - 1)),
						cc.id,
						cc.value,
					])
				}

				await wait(delay)
			}
		}

	}


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type CC = {
		channel: number
		id:      number
		value:   number
	}

	function CC(cc:CC)
		{return cc}


//####################################################################################################################//
//##>  Utilities                                                                                                       ##//
//####################################################################################################################//

	export async function wait(milliseconds:number){
		await new Promise((resolve) => {
			setTimeout(resolve, milliseconds)
		})
	}
