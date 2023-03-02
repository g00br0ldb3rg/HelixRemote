//###  App  ###//
import {Logger} from "Utilities/Logger.js"


//####################################################################################################################//
//##>  Setup                                                                                                        ##//
//####################################################################################################################//

	const {log} = Logger({
		name:  "App",
		level: "trace",
	})


//####################################################################################################################//
//##>  Initialize                                                                                                   ##//
//####################################################################################################################//

	globalThis.log = log
