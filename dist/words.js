"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWords = exports.wordsContain = exports.splitWords = exports.replaceWords = exports.substitute = void 0;
const DEBUG = true; // turn this to 'false' later if you want to prevent
// the CheckInv functions from executing. For this project you don't need to change it
// to false, but in a bigger program we might want to turn it off after debugging is
// complete, to avoid running expensive invariant checks when the project is released.
/**
 * Modifies an array of strings such that certain words will be replaced with their substitute in a given mapping
 * @param words Initial list of words
 * @param reps A map containing strings and their replacement (if any)
 * @modifies words
 * @effects A maintains same length, but certain words will be replaced with their cooresponding replacements in the given mapping (words = substitute(words))
 */
const substitute = (words, reps) => {
    let j = 0;
    // Inv: words = substitute(words0[0 .. j − 1], reps) ++ words0[j .. n − 1]
    while (j < words.length) { // TODO (1b): Fill in loop body according to above invariant
        const replacement = reps.get(words[j]);
        if (replacement != undefined) {
            words[j] = replacement;
        }
        j += 1;
    }
};
exports.substitute = substitute;
/**
 * Returns the list of words that results when each of the words in the given
 * map is replaced by its value, which can be multiple words.
 * @param words initial list of words
 * @param replacements map from strings to their replacements
 * @returns join(map(words, replacement)),
 *     where map(nil, reps) = nil
 *           map(cons(w, L), reps)) = reps.get(w) if w in reps
 *                                  = [w]         if w not in reps
 *     where join([]) = []
 *           join(L @ []) = join(L)
 *           join(L @ [S @ [w]]) = join(L @ S) @ [w]
 */
const replaceWords = (words, replacements) => {
    const replaced = [];
    let i = 0;
    // Inv: replaced[0..i-1] = map(words[0..i-1], replacements) and
    //      replaced[i..n-1] is unchanged
    while (i !== words.length) {
        const val = replacements.get(words[i]);
        if (val !== undefined) {
            replaced.push(val);
        }
        else {
            replaced.push([words[i]]);
        }
        i = i + 1;
    }
    const result = [];
    let j = 0;
    // Inv: result = join(replaced[0..j-1])
    while (j !== replaced.length) {
        const L = replaced[j];
        let k = 0;
        // Inv: result = join(replaced[0..j-1]) @ L[0..k-1]
        while (k !== L.length) {
            result.push(L[k]);
            k = k + 1;
        }
        j = j + 1;
    }
    return result;
};
exports.replaceWords = replaceWords;
// String containing all punctuation characters.
const PUNCT = ",.?;:!";
// Determines whether ch is a punctuation character.
const isPunct = (ch) => {
    if (ch.length !== 1)
        throw new Error(`expecting a single character not "${ch}"`);
    return PUNCT.indexOf(ch) >= 0;
};
/**
 * Breaks the given string into a sequence of words, separated by spaces or
 * punctuation. Spaces are not included in the result. Punctuation is included
 * as its own word.
 * @param str the string in question
 * @return an array of strings words such that
 *     1. join(words) = del-spaces(str), i.e., the concatenation of all the
 *        words is str but with all whitespace removed
 *     2. adjacent letters in the original string are in the same word
 *     3. no word includes any whitespace
 *     4. each word is either a single punctuation character or 1+ letters
 */
const splitWords = (str) => {
    let splits = [0]; // TODO (part 4a): fix this
    let j = 0; // TODO (part 4a): fix this
    CheckInv1(splits, str, j);
    // Inv: 1. 0 = splits[0] < splits[1] < ... < splits[n-1] = j
    //      2. for i = 0 .. n-1, if splits[i+1] - splits[i] > 1, then 
    //         str[splits[i] ..  splits[i+1]-1] is all letters
    //      3. for i = 1 .. n-2, splits[i] is not between two letters
    //  where n = splits.length
    while (j < str.length) {
        // If a letter, then remove last entry in split
        // If punc or white space, don't remove
        const char = str.charAt(j);
        const charPrev = str.charAt(j - 1);
        //charPrev might be undefined, so must make an exception for j = 0
        //If it's a letter and the previous character is not punc or white spice
        if (!isPunct(char) && char !== " " && j !== 0) {
            if (!isPunct(charPrev) && charPrev !== " ") {
                splits.pop();
            }
        }
        splits.push(j + 1);
        j += 1;
        CheckInv1(splits, str, j);
    }
    let words = [];
    let i = 0;
    CheckInv2(words, splits, str, i);
    // Inv: 1. join(words) = del-space(s[0..splits[i]-1]))
    //      2. no element of words contains any whitespace
    while (i + 1 !== splits.length) {
        if (str[splits[i]] !== " ")
            words.push(str.substring(splits[i], splits[i + 1]));
        i = i + 1;
        CheckInv2(words, splits, str, i);
    }
    // Post: join(words) = del-space(str), each punctuation is its own word,
    //       adjacent letters are in the same word, and no word has spaces
    return words;
};
exports.splitWords = splitWords;
// Verify that the invariant from the first loop of splitWords holds.
const CheckInv1 = (splits, str, j) => {
    if (!DEBUG)
        return; // skip this
    if (splits.length === 0 || splits[0] !== 0)
        throw new Error('splits should start with 0');
    if (splits[splits.length - 1] !== j)
        throw new Error(`splits should end with the string's length ${j}`);
    const n = splits.length;
    // Inv: checked the invariant for splits[0 .. i-1]
    for (let i = 0; i < n; i++) {
        // Part 1:
        if (splits[i + 1] - splits[i] <= 0)
            throw new Error(`should have at least 1 char between splits at ${splits[i]} and ${splits[i + 1]}`);
        // Part 2:
        if (splits[i + 1] - splits[i] > 1) {
            const w = str.substring(splits[i], splits[i + 1]);
            // Inv: w[0 .. j-1] is all letters
            for (let j = 0; j < w.length; j++) {
                if (w[j] === " " || isPunct(w[j]))
                    throw new Error(`space/punct "${w[j]}" is in a part with other characters`);
            }
        }
        // Part 3:
        if (i > 0 && i < n - 1) {
            const c1 = str[splits[i] - 1];
            const c2 = str[splits[i]];
            if ((c1 !== " ") && !isPunct(c1) && (c2 !== " ") && !isPunct(c2))
                throw new Error(`split at ${splits[i]} is between two letters "${c1}" and "${c2}"`);
        }
    }
};
// Verify that the invariant from the second loop of splitWords holds.
const CheckInv2 = (words, splits, str, i) => {
    if (!DEBUG)
        return; // skip this
    const s1 = words.join("");
    if (s1.indexOf(" ") >= 0)
        throw new Error(`words contains space charactrs: "${s1}"`);
    let s2 = str.slice(0, splits[i]);
    // Inv: s2 = str[0..splits[i]-1] with some spaces removed
    while (s2.indexOf(" ") >= 0)
        s2 = s2.replace(" ", "");
    if (s1 !== s2)
        throw new Error(`words do not match the string (minus spaces): "${s1}" vs "${s2}"`);
};
/**
 * Finds where the words of "sub" appear as a sub-array within "all".
 * @param all full list of words
 * @param sub non-empty list of words to search for in all
 * @returns an index j <= all.length - sub.length such that
 *     lower(all[j+i]) = lower(sub[i]) for i = 0 .. sub.length - 1
 *     or -1 if none exists
 */
const wordsContain = (all, sub) => {
    if (sub.length === 0)
        throw new Error("second list of words cannot be empty");
    if (all.length < sub.length)
        return -1; // not enough words to contain sub
    let k = -1;
    // Inv: no index 0 <= j <= k such that
    //      lower(all[j+i]) = lower(sub[i]) for i = 0 .. sub.length-1
    while (k + sub.length !== all.length) {
        k = k + 1;
        let m = 0;
        // Inv: outer Inv and lower(all[k+i]) = lower(sub[i]) for i = 0 .. m-1
        while (m !== sub.length && all[k + m].toLowerCase() === sub[m].toLowerCase()) {
            m = m + 1;
        }
        if (m === sub.length) {
            // all[k+i] = sub[i] for i = 0 .. sub.length-1
            return k; // j = k matches
        }
    }
    // Post: no index 0 <= j <= all.length - sub.length such that
    //       all[j+i] = sub[i] for i = 0 .. sub.length-1
    return -1;
};
exports.wordsContain = wordsContain;
/**
 * Returns a string containing all of the given words, in the same order, but
 * with spaces before each (non-punctuation) word other than the first.
 * @param words list of words (no spaces, punctuation as its own words)
 * @return join-words(words), where
 *     join-words([]) = ""
 *     join-words([w]) = w
 *     join-words(L @ [v, w]) =
 *         join-words(L @ [v]) + w        if w is punctuation
 *         join-words(L @ [v]) + " " + w  if w is not punctuation
 */
const joinWords = (words) => {
    // TODO (part 3a): handle the case when the array is empty
    if (words.length === 0) {
        return "";
    }
    let j = 0;
    let parts = [];
    // Inv: join(parts) = join-words(words[0 .. j − 1])
    while (j < words.length) {
        if (words[j + 1] === undefined) {
            parts.push(words[j]);
        }
        else {
            if (words[j + 1].length > 1) {
                parts.push(words[j]);
                parts.push(" ");
            }
            else {
                if (isPunct(words[j + 1])) {
                    parts.push(words[j]);
                }
                else {
                    parts.push(words[j]);
                    parts.push(" ");
                }
            }
        }
        j += 1;
    }
    return parts.join("");
};
exports.joinWords = joinWords;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29yZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvd29yZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxLQUFLLEdBQVksSUFBSSxDQUFDLENBQUUsb0RBQW9EO0FBQ2xGLHNGQUFzRjtBQUN0RixvRkFBb0Y7QUFDcEYsc0ZBQXNGO0FBRXRGOzs7Ozs7R0FNRztBQUNJLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBZSxFQUFFLElBQXlCLEVBQVEsRUFBRTtJQUM3RSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFViwwRUFBMEU7SUFDMUUsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLDREQUE0RDtRQUNyRixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUcsV0FBVyxJQUFJLFNBQVMsRUFBQztZQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO1NBQ3hCO1FBQ0QsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNSO0FBQ0gsQ0FBQyxDQUFDO0FBWFcsUUFBQSxVQUFVLGNBV3JCO0FBRUY7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0ksTUFBTSxZQUFZLEdBQ3JCLENBQUMsS0FBNEIsRUFDNUIsWUFBZ0QsRUFBWSxFQUFFO0lBRWpFLE1BQU0sUUFBUSxHQUE0QixFQUFFLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRVYsK0RBQStEO0lBQy9ELHFDQUFxQztJQUNyQyxPQUFPLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ3pCLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxD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