//###  NPM  ###//
import {memoize as _memoize} from "lodash-es"


//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export function memoize(target:any, propertyKey:string, descriptor:PropertyDescriptor){
		const func       = descriptor.value.bind(target)
		descriptor.value = _memoize(func)
	}
