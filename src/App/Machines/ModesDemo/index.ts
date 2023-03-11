//###  App  ###//
import type {UseMachine} from "Utilities/XState-Solid.js"

//###  NPM  ###//
import {
	assign,
	createMachine,
} from "xstate"


//####################################################################################################################//
//##>  Exports.Machine                                                                                              ##//
//####################################################################################################################//

	export namespace ModesDemo{

		export type  Machine = (typeof Machine)
		export const Machine = createMachine({
			id: "Modes",
			initial: "Snapshots",
			on: {
				//_SET_MODE_TRANSITIONS: {actions:[assign((_, event) => ({_modeTransitions:(event as any).modeTransitions}))]},
			},
			states: {
				Edit: {
					initial: "Initial",
					states: {
						Initial: {
							always: [
								{
									target: "FromStomps",
									cond: "Is_FromStomps",
								},
								{
									target: "FromSnapshots",
									cond: "Is_FromSnapshots",
								},
							],
						},
						FromSnapshots: {
							on: {
								TO_SNAPSHOTS: {target:"#Modes.Snapshots", actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_SNAPSHOTS")}})},
							},
						},
						FromStomps: {
							on: {
								TO_STOMPS: {target:"#Modes.Stomps",    actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_STOMPS"   )}})},
							},
						},
					},
				},
				Looper: {
					on: {
						TO_STOMPS:      {target:"Stomps",           actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_STOMPS"   )}})},
					},
				},
				Presets: {
					on: {
						TO_SNAPSHOTS:   {target:"Snapshots",        actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_SNAPSHOTS")}})},
					},
				},
				Snapshots: {
					entry: assign(() => ({_editParent:"Snapshots" as const})),
					on: {
						TO_EDIT:        {target:"Edit",             actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_EDIT"     )}})},
						TO_PRESETS:     {target:"Presets",          actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_PRESETS"  )}})},
						TO_STOMPS:      {target:"Stomps",           actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_STOMPS"   )}})},
					},
				},
				Stomps: {
					entry: assign(() => ({_editParent:"Stomps" as const})),
					on: {
						TO_SNAPSHOTS:   {target:"Snapshots",        actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_SNAPSHOTS")}})},
						TO_EDIT:        {target:"Edit",             actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_EDIT"     )}})},
						TO_LOOPER:      {target:"Looper",           actions:(({_modeTransitions}, event) => {if(!(event?.["from_UI"])){_modeTransitions.send("TO_LOOPER"   )}})},
					},
				},
			},
			context: {
				_editParent:       ("Snapshots" as ("Stomps" | "Snapshots")),
				_modeTransitions:  (undefined as any as UseMachine<any>),
			},
			predictableActionArguments: false,
			preserveActionOrder: true,
		}).withConfig({
			guards: {
				Is_FromStomps:    (({_editParent}) => (_editParent === "Stomps"   )),
				Is_FromSnapshots: (({_editParent}) => (_editParent === "Snapshots")),
			},

		})

	}


//####################################################################################################################//
//##>  Exports.Utilities                                                                                           ##//
//####################################################################################################################//

	export namespace ModesDemo{

		const delay = 150

		const eventQueue = ([] as string[])

		let _modesDemo: UseMachine<ModesDemo.Machine>

		export function send(event:string)
			{eventQueue.push(event)}

		export function start_Queue(modesDemo:UseMachine<ModesDemo.Machine>){
			_modesDemo = modesDemo
			_process_Queue()
		}

		export async function _process_Queue(){
			const event = eventQueue.shift()

			if(event)
				{(_modesDemo as any)._send(event)}

			setTimeout(_process_Queue, delay)
		}

	}
