//###  NPM  ###//
import {createMachine} from "xstate"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export const ModeControls = createMachine({
		id: "ModeControls",
		initial: "Presets",
		states: {
			Presets: {},
			Snapshots: {},
			Edit: {},
			Stomps: {},
			Looper: {},
		},
		on: {
			ToPresets: {
				target: ".Presets",
			},
			ToEdit: {
				target: ".Edit",
			},
			ToStomps: {
				target: ".Stomps",
			},
			ToLooper: {
				target: ".Looper",
			},
			ToSnapshots: {
				target: ".Snapshots",
			},
		},
		schema: {
			context: {} as {},
			events: {} as
				| { type: "ToPresets" }
				| { type: "ToEdit" }
				| { type: "ToStomps" }
				| { type: "ToLooper" }
				| { type: "ToSnapshots" },
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
	}).withContext({
		history: [],
	})
