//###  App  ###//
import {MIDI_Transitioner} from "../../Utilities/MIDI_Transitioner"

//###  NPM  ###//
import {
	actions,
	assign,
	createMachine,
	send,
} from "xstate"


//####################################################################################################################//
//##>  Aliases                                                                                                      ##//
//####################################################################################################################//

	const {choose} = actions


//####################################################################################################################//
//##>  Types                                                                                                        ##//
//####################################################################################################################//

	type Context = {
		_history: string[]
	}

	type Event =
		| {type:"TO_EDIT"     }
		| {type:"TO_LOOPER"   }
		| {type:"TO_PRESETS"  }
		| {type:"TO_SNAPSHOTS"}
		| {type:"TO_STOMPS"   }
		| {type:"RESET"       }


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export const ModeTransitions = createMachine<Context, Event>({

		id:      "ModeTransitions",
		initial: "Snapshots",

		predictableActionArguments: true,
		preserveActionOrder:        true,

		context: {
			_history: ["Snapshots"],
		},

		states: {
			Snapshots: {
				on: {
					TO_PRESETS: {target:"Presets", actions:["push_Presets_To_History", "goFrom_Snapshots_To_Presets"]},
					TO_STOMPS:  {target:"Stomps",  actions:["push_Stomps_To_History",  "goFrom_Snapshots_To_Stomps" ]},
					TO_EDIT:    {target:"Edit",    actions:["push_Edit_To_History",    "goFrom_Snapshots_To_Edit"   ]},
				},
			},
			Presets: {
				on: {
					TO_SNAPSHOTS: {target:"Snapshots", actions:["pop_History", "goFrom_Presets_To_Snapshots"]},
					RESET:        {actions:[send("TO_SNAPSHOTS")]},
				},
			},
			Edit: {
				initial: "Initial",
				states: {
					Initial: {
						always: [
							{target:"FromSnapshots", cond:({_history}) => {console.log(_history); return _history.includes("Snapshots") && !_history.includes("Stomps")}},
							{target:"FromStomps",    cond:({_history}) => {console.log(_history); return _history.includes("Stomps"   )                                }},
						],
					},
					FromSnapshots: {
						on: {
							TO_SNAPSHOTS: {target:"#ModeTransitions.Snapshots", actions:["pop_History", "goFrom_EditFromSnapshots_To_Snapshots"]},
							RESET:        {actions:[send("TO_SNAPSHOTS")]},
						},
					},
					FromStomps: {
						on: {
							TO_STOMPS: {target:"#ModeTransitions.Stomps", actions:["pop_History", "goFrom_EditFromStomps_To_Stomps"]},
							RESET:     {actions:[send("TO_STOMPS"), send("RESET")]},
						},
					},
				},
			},
			Stomps: {
				on: {
					TO_SNAPSHOTS: {target:"Snapshots", actions:["pop_History",            "goFrom_Stomps_To_Snapshots"]},
					TO_LOOPER:    {target:"Looper",    actions:["push_Looper_To_History", "goFrom_Stomps_To_Looper"   ]},
					TO_EDIT:      {target:"Edit",      actions:["push_Edit_To_History",   "goFrom_Stomps_To_Edit"     ]},
					RESET:        {actions:[send("TO_SNAPSHOTS")]},
				},
			},
			Looper: {
				on: {
					TO_STOMPS: {target:"Stomps", actions:["pop_History", "goFrom_Looper_To_Stomps"]},
					RESET:     {actions:[send("TO_STOMPS"), send("RESET")]},
				},
			},
		},

	}).withConfig({

		actions: {
			pop_History: assign(({_history}) => ({_history:_history.slice(0, (_history.length - 1))})),

			push_Edit_To_History:      assign(({_history}) => ({_history:[..._history, "Edit"     ]})),
			push_Looper_To_History:    assign(({_history}) => ({_history:[..._history, "Looper"   ]})),
			push_Presets_To_History:   assign(({_history}) => ({_history:[..._history, "Presets"  ]})),
			push_Snapshots_To_History: assign(({_history}) => ({_history:[..._history, "Snapshots"]})),
			push_Stomps_To_History:    assign(({_history}) => ({_history:[..._history, "Stomps"   ]})),

			goFrom_EditFromSnapshots_To_Snapshots: (() => {MIDI_Transitioner.goFrom_EditFromSnapshots_To_Snapshots()}),
			goFrom_EditFromStomps_To_Stomps:       (() => {MIDI_Transitioner.goFrom_EditFromStomps_To_Stomps      ()}),
			goFrom_Looper_To_Stomps:               (() => {MIDI_Transitioner.goFrom_Looper_To_Stomps              ()}),
			goFrom_Presets_To_Snapshots:           (() => {MIDI_Transitioner.goFrom_Presets_To_Snapshots          ()}),
			goFrom_Snapshots_To_Edit:              (() => {MIDI_Transitioner.goFrom_Snapshots_To_Edit             ()}),
			goFrom_Snapshots_To_Presets:           (() => {MIDI_Transitioner.goFrom_Snapshots_To_Presets          ()}),
			goFrom_Snapshots_To_Stomps:            (() => {MIDI_Transitioner.goFrom_Snapshots_To_Stomps           ()}),
			goFrom_Stomps_To_Edit:                 (() => {MIDI_Transitioner.goFrom_Stomps_To_Edit                ()}),
			goFrom_Stomps_To_Looper:               (() => {MIDI_Transitioner.goFrom_Stomps_To_Looper              ()}),
			goFrom_Stomps_To_Snapshots:            (() => {MIDI_Transitioner.goFrom_Stomps_To_Snapshots           ()}),

			//goFrom_Presets_To_Stomps:           choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Presets_To_Snapshots:        choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Presets_To_Edit:             choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Snapshots_To_Presets:        choose([{actions:(() => [send("RESET")])}]),
			//goFrom_EditFromPresets_To_Presets: choose([{actions:(() => [send("RESET")])}]),
			//goFrom_EditFromStomps_To_Stomps:   choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Stomps_To_Presets:           choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Stomps_To_Looper:            choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Stomps_To_Edit:              choose([{actions:(() => [send("RESET")])}]),
			//goFrom_Looper_To_Stomps:            choose([{actions:(() => [send("RESET")])}]),
		},

	})
