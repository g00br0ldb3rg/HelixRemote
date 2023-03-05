//###  App  ###//
import {Logger as _Logger} from "Utilities/Logger.js"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export namespace Logger{
		export const level: _Logger.Level = "info"
	}

	export namespace MIDI{
		export const Delay = {
			eventGroup:  100,
			queuedEvent: 10,
		}

		export const timeout = 5000
	}
