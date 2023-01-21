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
import { InterpreterStatus, State } from 'xstate';
import { createService } from './createService';
import { onCleanup, onMount } from 'solid-js';
import { deriveServiceState } from './deriveServiceState';
import { createImmutable } from './createImmutable';
export function useMachine(machine) {
    var _a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _a[_i - 1] = arguments[_i];
    }
    var _b = __read(_a, 1), _c = _b[0], options = _c === void 0 ? {} : _c;
    var service = createService(machine, options);
    var getSnapshot = function () {
        if (service.status === InterpreterStatus.NotStarted) {
            return (options.state
                ? State.create(options.state)
                : service.machine.initialState);
        }
        return service.getSnapshot();
    };
    var _d = __read(createImmutable(deriveServiceState(getSnapshot())), 2), state = _d[0], setState = _d[1];
    onMount(function () {
        var unsubscribe = service.subscribe(function (nextState) {
            setState(deriveServiceState(nextState));
        }).unsubscribe;
        onCleanup(unsubscribe);
    });
    return [state, service.send, service];
}
