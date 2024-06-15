"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assemble = exports.applyPattern = exports.matchPattern = exports.chatResponse = void 0;
const words_1 = require("./words");
// List of replacements to make in the input words.
const INPUT_REPLACEMENTS = new Map([
    ["dont", ["don't"]],
    ["cant", ["can't"]],
    ["wont", ["won't"]],
    ["recollect", ["remember"]],
    ["dreamt", ["dreamed"]],
    ["dreams", ["dream"]],
    ["maybe", ["perhaps"]],
    ["how", ["what"]],
    ["when", ["what"]],
    ["certainly", ["yes"]],
    ["machine", ["computer"]],
    ["computers", ["computer"]],
    ["were", ["was"]],
    ["you're", ["you", "are"]],
    ["i'm", ["i", "am"]],
    ["same", ["alike"]],
]);
// List of replacements to make in the output words.
const OUTPUT_REPLACEMENTS = new Map([
    ["am", ["are"]],
    ["your", ["my"]],
    ["me", ["you"]],
    ["myself", ["yourself"]],
    ["yourself", ["myself"]],
    ["i", ["you"]],
    ["you", ["I"]],
    ["my", ["your"]],
    ["i'm", ["you", "are"]],
]);
// Pattern to use if nothing above matches.
const DEFAULT_PATTERN = {
    name: ".none",
    contains: [],
    responses: [
        ["I'm", "not", "sure", "I", "understand", "you", "fully", "."],
        ["Please", "go", "on", "."],
        ["What", "does", "that", "suggest", "to", "you", "?"],
        ["Do", "you", "feel", "strongly", "about", "discussing", "such", "things", "?"]
    ]
};
/**
 * Returns the next response from the chatbot.
 * @param words words in the user's message
 * @param lastUsed map from name to the last response used for that word.
 *     (This is kept so that we can avoid reusing them as much as possible.)
 * @param patterns set of word patterns to use
 * @modifies lastUsed, memory
 * @returns words of the response
 */
const chatResponse = (words, lastUsed, memory, patterns) => {
    // Start by making the substitutions listed above.
    words = (0, words_1.replaceWords)(words, INPUT_REPLACEMENTS);
    // Try the patterns in the order they appear. Use the first* that matches.
    // Use the next unused reponse for the matching pattern.
    // * The one exception to this is "my", which is instead pushed to memory.
    for (const pat of patterns) {
        const args = (0, exports.matchPattern)(words, pat.contains);
        if (args !== undefined) {
            const out_args = [];
            for (const arg of args)
                out_args.push((0, words_1.replaceWords)(arg, OUTPUT_REPLACEMENTS));
            const result = (0, exports.applyPattern)(pat, out_args, lastUsed);
            if (pat.name === "my") {
                memory.push(result);
            }
            else {
                return result;
            }
        }
    }
    // If we have something saved to memory, then pop and return it. Otherwise,
    // we just make up a default response.
    const result = memory.pop();
    if (result !== undefined) {
        return result;
    }
    else {
        return (0, exports.applyPattern)(DEFAULT_PATTERN, [], lastUsed);
    }
};
exports.chatResponse = chatResponse;
/**
 * Returns the arguments from the given words if those words match the given
 * pattern and undefined if not. (See WordPattern above for more info.)
 * @param words words to check against the pattern
 * @param contains list of 1, 2, or 3 sequences of words to look for (in order)
 * @returns the text before, between, and after the required words of the
 *     pattern if they appear and undefined if not
 */
const matchPattern = (words, contains) => {
    if (contains.length < 1 || 3 < contains.length)
        throw new Error(`${contains.length} required word sequences not allowed`);
    const index1 = (0, words_1.wordsContain)(words, contains[0]);
    if (index1 < 0)
        return undefined;
    const arg1 = words.slice(0, index1);
    const words2 = words.slice(index1 + contains[0].length);
    if (contains.length === 1)
        return [arg1, words2];
    const index2 = (0, words_1.wordsContain)(words2, contains[1]);
    if (index2 < 0)
        return undefined;
    const arg2 = words2.slice(0, index2);
    const words3 = words2.slice(index2 + contains[1].length);
    if (contains.length === 2)
        return [arg1, arg2, words3];
    const index3 = (0, words_1.wordsContain)(words3, contains[2]);
    if (index3 < 0)
        return undefined;
    const arg3 = words3.slice(0, index3);
    const words4 = words3.slice(index3 + contains[2].length);
    return [arg1, arg2, arg3, words4];
};
exports.matchPattern = matchPattern;
/**
 * Returns the next response applied to the given pattern
 * @param pat pattern that matches
 * @param args arguments from matching the pattern
 * @param lastUsed (see chatResponse)
 * @modifies lastUsed changes the entry for this pattern to indicate which
 *    response was used
 * @returns result of substituting the arguments into the next unused response
 */
const applyPattern = (pat, args, lastUsed) => {
    const last = lastUsed.get(pat.name);
    let result = [];
    if (last !== undefined) {
        const next = (last + 1) % pat.responses.length;
        result = (0, exports.assemble)(pat.responses[next], args);
        lastUsed.set(pat.name, next);
    }
    else {
        result = (0, exports.assemble)(pat.responses[0], args);
        lastUsed.set(pat.name, 0);
    }
    return result;
};
exports.applyPattern = applyPattern;
/**
 * Returns the result of substituting, for each number in parts, the argument at
 * the corresponding index of args.
 * @param parts mix of words and numbers that indicate arguments to substitute
 * @param args values to substitute for numbers in parts
 * @returns sub(parts, args), where
 *     sub([], args) = []
 *     sub(L @ [w], args) = sub(L) @ [w]         if w is a word
 *     sub(L @ [n], args) = sub(L) @ args[n]     if n is a number
 */
const assemble = (parts, args) => {
    const words = [];
    let j = 0;
    // Inv: words = sub(parts[0..j-1], args)
    while (j != parts.length) {
        const part = parts[j];
        if (typeof part === 'number') {
            if (part < 0 || args.length <= part)
                throw new Error(`no argument for part ${part} (only ${parts.length} args)`);
            for (const word of args[part])
                words.push(word);
        }
        else {
            words.push(part);
        }
        j = j + 1;
    }
    return words;
};
exports.assemble = assemble;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdGJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGF0Ym90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxRDtBQUlyRCxtREFBbUQ7QUFDbkQsTUFBTSxrQkFBa0IsR0FBMEIsSUFBSSxHQUFHLENBQUM7SUFDdEQsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQixDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QixDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pCLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3BCLENBQUMsQ0FBQztBQUdMLG9EQUFvRDtBQUNwRCxNQUFNLG1CQUFtQixHQUEwQixJ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