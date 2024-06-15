"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const httpMocks = __importStar(require("node-mocks-http"));
const routes_1 = require("./routes");
describe('routes', function () {
    it('chat', function () {
        // First branch, straight line code, error case (only one possible input)
        const req1 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: {} });
        const res1 = httpMocks.createResponse();
        (0, routes_1.chat)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "message" was missing');
        // Second branch, straight line code
        const req2 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { message: "I hate computers." } });
        const res2 = httpMocks.createResponse();
        (0, routes_1.chat)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getData(), { response: "Do computers worry you?" });
        const req3 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { message: "Are you alive" } });
        const res3 = httpMocks.createResponse();
        (0, routes_1.chat)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), { response: "Why are you interested in whether I am alive or not?" });
    });
    it('save', function () {
        // First branch, straight line code, error case (only one possible input)
        const req1 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { value: "some stuff" } });
        const res1 = httpMocks.createResponse();
        (0, routes_1.save)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');
        // Second branch, straight line code, error case (only one possible input)
        const req2 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A" } });
        const res2 = httpMocks.createResponse();
        (0, routes_1.save)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "value" was missing');
        // Third branch, straight line code
        const req3 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "some stuff" } });
        const res3 = httpMocks.createResponse();
        (0, routes_1.save)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), { replaced: false });
        const req4 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "different stuff" } });
        const res4 = httpMocks.createResponse();
        (0, routes_1.save)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { replaced: true });
        // Called to clear all saved transcripts created in this test
        //    to not effect future tests
        (0, routes_1.resetTranscriptsForTesting)();
    });
    it('load', function () {
        // TODO (5c): write tests for load
        //  - note that you will need to make requests to 'save' in order for there
        //    to be transcripts for load to retrieve (see example below)
        // - You should write tests using our usual branching heuristics (including
        //   all error case branches)
        // Example test:
        // First need to save something in order to load it
        const saveReq = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "key", value: "transcript value" } });
        const saveResp = httpMocks.createResponse();
        (0, routes_1.save)(saveReq, saveResp);
        // Now we can actually (mock a) request to load the transcript
        const loadReq = httpMocks.createRequest({ method: 'GET', url: '/load', query: { name: "key" } });
        const loadRes = httpMocks.createResponse();
        (0, routes_1.load)(loadReq, loadRes);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes._getData(), { value: "transcript value" });
        // Called to clear all saved transcripts created in this test
        //    to not effect future tests
        (0, routes_1.resetTranscriptsForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQUNqQywyREFBNkM7QUFDN0MscUNBQXdFO0FBR3hFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUNULHlFQUF5RTtRQUN6RSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRztZQUM3RCxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUNaLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QyxJQUFBLGFBQUksRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQ2xDLHlDQUF5QyxDQUFDLENBQUM7UUFFL0Msb0NBQW9DO1FBQ3BDLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHO1lBQ3pELEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBQyxFQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEMsSUFBQSxhQUFJLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1B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