"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTranscriptsForTesting = exports.load = exports.save = exports.chat = void 0;
const words_1 = require("./words");
const patterns_1 = require("./patterns");
const chatbot_1 = require("./chatbot");
// Keep track of the most recently used response for each pattern.
const lastUsed = new Map();
// Keep track of possible responses for when we run out of things to say.
const memory = [];
// Keep track of saved transcripts. (We don't need to interpret the content of
// the transcript, so we can leave it as type "unknown".)
const transcripts = new Map();
/**
 * Handles request for /chat, with a message included as a query parameter,
 * by getting the next chat response.
 */
const chat = (req, res) => {
    const msg = first(req.query.message);
    if (msg === undefined) {
        res.status(400).send('required argument "message" was missing');
        return;
    }
    const words = (0, words_1.splitWords)(msg);
    const result = (0, chatbot_1.chatResponse)(words, lastUsed, memory, patterns_1.PATTERNS);
    res.send({ response: (0, words_1.joinWords)(result) });
};
exports.chat = chat;
/** Handles request for /save by storing the given transcript. */
const save = (req, res) => {
    const name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    const value = req.body.value;
    if (value === undefined) {
        res.status(400).send('required argument "value" was missing');
        return;
    }
    // TODO(5a): implement this part
    //  - store the passed in value in the map under the given name
    //  - return a record indicating whether that replaced an existing transcript
    if (req.query.message === undefined)
        res.status(200).send({ replaced: false });
    else
        res.status(200).send({ replaced: true });
};
exports.save = save;
/** Handles request for /load by returning the transcript requested. */
const load = (req, res) => {
    // TODO(5b): implement this function
    //  - chat() & save() functions may be useful examples for error checking!
    req;
    res;
};
exports.load = load;
/** Used in tests to set the transcripts map back to empty. */
const resetTranscriptsForTesting = () => {
    // Do not use this function except in tests!
    transcripts.clear();
};
exports.resetTranscriptsForTesting = resetTranscriptsForTesting;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param) && param.length > 0) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxtQ0FBZ0Q7QUFDaEQseUNBQXNDO0FBQ3RDLHVDQUF5QztBQVF6QyxrRUFBa0U7QUFDbEUsTUFBTSxRQUFRLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO0FBRWhFLHlFQUF5RTtBQUN6RSxNQUFNLE1BQU0sR0FBZSxFQUFFLENBQUM7QUFFOUIsOEVBQThFO0FBQzlFLHlEQUF5RDtBQUN6RCxNQUFNLFdBQVcsR0FBeUIsSUFBSSxHQUFHLEVBQW1CLENBQUM7QUFFckU7OztHQUdHO0FBQ0ksTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEdBQWlCLEVBQVEsRUFBRTtJQUNoRSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUNoRSxPQUFPO0tBQ1I7SUFFRCxNQUFNLEtBQUssR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBWSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLG1CQUFRLENBQUMsQ0FBQztJQUMvRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUEsaUJBQVMsRUFBQyxNQUFNLENBQUMsRUFBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFBO0FBVlksUUFBQSxJQUFJLFFBVWhCO0FBRUQsaUVBQWlFO0FBQzFELE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDaEUsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0IsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDUjtJQUVELGdDQUFnQztJQUNoQywrREFBK0Q7SUFDL0QsNkVBQTZFO0lBRTdFLElBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUztRQUNoQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBOztRQUV2QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0FBQzFDLENBQUMsQ0FBQTtBQXJCWSxRQUFBLElBQUksUUFxQmhCO0FBRUQsdUVBQXVFO0FBQ2hFLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDaEUsb0NBQW9DO0lBQ3BDLDBFQUEwRTtJQUMxRSxHQUFHLENBQUM7SUFDSixHQUFHLENBQUM7QUFDTixDQUFDLENBQUE7QUFMWSxRQUFBLElBQUksUUFLaEI7QUFFRCw4REFBOEQ7QUFDdkQsTUFBTSwwQkFBMEIsR0FBRyxHQUFTLEVBQUU7SUFDbkQsNENBQTRDO0lBQzVDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN0QixDQUFDLENBQUM7QUFIVyxRQUFBLDBCQUEwQiw4QkFHckM7QUFHRix3RUFBd0U7QUFDeEUsNEVBQTRFO0FBQzVFLG1EQUFtRDtBQUNuRCxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQWMsRUFBb0IsRUFBRTtJQUNqRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDNUMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEI7U0FBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUNwQyxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU07UUFDTCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQSJ9