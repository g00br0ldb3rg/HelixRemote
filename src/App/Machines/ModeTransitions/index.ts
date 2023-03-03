//###  App  ###//
import {Helix} from "Utilities/Helix.js"

//###  NPM  ###//
import {
	debounce,
	throttle,
} from "lodash-es"
import {
	assign,
	createMachine,
	raise,
} from "xstate"


//####################################################################################################################//
//##>  Aliases                                                                                                      ##//
//####################################################################################################################//

	const {Send_MIDI} = Helix.MachineActions

	type Context   = ModeTransitions.Context
	type Event     = ModeTransitions.Event
	type EventName = ModeTransitions.EventName


//####################################################################################################################//
//##>  Machine                                                                                                      ##//
//####################################################################################################################//

	const _Machine = createMachine<Context, Event>({

		id:      "ModeTransitions",
		initial: "Snapshots",

		predictableActionArguments: false,
		preserveActionOrder:        true,

		context: {
			_path: ["Snapshots"],
		},

		on: {
			"_PERSIST_MODE": {actions:["Log_ModePersisted"]},
			"*":             {actions:["Log_InvalidEvent" ]},
		},

		states: {

			Edit: {
				initial: "Initial",
				on: {
					TO_EDIT:    {actions:[raise("_PERSIST_MODE"),                    ]},
					TO_LOOPER:  {actions:[raise("TO_STOMPS"    ), raise("TO_LOOPER" )]},
					TO_PRESETS: {actions:[raise("TO_SNAPSHOTS" ), raise("TO_PRESETS")]},
				},
				states: {
					Initial: {
						entry: Log_Entry("Edit.Initial"),
						always: [
							/* Order: Nested to Root Level */
							{target:"FromStomps",    cond:(({_path}) => _path.includes("Stomps"   ))},
							{target:"FromSnapshots", cond:(({_path}) => _path.includes("Snapshots"))},
						],
					},
					FromSnapshots: {
						on: {
							_EXIT:         {target:"#ModeTransitions.Snapshots", actions:["Pop_Path", Send_MIDI([["Mode_Default"]]), Log_Transition({from:"Edit", to:"Snapshots"})]},
							_TO_SNAPSHOTS: {actions:[raise("_EXIT"        ),                   ]},
							TO_SNAPSHOTS:  {actions:[raise("_TO_SNAPSHOTS"),                   ]},
							TO_STOMPS:     {actions:[raise("TO_SNAPSHOTS" ), raise("TO_STOMPS")]},
						},
					},
					FromStomps: {
						on: {
							_EXIT:        {target:"#ModeTransitions.Stomps", actions:["Pop_Path", Send_MIDI([["Mode_Stomps"]]), Log_Transition({from:"Edit", to:"Stomps"})]},
							_TO_STOMPS:   {actions:[raise("_EXIT"     ),                      ]},
							TO_SNAPSHOTS: {actions:[raise("TO_STOMPS" ), raise("TO_SNAPSHOTS")]},
							TO_STOMPS:    {actions:[raise("_TO_STOMPS"),                      ]},
						},
					},
				},
			},

			Looper: {
				entry: Log_Entry("Looper"),
				on: {
					_EXIT:        {target:"Stomps", actions:["Pop_Path", Send_MIDI([["Mode_Toggle"]]), Log_Transition({from:"Looper", to:"Stomps"})]},
					_TO_STOMPS:   {actions:[raise("_EXIT"        ),                      ]},
					TO_EDIT:      {actions:[raise("TO_STOMPS"    ), raise("TO_EDIT"     )]},
					TO_LOOPER:    {actions:[raise("_PERSIST_MODE"),                      ]},
					TO_PRESETS:   {actions:[raise("TO_SNAPSHOTS" ), raise("TO_PRESETS"  )]},
					TO_SNAPSHOTS: {actions:[raise("TO_STOMPS"    ), raise("TO_SNAPSHOTS")]},
					TO_STOMPS:    {actions:[raise("_TO_STOMPS"   ),                      ]},
				},
			},

			Presets: {
				entry: Log_Entry("Presets"),
				on: {
					_EXIT:         {target:"Snapshots", actions:["Pop_Path", Send_MIDI([["Mode_Toggle"]]), Log_Transition({from:"Presets", to:"Snapshots"})]},
					_TO_SNAPSHOTS: {actions:[raise("_EXIT"        ),                   ]},
					TO_EDIT:       {actions:[raise("TO_STOMPS"    ), raise("TO_EDIT"  )]},
					TO_LOOPER:     {actions:[raise("TO_STOMPS"    ), raise("TO_LOOPER")]},
					TO_PRESETS:    {actions:[raise("_PERSIST_MODE"),                   ]},
					TO_SNAPSHOTS:  {actions:[raise("_TO_SNAPSHOTS"),                   ]},
					TO_STOMPS:     {actions:[raise("TO_SNAPSHOTS" ), raise("TO_STOMPS")]},
				},
			},

			Snapshots: {
				entry: Log_Entry("Snapshots"),
				on: {
					_TO_EDIT:     {target:"Edit",    actions:[Push_Path("Edit"   ), Send_MIDI([["Mode_Edit"  ]]), Log_Transition({from:"Snapshots", to:"Edit"   })]},
					_TO_PRESETS:  {target:"Presets", actions:[Push_Path("Presets"), Send_MIDI([["FS1"        ]]), Log_Transition({from:"Snapshots", to:"Presets"})]},
					_TO_STOMPS:   {target:"Stomps",  actions:[Push_Path("Stomps" ), Send_MIDI([["Mode_Stomps"]]), Log_Transition({from:"Snapshots", to:"Stomps" })]},
					TO_EDIT:      {actions:[raise("_TO_EDIT"     ),                   ]},
					TO_LOOPER:    {actions:[raise("TO_STOMPS"    ), raise("TO_LOOPER")]},
					TO_PRESETS:   {actions:[raise("_TO_PRESETS"  ),                   ]},
					TO_SNAPSHOTS: {actions:[raise("_PERSIST_MODE"),                   ]},
					TO_STOMPS:    {actions:[raise("_TO_STOMPS"   ),                   ]},
				},
			},

			Stomps: {
				entry: Log_Entry("Stomps"),
				on: {
					_EXIT:         {target:"Snapshots", actions:["Pop_Path",          Send_MIDI([["Mode_Default"   ]]), Log_Transition({from:"Stomps", to:"Snapshots"})]},
					_TO_EDIT:      {target:"Edit",      actions:[Push_Path("Edit"  ), Send_MIDI([["Mode_Edit"      ]]), Log_Transition({from:"Stomps", to:"Edit"     })]},
					_TO_LOOPER:    {target:"Looper",    actions:[Push_Path("Looper"), Send_MIDI([["Looper_Activate"]]), Log_Transition({from:"Stomps", to:"Looper"   })]},
					_TO_SNAPSHOTS: {actions:[raise("_EXIT"        ),                    ]},
					TO_EDIT:       {actions:[raise("_TO_EDIT"     ),                    ]},
					TO_LOOPER:     {actions:[raise("_TO_LOOPER"   ),                    ]},
					TO_PRESETS:    {actions:[raise("TO_SNAPSHOTS" ), raise("TO_PRESETS")]},
					TO_SNAPSHOTS:  {actions:[raise("_TO_SNAPSHOTS"),                    ]},
					TO_STOMPS:     {actions:[raise("_PERSIST_MODE"),                    ]},
				},
			},

		},

	}).withConfig({

		actions: {
			Pop_Path: assign(({_path}) => ({_path:_path.slice(0, (_path.length - 1))})),

			Log_InvalidEvent ({_path}, {type}, {state:{value}}){log.Helix.debug({"@":"!!! INVALID_EVENT !!!", event:type, state:value, path:JSON.stringify(_path)})},
			Log_ModePersisted({_path}, {type}, {state:{value}}){log.Helix.debug({"@":"MODE_PERSISTED",        event:type, state:value, path:JSON.stringify(_path)})},
		},

	})


