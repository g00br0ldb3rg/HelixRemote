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
function isState(state) {
    return (typeof state === 'object' &&
        'value' in state &&
        'context' in state &&
        'event' in state &&
        '_event' in state &&
        'can' in state &&
        'matches' in state);
}
/**
 * Takes in an interpreter or actor ref and returns a State object with reactive
 * methods or if not State, the initial value passed in
 * @param state {AnyState | unknown}
 */
export var deriveServiceState = function (state) {
    if (isState(state)) {
        return __assign(__assign({}, state), { toJSON: state.toJSON, toStrings: state.toStrings, can: state.can, hasTag: state.hasTag, matches: state.matches });
    }
    else {
        return state;
    }
};
