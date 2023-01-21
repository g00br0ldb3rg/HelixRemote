var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { createMachine, interpret } from '@xstate/fsm';
import { createMemo, onCleanup, createEffect } from 'solid-js';
import { createImmutable } from './createImmutable';
import { isServer } from 'solid-js/web';
export function useMachine(machine, options) {
    var resolvedMachine = createMachine(machine.config, options ? options : machine._options);
    var service = interpret(resolvedMachine);
    if (!isServer) {
        service.start();
        onCleanup(function () { return service.stop(); });
    }
    return useService(service);
}
export function useService(service) {
    var serviceMemo = createMemo(function () {
        return typeof service === 'function' ? service() : service;
    });
    var initialService = serviceMemo();
    var _a = __read(createImmutable(deriveFSMState(initialService.state)), 2), state = _a[0], setState = _a[1];
    createEffect(function () {
        var currentService = serviceMemo();
        var unsubscribe = currentService.subscribe(function () {
            return setState(deriveFSMState(currentService.state));
        }).unsubscribe;
        onCleanup(unsubscribe);
    });
    var send = function (event) { return serviceMemo().send(event); };
    return [state, send, serviceMemo()];
}
function deriveFSMState(state) {
    return __assign(__assign({}, state), { matches: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // tslint:disable-next-line:no-unused-expression
            this.value; // reads state.value to be tracked by the store
            return state.matches(args[0]);
        } });
}
