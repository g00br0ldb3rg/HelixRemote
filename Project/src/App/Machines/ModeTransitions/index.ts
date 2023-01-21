//###  NPM  ###//
import {
	actions,
	assign,
	createMachine,
	send,
} from "xstate"


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
		initial: "Presets",

		predictableActionArguments: true,
		preserveActionOrder:        true,

		context: {
			_history: ["Presets"],
		},

		states: {
			Presets: {
				on: {
					TO_STOMPS:    {target:"Stomps",    actions:["push_Stomps_To_History"   ]},
					TO_SNAPSHOTS: {target:"Snapshots", actions:["push_Snapshots_To_History"]},
					TO_EDIT:      {target:"Edit",      actions:["push_Edit_To_History"     ]},
				},
			},
			Snapshots: {
				on: {
					TO_PRESETS: {target:"Presets", actions:["pop_History"]},
					RESET:      {actions:[send("TO_PRESETS")]},
				},
			},
			Edit: {
				initial: "Initial",
				states: {
					Initial: {
						always: [
							{target:"FromStomps",  cond:({_history}) => _history.includes("Stomps" )},
							{target:"FromPresets", cond:({_history}) => _history.includes("Presets")},
						],
					},
					FromPresets: {
						on: {
							TO_PRESETS: {target:"#ModeTransitions.Presets", actions:["pop_History"]},
							RESET:      {actions:[send("TO_PRESETS")]},
						},
					},
					FromStomps: {
						on: {
							TO_STOMPS: {target:"#ModeTransitions.Stomps", actions:["pop_History"]},
							RESET:     {actions:[send("TO_STOMPS"), send("RESET")]},
						},
					},
				},
			},
			Stomps: {
				on: {
					TO_PRESETS: {target:"Presets", actions:["pop_History"           ]},
					TO_LOOPER:  {target:"Looper",  actions:["push_Looper_To_History"]},
					TO_EDIT:    {target:"Edit",    actions:["push_Edit_To_History"  ]},
					RESET:      {actions:[send("TO_PRESETS")]},
				},
			},
			Looper: {
				on: {
					TO_STOMPS: {target:"Stomps", actions:["pop_History"]},
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
		},

	})
