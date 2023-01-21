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
exports.deepClone = exports.isWrappable = void 0;
function isWrappable(obj) {
    var proto;
    return (obj != null &&
        typeof obj === 'object' &&
        (!(proto = Object.getPrototypeOf(obj)) ||
            proto === Object.prototype ||
            Array.isArray(obj)));
}
exports.isWrappable = isWrappable;
/**
 * Accepts any value and creates a deep clone if it is an object
 * This function only deeply clones objects, any classes with be copied
 * @param value The variable to deeply clone
 * @param valueRefs A WeakMap that stores a reference from the original
 * object/array to the cloned object/array
 */
var clone = function (value, valueRefs) {
    if (!isWrappable(value)) {
        return value;
    }
    var isObject = !Array.isArray(value);
    // Get either a new object/array and a typed iterator
    var _a = __read(isObject
        ? [{}, Object.keys(value)]
        : [[], value], 2), clonedValue = _a[0], keyedValues = _a[1];
    // Save a reference of the object/array
    valueRefs.set(value, clonedValue);
    // Loop over all object/array indexes and clone
    for (var i = 0; i < keyedValues.length; ++i) {
        var keyedIndex = (isObject ? keyedValues[i] : i);
        var currentVal = value[keyedIndex];
        // Check if reference already exists, helps prevent max call stack
        if (valueRefs.has(currentVal)) {
            clonedValue[keyedIndex] = valueRefs.get(currentVal);
        }
        else {
            clonedValue[keyedIndex] = clone(currentVal, valueRefs);
        }
    }
    return clonedValue;
};
var deepClone = function (value) { return clone(value, new WeakMap()); };
exports.deepClone = deepClone;
