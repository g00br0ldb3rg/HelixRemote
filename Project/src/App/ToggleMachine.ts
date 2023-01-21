//###  NPM  ###//
import {createMachine, assign} from "xstate"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export const ToggleMachine = createMachine<ToggleMachine.Context>({
		id:      "toggle",
		initial: "inactive",

		context: {
			count: 0,
		},

		states: {
			inactive: {
				on: {TOGGLE:"active"}
			},
			active: {
				entry: assign({count:((ctx) => (ctx.count + 1))}),
				on:    {TOGGLE:"inactive"}
			}
		},
	})

	export namespace ToggleMachine{
		export interface Context{
			count: number
		}
	}
