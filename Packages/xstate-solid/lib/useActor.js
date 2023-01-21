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
exports.useActor = void 0;
var solid_js_1 = require("solid-js");
var deriveServiceState_1 = require("./deriveServiceState");
var createImmutable_1 = require("./createImmutable");
var noop = function () {
    /* ... */
};
function useActor(actorRef) {
    var actorMemo = (0, solid_js_1.createMemo)(function () {
        return typeof actorRef === 'function' ? actorRef() : actorRef;
    });
    var getActorState = function () { var _a, _b; return (_b = (_a = actorMemo()).getSnapshot) === null || _b === void 0 ? void 0 : _b.call(_a); };
    var _a = __read((0, createImmutable_1.createImmutable)({
        snapshot: (0, deriveServiceState_1.deriveServiceState)(getActorState())
    }), 2), state = _a[0], setState = _a[1];
    var setActorState = function (actorState) {
        setState({
            snapshot: (0, deriveServiceState_1.deriveServiceState)(actorState)
        });
    };
    (0, solid_js_1.createEffect)(function (isInitialActor) {
        if (!isInitialActor) {
            setActorState(getActorState());
        }
        var unsubscribe = actorMemo().subscribe({
            next: setActorState,
            error: noop,
            complete: noop
        }).unsubscribe;
        (0, solid_js_1.onCleanup)(unsubscribe);
        return false;
    }, true);
    var send = function (event) { return actorMemo().send(event); };
    return [function () { return state.snapshot; }, send];
}
exports.useActor = useActor;
