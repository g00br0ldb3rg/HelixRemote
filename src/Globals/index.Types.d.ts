//###  App  ###//
type LogObject = import("Utilities/Logger.js").Logger.LogObject


//####################################################################################################################//
//##>  Globals                                                                                                      ##//
//####################################################################################################################//

	declare type log =
		& LogObject
		& {
			Helix: LogObject
			MIDI:  LogObject
		}

	declare var log: log
