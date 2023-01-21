import type { MachineImplementationsFrom, ServiceFrom, StateFrom, StateMachine } from '@xstate/fsm';
import type { Accessor } from 'solid-js';
type UseFSMReturn<TService extends StateMachine.AnyService> = [
    StateFrom<TService>,
    TService['send'],
    TService
];
export declare function useMachine<TMachine extends StateMachine.AnyMachine>(machine: TMachine, options?: MachineImplementationsFrom<TMachine>): UseFSMReturn<ServiceFrom<TMachine>>;
export declare function useService<TService extends StateMachine.AnyService>(service: TService | Accessor<TService>): UseFSMReturn<TService>;
export {};
//# sourceMappingURL=fsm.d.ts.map