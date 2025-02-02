const DEBUG: boolean = true;  // turn this to 'false' later if you want to prevent
// the CheckInv functions from executing. For this project you don't need to change it
// to false, but in a bigger program we might want to turn it off after debugging is
// complete, to avoid running expensive invariant checks when the project is released.

/**
 * Modifies an array of strings such that certain words will be replaced with their substitute in a given mapping
 * @param words Initial list of words 
 * @param reps A map containing strings and their replacement (if any)
 * @modifies words
 * @effects words will maintain same length, but certain words will be replaced with their cooresponding replacements in the given mapping (words = substitute(words, reps))
 */
export const substitute = (words: string[], reps: Map<string, string>): void => {
  let j = 0;

  // Inv: words = substitute(words0[0 .. j − 1], reps) ++ words0[j .. n − 1]
  while (j < words.length) { // TODO (1b): Fill in loop body according to above invariant
    const replacement = reps.get(words[j]);
    if(replacement != undefined){  
      words[j] = replacement;
    }
    j += 1;
  }
};

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
export const replaceWords =
    (words: ReadonlyArray<string>,
     replacements: Map<string, ReadonlyArray<string>>): string[] => {

  const replaced: ReadonlyArray<string>[] = [];
  let i = 0;

  // Inv: replaced[0..i-1] = map(words[0..i-1], replacements) and
  //      replaced[i..n-1] is unchanged
  while (i !== words.length) {
    const val = replacements.get(words[i]);
    if (val !== undefined) {
      replaced.push(val);
    } else {
      replaced.push([words[i]]);
    }
    i = i + 1;
  }

  const result: string[] = [];
  let j = 0;

  // Inv: result = join(replaced[0..j-1])
  while (j !== replaced.length) {
    const L = replaced[j];
    let k = 0;
    // Inv: result = join(replaced[0..j-1]) @ L[0..k-1]
    while (k !== L.length) {
      result.push(L[k])
      k = k + 1;
    }
    j = j + 1;
  }

  return result;
};

// String containing all punctuation characters.
const PUNCT: string = ",.?;:!";

// Determines whether ch is a punctuation character.
const isPunct = (ch: string): boolean => {
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
export const splitWords = (str: string): string[] => {
  let splits: number[] = [0];  // TODO (part 4a): fix this
  let j: number = 0;          // TODO (part 4a): fix this

  CheckInv1(splits, str, j);

  // Inv: 1. 0 = splits[0] < splits[1] < ... < splits[n-1] = j
  //      2. for i = 0 .. n-1, if splits[i+1] - splits[i] > 1, then 
  //         str[splits[i] ..  splits[i+1]-1] is all letters
  //      3. for i = 1 .. n-2, splits[i] is not between two letters
  //  where n = splits.length
  while (j !== str.length) {  
 
    // If a letter, then remove last entry in split
    // If punc or white space, don't remove

  
    const char = str.charAt(j);
    const charPrev = str.charAt(j-1);

    if(!isPunct(char) && char !== " " && j !== 0){
      if(!isPunct(charPrev) && charPrev !== " "){
        splits.pop();
      }
    }
    
    splits.push(j+1);
    j += 1;
    
    CheckInv1(splits, str, j);
  }

  let words: string[] = [];
  let i = 0;

  CheckInv2(words, splits, str, i);

  // Inv: 1. join(words) = del-space(s[0..splits[i]-1]))
  //      2. no element of words contains any whitespace
  while (i+1 !== splits.length) {
    if (str[splits[i]] !== " ")
      words.push(str.substring(splits[i], splits[i+1]));
    i = i + 1;
    CheckInv2(words, splits, str, i);
  }

  // Post: join(words) = del-space(str), each punctuation is its own word,
  //       adjacent letters are in the same word, and no word has spaces
  return words; 
};

// Verify that the invariant from the first loop of splitWords holds.
const CheckInv1 = (splits: number[], str: string, j: number): void => {
  if (!DEBUG)
    return;  // skip this

  if (splits.length === 0 || splits[0] !== 0)
    throw new Error('splits should start with 0');
  if (splits[splits.length-1] !== j)
    throw new Error(`splits should end with the string's length ${j}`);

  const n = splits.length;
  // Inv: checked the invariant for splits[0 .. i-1]
  for (let i = 0; i < n; i++) {
    // Part 1:
    if (splits[i+1] - splits[i] <= 0)
      throw new Error(`should have at least 1 char between splits at ${splits[i]} and ${splits[i+1]}`);

    // Part 2:
    if (splits[i+1] - splits[i] > 1) {  
      const w = str.substring(splits[i], splits[i+1]);
      // Inv: w[0 .. j-1] is all letters
      for (let j = 0; j < w.length; j++) {
        if (w[j] === " " || isPunct(w[j]))
          throw new Error(`space/punct "${w[j]}" is in a part with other characters`);
      }
    } 

    // Part 3:
    if (i > 0 && i < n - 1) {
      const c1 = str[splits[i]-1];
      const c2 = str[splits[i]];
      if ((c1 !== " ") && !isPunct(c1) && (c2 !== " ") && !isPunct(c2))
        throw new Error(`split at ${splits[i]} is between two letters "${c1}" and "${c2}"`);
    }
  }
};

// Verify that the invariant from the second loop of splitWords holds.
const CheckInv2 =
    (words: string[], splits: number[], str: string, i: number): void => {
  if (!DEBUG)
    return;  // skip this

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
export const wordsContain =
    (all: ReadonlyArray<string>, sub: ReadonlyArray<string>): number => {

  if (sub.length === 0)
    throw new Error("second list of words cannot be empty");
  if (all.length < sub.length)
    return -1; // not enough words to contain sub

  let k: number = -1;

  // Inv: no index 0 <= j <= k such that
  //      lower(all[j+i]) = lower(sub[i]) for i = 0 .. sub.length-1
  while (k + sub.length !== all.length) {
    k = k + 1;

    let m: number = 0;

    // Inv: outer Inv and lower(all[k+i]) = lower(sub[i]) for i = 0 .. m-1
    while (m !== sub.length && all[k+m].toLowerCase() === sub[m].toLowerCase()) {
      m = m + 1;
    }

    if (m === sub.length) {
      // all[k+i] = sub[i] for i = 0 .. sub.length-1
      return k;  // j = k matches
    }
  }

  // Post: no index 0 <= j <= all.length - sub.length such that
  //       all[j+i] = sub[i] for i = 0 .. sub.length-1
  return -1;
};


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
export const joinWords = (words: ReadonlyArray<string>): string => {
  // TODO (part 3a): handle the case when the array is empty
  if(words.length === 0){
    return "";
  }

  let j = 0; 
  let parts: string[] = []; 
  
  // Inv: join(parts) = join-words(words[0 .. j − 1])
  while(j < words.length){
    if (j === words.length - 1){ //Last element in array
      parts.push(words[j]);
    }
    else{
      if (words[j+1].length > 1){ //Length longer than 1 means not punct (and this satifies the isPunct function specification)
        parts.push(words[j]);
        parts.push(" ");
      }
      else{
        if(isPunct(words[j+1])){ //Function call means not punct
          parts.push(words[j]);
        }
        else{ 
          parts.push(words[j]);
          parts.push(" ");
        }
      }
    }
    j+=1;
  }
  return parts.join("");
};