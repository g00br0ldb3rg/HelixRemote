import type { AnyStateMachine, InterpreterFrom } from 'xstate';
import type { RestParams } from './types';
export declare function createService<TMachine extends AnyStateMachine>(machine: TMachine, ...[options]: RestParams<TMachine>): InterpreterFrom<TMachine>;
//# sourceMappingURL=createService.d.ts.map