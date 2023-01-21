import type { AnyState } from 'xstate';
import type { CheckSnapshot } from './types';
/**
 * Takes in an interpreter or actor ref and returns a State object with reactive
 * methods or if not State, the initial value passed in
 * @param state {AnyState | unknown}
 */
export declare const deriveServiceState: <StateSnapshot extends AnyState, StateReturnType = CheckSnapshot<StateSnapshot>>(state: unknown) => StateReturnType;
//# sourceMappingURL=deriveServiceState.d.ts.map