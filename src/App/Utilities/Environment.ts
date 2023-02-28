
//####################################################################################################################//
//##>  Exports                                                                                                      ##//
//####################################################################################################################//

	export namespace Environment{
		const env = {
			ExecutionContext: "Client.Production",
			...globalThis.process?.env,
		}

		const ExecutionContext = env.ExecutionContext

		export const is_Build       = (ExecutionContext == "Client.Build"      )
		export const is_Development = (ExecutionContext == "Client.Development")
		export const is_Production  = (ExecutionContext == "Client.Production" )
		export const is_REPL        = (ExecutionContext == "REPL"              )

		export const is_Client = ExecutionContext.startsWith("Client")
	}
