var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { createEffect, createMemo, onCleanup } from 'solid-js';
import { deriveServiceState } from './deriveServiceState';
import { createImmutable } from './createImmutable';
var noop = function () {
    /* ... */
};
export function useActor(actorRef) {
    var actorMemo = createMemo(function () {
        return typeof actorRef === 'function' ? actorRef() : actorRef;
    });
    var getActorState = function () { var _a, _b; return (_b = (_a = actorMemo()).getSnapshot) === null || _b === void 0 ? void 0 : _b.call(_a); };
    var _a = __read(createImmutable({
        snapshot: deriveServiceState(getActorState())
    }), 2), state = _a[0], setState = _a[1];
    var setActorState = function (actorState) {
        setState({
            snapshot: deriveServiceState(actorState)
        });
    };
    createEffect(function (isInitialActor) {
        if (!isInitialActor) {
            setActorState(getActorState());
        }
        var unsubscribe = actorMemo().subscribe({
            next: setActorState,
            error: noop,
            complete: noop
        }).unsubscribe;
        onCleanup(unsubscribe);
        return false;
    }, true);
    var send = function (event) { return actorMemo().send(event); };
    return [function () { return state.snapshot; }, send];
}
