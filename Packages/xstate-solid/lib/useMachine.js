"use strict";
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
exports.useMachine = void 0;
var xstate_1 = require("xstate");
var createService_1 = require("./createService");
var solid_js_1 = require("solid-js");
var deriveServiceState_1 = require("./deriveServiceState");
var createImmutable_1 = require("./createImmutable");
function useMachine(machine) {
    var _a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _a[_i - 1] = arguments[_i];
    }
    var _b = __read(_a, 1), _c = _b[0], options = _c === void 0 ? {} : _c;
    var service = (0, createService_1.createService)(machine, options);
    var getSnapshot = function () {
        if (service.status === xstate_1.InterpreterStatus.NotStarted) {
            return (options.state
                ? xstate_1.State.create(options.state)
                : service.machine.initialState);
        }
        return service.getSnapshot();
    };
    var _d = __read((0, createImmutable_1.createImmutable)((0, deriveServiceState_1.deriveServiceState)(getSnapshot())), 2), state = _d[0], setState = _d[1];
    (0, solid_js_1.onMount)(function () {
        var unsubscribe = service.subscribe(function (nextState) {
            setState((0, deriveServiceState_1.deriveServiceState)(nextState));
        }).unsubscribe;
        (0, solid_js_1.onCleanup)(unsubscribe);
    });
    return [state, service.send, service];
}
exports.useMachine = useMachine;
