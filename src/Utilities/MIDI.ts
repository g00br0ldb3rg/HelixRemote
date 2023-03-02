//####################################################################################################################//
//##>  Setup                                                                                                        ##//
//####################################################################################################################//


	class MIDI_Error extends globalThis.Error{
		override name = "MIDI_Error"
	}


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export const Error = MIDI_Error

	export type CC = {channel:number, id:   number, value:number}
	export type PC = {channel:number, value:number,             }

	export function CC(cc:CC){return {type:("CC" as const), message:[(176 + (cc.channel - 1)), cc.id,    cc.value]}}
	export function PC(pc:PC){return {type:("PC" as const), message:[(192 + (pc.channel - 1)), pc.value,         ]}}

	export type Event =
		| ReturnType<typeof CC>
		| ReturnType<typeof PC>

	export namespace Device{
		export function is_Helix(midiDevice_Name:(string | undefined))
			{return midiDevice_Name?.includes("Line 6 Helix")}
	}
