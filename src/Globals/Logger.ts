//###  App  ###//
import {Logger as Logger_Settings} from "Settings/index.js"
import {Logger                   } from "Utilities/Logger.js"


//####################################################################################################################//
//##>  Aliases                                                                                                      ##//
//####################################################################################################################//

	const {level} = Logger_Settings


//####################################################################################################################//
//##>  Initialize                                                                                                   ##//
//####################################################################################################################//

	globalThis.log = Logger({name:"App",       level}).log as log
	log.MIDI       = Logger({name:"App.MIDI",  level}).log
	log.Helix      = Logger({name:"App.Helix", level}).log

	globalThis.log = (log as log)
