//###  App  ###//
import {Helix} from "../../Utilities/Helix.js"

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

	const {send_CC_Values} = Helix


//####################################################################################################################//
//##>  Exports.Types                                                                                                ##//
//####################################################################################################################//

	export type Context = {
		_history: string[]
	}

	export type Event = (
		| {type:"TO_EDIT"     }
		| {type:"TO_LOOPER"   }
		| {type:"TO_PRESETS"  }
		| {type:"TO_SNAPSHOTS"}
		| {type:"TO_STOMPS"   }
		| {type:"TO_TUNER"    }

		| {type:"_TO_EDIT"     }
		| {type:"_TO_LOOPER"   }
		| {type:"_TO_PRESETS"  }
		| {type:"_TO_SNAPSHOTS"}
		| {type:"_TO_STOMPS"   }
		| {type:"_TO_TUNER"    }

		| {type:"_EXIT"        }
		| {type:"_PERSIST_MODE"}
	)


//####################################################################################################################//
//##>  Exports.Machine                                                                                              ##//
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

			Edit: {
				initial: "Initial",
				on: {
					_TO_EDIT:    {actions:[send("_PERSIST_MODE"),                    ]},
					_TO_LOOPER:  {actions:[send("_TO_STOMPS"   ), send("_TO_LOOPER" )]},
					_TO_PRESETS: {actions:[send("_TO_SNAPSHOTS"), send("_TO_PRESETS")]},
				},
				states: {
					Initial: {
						entry: (({_history}, event) => {console.log("@@@ Edit.Initial @@@", event.type, _history)}),
						always: [
							/* Order: Nested to Root Level */
							{target:"FromStomps",    cond:(({_history}) => _history.includes("Stomps"   ))},
							{target:"FromSnapshots", cond:(({_history}) => _history.includes("Snapshots"))},
						],
					},
					FromSnapshots: {
						on: {
							_EXIT:         {target:"#ModeTransitions.Snapshots", actions:["exit", send_CC_Values([["Mode_Default"]]), (({_history}) => {console.log({"--":"from Edit to Snapshots", _history:JSON.stringify(_history)})})]},
							TO_SNAPSHOTS:  {actions:[send("_EXIT"        ),                   ]},
							_TO_SNAPSHOTS: {actions:[send("TO_SNAPSHOTS" ),                   ]},
							_TO_STOMPS:    {actions:[send("_TO_SNAPSHOTS"), send("_TO_STOMPS")]},
						},
					},
					FromStomps: {
						on: {
							_EXIT:         {target:"#ModeTransitions.Stomps", actions:["exit", send_CC_Values([["Mode_Stomps"]]), (({_history}) => {console.log({"--":"from Edit to Stomps", _history:JSON.stringify(_history)})})]},
							TO_STOMPS:     {actions:[send("_EXIT"        ),                   ]},
							_TO_SNAPSHOTS: {actions:[send("_TO_STOMPS"), send("_TO_SNAPSHOTS")]},
							_TO_STOMPS:    {actions:[send("TO_STOMPS" ),                      ]},
						},
					},
				},
			},

			Looper: {
				entry: (({_history}, event) => {console.log("@@@ Looper @@@", event.type, _history)}),
				on: {
					_EXIT:         {target:"Stomps", actions:["exit", send_CC_Values([["Mode_Toggle"]]), (({_history}) => {console.log({"--":"from Looper to Stomps", _history:JSON.stringify(_history)})})]},
					TO_STOMPS:     {actions:[send("_EXIT"        ),                      ]},
					_TO_EDIT:      {actions:[send("_TO_STOMPS"   ), send("_TO_EDIT"     )]},
					_TO_LOOPER:    {actions:[send("_PERSIST_MODE"),                      ]},
					_TO_PRESETS:   {actions:[send("_TO_SNAPSHOTS"), send("_TO_PRESETS"  )]},
					_TO_SNAPSHOTS: {actions:[send("_TO_STOMPS"   ), send("_TO_SNAPSHOTS")]},
					_TO_STOMPS:    {actions:[send("TO_STOMPS"    ),                      ]},
				},
			},

			Presets: {
				entry: (({_history}, event) => {console.log("@@@ Presets @@@", event.type, _history)}),
				on: {
					_EXIT:         {target:"Snapshots", actions:["exit", send_CC_Values([["Mode_Toggle"]]), (({_history}) => {console.log({"--":"from Presets to Snapshots", _history:JSON.stringify(_history)})})]},
					TO_SNAPSHOTS:  {actions:[send("_EXIT"        ),                   ]},
					_TO_EDIT:      {actions:[send("_TO_STOMPS"   ), send("_TO_EDIT"  )]},
					_TO_LOOPER:    {actions:[send("_TO_STOMPS"   ), send("_TO_LOOPER")]},
					_TO_PRESETS:   {actions:[send("_PERSIST_MODE"),                   ]},
					_TO_SNAPSHOTS: {actions:[send("TO_SNAPSHOTS" ),                   ]},
					_TO_STOMPS:    {actions:[send("_TO_SNAPSHOTS"), send("_TO_STOMPS")]},
				},
			},

			Snapshots: {
				entry: (({_history}, event) => {console.log("@@@ Snapshots @@@", event.type, _history)}),
				on: {
					TO_EDIT:    {target:"Edit",    actions:["push_Edit_To_History",    send_CC_Values([["Mode_Edit"  ]]), (({_history}) => {console.log({"--":"from Snapshots to Edit",    _history:JSON.stringify(_history)})})]},
					TO_PRESETS: {target:"Presets", actions:["push_Presets_To_History", send_CC_Values([["FS1"        ]]), (({_history}) => {console.log({"--":"from Snapshots to Presets", _history:JSON.stringify(_history)})})]},
					TO_STOMPS:  {target:"Stomps",  actions:["push_Stomps_To_History",  send_CC_Values([["Mode_Stomps"]]), (({_history}) => {console.log({"--":"from Snapshots to Stomps",  _history:JSON.stringify(_history)})})]},

					_TO_EDIT:      {actions:[send("TO_EDIT"      ),                   ]},
					_TO_LOOPER:    {actions:[send("TO_STOMPS"    ), send("_TO_LOOPER")]},
					_TO_PRESETS:   {actions:[send("TO_PRESETS"   ),                   ]},
					_TO_SNAPSHOTS: {actions:[send("_PERSIST_MODE"),                   ]},
					_TO_STOMPS:    {actions:[send("TO_STOMPS"    ),                   ]},
				},
			},

			Stomps: {
				entry: (({_history}, event) => {console.log("@@@ Stomps @@@", event.type, _history)}),
				on: {
					_EXIT:        {target:"Snapshots", actions:["exit",                   send_CC_Values([["Mode_Default"]]), (({_history}) => {console.log({"--":"from Stomps to Snapshots", _history:JSON.stringify(_history)})})]},
					TO_EDIT:      {target:"Edit",      actions:["push_Edit_To_History",   send_CC_Values([["Mode_Edit"   ]]), (({_history}) => {console.log({"--":"from Stomps to Edit",      _history:JSON.stringify(_history)})})]},
					TO_LOOPER:    {target:"Looper",    actions:["push_Looper_To_History", send_CC_Values([["Looper"      ]]), (({_history}) => {console.log({"--":"from Stomps to Looper",    _history:JSON.stringify(_history)})})]},
					TO_SNAPSHOTS: {actions:[send("_EXIT")]                                                                                                                                                                          },

					_TO_EDIT:      {actions:[send("TO_EDIT"      ),                    ]},
					_TO_LOOPER:    {actions:[send("TO_LOOPER"    ),                    ]},
					_TO_PRESETS:   {actions:[send("_TO_SNAPSHOTS"), send("_TO_PRESETS")]},
					_TO_SNAPSHOTS: {actions:[send("TO_SNAPSHOTS" ),                    ]},
					_TO_STOMPS:    {actions:[send("_PERSIST_MODE"),                    ]},
				},
			},

		},

	}).withConfig({

		actions: {
			exit: assign(({_history}) => ({_history:_history.slice(0, (_history.length - 1))})),

			persist_Mode(){/* Do Nothing */ console.log({"@@@":"MODE.PERSISTED"})},

			push_Edit_To_History:      assign(({_history}) => ({_history:[..._history, "Edit"     ]})),
			push_Looper_To_History:    assign(({_history}) => ({_history:[..._history, "Looper"   ]})),
			push_Presets_To_History:   assign(({_history}) => ({_history:[..._history, "Presets"  ]})),
			push_Snapshots_To_History: assign(({_history}) => ({_history:[..._history, "Snapshots"]})),
			push_Stomps_To_History:    assign(({_history}) => ({_history:[..._history, "Stomps"   ]})),
			push_Tuner_To_History:     assign(({_history}) => ({_history:[..._history, "Tuner"    ]})),
		},

	})
