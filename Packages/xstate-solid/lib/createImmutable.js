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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImmutable = void 0;
var store_1 = require("solid-js/store");
var deepClone_1 = require("./deepClone");
var solid_js_1 = require("solid-js");
var resolvePath = function (path, obj) {
    if (obj === void 0) { obj = {}; }
    var current = obj;
    // tslint:disable-next-line:prefer-for-of
    for (var i = 0; i < path.length; i++) {
        current = current === null || current === void 0 ? void 0 : current[path[i]];
    }
    return current;
};
var updateStore = function (nextStore, prevStore, set, store) {
    var valueRefs = new WeakMap();
    var diff = function (next, prev, path) {
        if (prev === next) {
            return;
        }
        // Use reference if it has already been used circular reference loops
        if (valueRefs.has(next)) {
            set.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), [valueRefs.get(next)], false));
            return;
        }
        if (!(0, deepClone_1.isWrappable)(next) || !(0, deepClone_1.isWrappable)(prev)) {
            // toString cannot be set in solid stores
            if (path[path.length - 1] !== 'toString') {
                set.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), [function () { return next; }], false));
            }
            return;
        }
        // next is either an object or array, save reference to prevent diffing
        // the same object twice
        valueRefs.set(next, resolvePath(path, store));
        // Diff and update array or object
        if (Array.isArray(next) && Array.isArray(prev)) {
            var newIndices = next.length - prev.length;
            var smallestSize = Math.min(prev.length, next.length);
            var largestSize = Math.max(next.length, prev.length);
            // Diff array
            for (var start = 0, end = smallestSize - 1; start < end; start++, end--) {
                diff(next[start], prev[start], __spreadArray(__spreadArray([], __read(path), false), [start], false));
                diff(next[end], prev[end], __spreadArray(__spreadArray([], __read(path), false), [end], false));
            }
            // Update new or now undefined indexes
            if (newIndices !== 0) {
                for (var newEnd = smallestSize; newEnd <= largestSize - 1; newEnd++) {
                    set.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), [newEnd, next[newEnd]], false));
                }
                if (prev.length > next.length) {
                    set.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), ['length', next.length], false));
                }
            }
        }
        else {
            // Update new values
            var targetKeys = Object.keys(next);
            for (var i = 0, len = targetKeys.length; i < len; i++) {
                diff(next[targetKeys[i]], prev[targetKeys[i]], __spreadArray(__spreadArray([], __read(path), false), [
                    targetKeys[i]
                ], false));
            }
            // Remove previous keys that are now undefined
            var previousKeys = Object.keys(prev);
            for (var i = 0, len = previousKeys.length; i < len; i++) {
                if (next[previousKeys[i]] === undefined) {
                    set.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), [previousKeys[i], undefined], false));
                }
            }
        }
    };
    diff(nextStore, prevStore, []);
};
/**
 * Based on Ryan Carniato's createImmutable prototype
 * Clones the initial value and diffs updates
 */
function createImmutable(init) {
    var _a = __read((0, store_1.createStore)((0, deepClone_1.deepClone)(init)), 2), store = _a[0], setStore = _a[1];
    var ref = init;
    var setImmutable = function (next) {
        (0, solid_js_1.batch)(function () {
            updateStore(next, ref, setStore, store);
        });
        ref = next;
    };
    return [store, setImmutable];
}
exports.createImmutable = createImmutable;
