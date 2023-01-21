import type { ActorRef, EmittedFrom, EventObject } from 'xstate';
import type { Accessor } from 'solid-js';
import type { CheckSnapshot } from './types';
type Sender<TEvent> = (event: TEvent) => void;
export declare function useActor<TActor extends ActorRef<any>>(actorRef: Accessor<TActor> | TActor): [Accessor<CheckSnapshot<EmittedFrom<TActor>>>, TActor['send']];
export declare function useActor<TEvent extends EventObject, TEmitted>(actorRef: Accessor<ActorRef<TEvent, TEmitted>> | ActorRef<TEvent, TEmitted>): [Accessor<CheckSnapshot<TEmitted>>, Sender<TEvent>];
export {};
//# sourceMappingURL=useActor.d.ts.map