//####################################################################################################################//
//##>  Exports.Namespace                                                                                            ##//
//####################################################################################################################//

	export namespace ModeTransitions{

		export type Context = {
			_path: string[]
		}

		export type  StateName  = (typeof StateNames)[number]
		export const StateNames = [
			"Edit",
			"Looper",
			"Presets",
			"Snapshots",
			"Stomps",
		] as const


		export type Event = (
			/* Ensured Events */
			| {type:`TO_${Uppercase<StateName>}`}

			/* Actual Events */
			| {type:`_TO_${Uppercase<StateName>}`}

			/* Internal Events */
			| {type:"_EXIT"        }
			| {type:"_PERSIST_MODE"}
		)

		export type EventName = Event["type"]

		export const Machine = _Machine

		export function ActualEvent (mode:StateName){return (`_TO_${mode.toUpperCase()}` as EventName)}
		export function EnsuredEvent(mode:StateName){return (`TO_${mode.toUpperCase()}`  as EventName)}

	}


//####################################################################################################################//
//##>  Utilities                                                                                                    ##//
//####################################################################################################################//

	function Push_Path(to:string)
		{return assign(({_path}:Context) => ({_path:[..._path, to]}))}

	function Log_Entry(to:string){
		return (({_path}:Context, {type}:Event, {state:{value}}:any) => {
			log.Helix.debug({"@":"ENTRY", to, event:type, state:value, path:JSON.stringify(_path)})
			log_Delimiter.NavigationEnd()
		})
	}

	function Log_Transition(
		{from,        to       }:
		{from:string, to:string}
	){
		return (({_path}:Context, {type}:Event, {state:{value}}:any) => {
			log_Delimiter.NavigationStart()
			log.Helix.debug({"@":"TRANSITION", from, to, event:type, state:value, path:JSON.stringify(_path)})
		})
	}

	function log_Delimiter()
		{log.Helix.debug("-".repeat(90))}

	log_Delimiter.NavigationStart = throttle(log_Delimiter, 100)
	log_Delimiter.NavigationEnd   = debounce(log_Delimiter, 100)
