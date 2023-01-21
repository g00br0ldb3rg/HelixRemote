"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useService = exports.useMachine = void 0;
var fsm_1 = require("@xstate/fsm");
var solid_js_1 = require("solid-js");
var createImmutable_1 = require("./createImmutable");
var web_1 = require("solid-js/web");
function useMachine(machine, options) {
    var resolvedMachine = (0, fsm_1.createMachine)(machine.config, options ? options : machine._options);
    var service = (0, fsm_1.interpret)(resolvedMachine);
    if (!web_1.isServer) {
        service.start();
        (0, solid_js_1.onCleanup)(function () { return service.stop(); });
    }
    return useService(service);
}
exports.useMachine = useMachine;
function useService(service) {
    var serviceMemo = (0, solid_js_1.createMemo)(function () {
        return typeof service === 'function' ? service() : service;
    });
    var initialService = serviceMemo();
    var _a = __read((0, createImmutable_1.createImmutable)(deriveFSMState(initialService.state)), 2), state = _a[0], setState = _a[1];
    (0, solid_js_1.createEffect)(function () {
        var currentService = serviceMemo();
        var unsubscribe = currentService.subscribe(function () {
            return setState(deriveFSMState(currentService.state));
        }).unsubscribe;
        (0, solid_js_1.onCleanup)(unsubscribe);
    });
    var send = function (event) { return serviceMemo().send(event); };
    return [state, send, serviceMemo()];
}
exports.useService = useService;
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
