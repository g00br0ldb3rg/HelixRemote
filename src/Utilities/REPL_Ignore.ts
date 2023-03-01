//###  App  ###//
import {Environment} from "./Environment.js"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function REPL_Ignore(target:any, propertyKey:string, descriptor:PropertyDescriptor){
		if(!Environment.is_REPL)
			{return}

		descriptor.value =
			function wrapped()
				{/* Do Nothing */}
	}
