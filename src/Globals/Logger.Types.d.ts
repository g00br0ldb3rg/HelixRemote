//###  App  ###//
type LogObject = import("Utilities/Logger.js").Logger.LogObject


//####################################################################################################################//
//##>  Globals                                                                                                      ##//
//####################################################################################################################//

	declare type Log =
		& LogObject
		& {
			Helix: LogObject
			MIDI:  LogObject
		}

	declare var Log: Log
