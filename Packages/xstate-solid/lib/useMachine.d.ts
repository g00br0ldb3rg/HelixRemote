import type { AnyStateMachine, StateFrom, InterpreterFrom, Prop } from 'xstate';
import type { CheckSnapshot, RestParams } from './types';
type UseMachineReturn<TMachine extends AnyStateMachine, TInterpreter = InterpreterFrom<TMachine>> = [
    CheckSnapshot<StateFrom<TMachine>>,
    Prop<TInterpreter, 'send'>,
    TInterpreter
];
export declare function useMachine<TMachine extends AnyStateMachine>(machine: TMachine, ...[options]: RestParams<TMachine>): UseMachineReturn<TMachine>;
export {};
//# sourceMappingURL=useMachine.d.ts.map