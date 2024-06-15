"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explode_array = exports.compact_list = exports.rev = exports.at = exports.concat = exports.equal = exports.len = exports.cons = exports.nil = void 0;
/** The empty list. */
exports.nil = { kind: "nil" };
/** Returns a list with hd in front of tl. */
const cons = (hd, tl) => {
    return { kind: "cons", hd: hd, tl: tl };
};
exports.cons = cons;
/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
const len = (L) => {
    if (L.kind === "nil") {
        return 0n;
    }
    else {
        return 1n + (0, exports.len)(L.tl);
    }
};
exports.len = len;
/**
 * Determines whether the two given lists are equal, using === to compare the
 * corresponding values in the lists.
 * @param L The first list to compare
 * @param R The second list to compare
 * @returns true iff the lists have the same length and the elements at the same
 *     indexes of the two lists have values that are ===.
 */
const equal = (L, R) => {
    if (L.kind === "nil") {
        return R.kind === "nil";
    }
    else if (R.kind === "nil") {
        return false;
    }
    else if (L.hd !== R.hd) {
        return false;
    }
    else {
        return (0, exports.equal)(L.tl, R.tl);
    }
};
exports.equal = equal;
/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
const concat = (L, R) => {
    if (L.kind === "nil") {
        return R;
    }
    else {
        return (0, exports.cons)(L.hd, (0, exports.concat)(L.tl, R));
    }
};
exports.concat = concat;
/**
 * Returns the element at index x in the list.
 * @param x an integer between 0 and len(L) - 1 inclusie
 * @returns L.hd if x is 0 else at(x - 1, L.tl)
 */
const at = (x, L) => {
    if (L.kind === "nil") {
        throw new Error('no element at that index');
    }
    else if (x === 0n) {
        return L.hd;
    }
    else {
        return (0, exports.at)(x - 1n, L.tl);
    }
};
exports.at = at;
/**
 * Returns the reverse of the given list.
 * @param L list to revese
 * @returns list containing the same elements but in reverse order
 */
const rev = (L) => {
    if (L.kind === "nil") {
        return exports.nil;
    }
    else {
        return (0, exports.concat)((0, exports.rev)(L.tl), (0, exports.cons)(L.hd, exports.nil));
    }
};
exports.rev = rev;
/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
const compact_list = (L) => {
    if (L.kind === "nil") {
        return [];
    }
    else {
        return [L.hd].concat((0, exports.compact_list)(L.tl)); // NOTE: O(n^2)
    }
};
exports.compact_list = compact_list;
/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
const explode_array = (arr) => {
    if (arr.length === 0) {
        return exports.nil;
    }
    else {
        return (0, exports.cons)(arr[0], (0, exports.explode_array)(arr.slice(1))); // NOTE: O(n^2)
    }
};
exports.explode_array = explode_array;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHNCQUFzQjtBQUNULFFBQUEsR0FBRyxHQUFrQixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztBQUVoRCw2Q0FBNkM7QUFDdEMsTUFBTSxJQUFJLEdBQUcsQ0FBSyxFQUFLLEVBQUUsRUFBVyxFQUFXLEVBQUU7SUFDdEQsT0FBTyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUM7QUFDeEMsQ0FBQyxDQUFDO0FBRlcsUUFBQSxJQUFJLFFBRWY7QUFHRjs7OztHQUlHO0FBQ0ksTUFBTSxHQUFHLEdBQUcsQ0FBSyxDQUFVLEVBQVUsRUFBRTtJQUM1QyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1FBQ3BCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7U0FBTTtRQUNMLE9BQU8sRUFBRSxHQUFHLElBQUEsV0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN2QjtBQUNILENBQUMsQ0FBQztBQU5XLFFBQUEsR0FBRyxPQU1kO0FBRUY7Ozs7Ozs7R0FPRztBQUNJLE1BQU0sS0FBSyxHQUFHLENBQUksQ0FBVSxFQUFFLENBQVUsRUFBVyxFQUFFO0lBQzFELElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDcEIsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQztLQUN6QjtTQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDM0IsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3hCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTTtRQUNMLE9BQU8sSUFBQSxhQUFLLEVBQUMsQ0FB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