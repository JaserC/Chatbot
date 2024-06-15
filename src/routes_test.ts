import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { chat, save, load, resetTranscriptsForTesting } from './routes';


describe('routes', function() {

  it('chat', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {}});
    const res1 = httpMocks.createResponse();
    chat(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "message" was missing');

    // Second branch, straight line code
    const req2 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {message: "I hate computers."}});
    const res2 = httpMocks.createResponse();
    chat(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        {response: "Do computers worry you?"});

    const req3 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {message: "Are you alive"}});
    const res3 = httpMocks.createResponse();
    chat(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(),
        {response: "Why are you interested in whether I am alive or not?"});

  });

  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {replaced: false});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

  it('load', function() {
    // TODO (5c): write tests for load
    //  - note that you will need to make requests to 'save' in order for there
    //    to be transcripts for load to retrieve (see example below)
    // - You should write tests using our usual branching heuristics (including
    //   all error case branches)


    // Example test:
    // First need to save something in order to load it
    const saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "key", value: "transcript value"}});
    const saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    // Now we can actually (mock a) request to load the transcript
    const loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "key"}});
    const loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.strictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {value: "transcript value"});

    const saveReq2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "Transcript 1", value: "Fuck it, we ball"}});
    const saveRes2 = httpMocks.createResponse();
    save(saveReq2, saveRes2);

    const saveReq3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "Transcript 2", value: "Fuck, we can't ball"}});
    const saveRes3 = httpMocks.createResponse();
    save(saveReq3, saveRes3);

    //ERROR BLOCK (no name passed)
    //2 tests
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {}});
    const loadRes2 = httpMocks.createResponse();
    load(loadReq2, loadRes2);
    assert.strictEqual(loadRes2._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes2._getData(),
        'required argument "name" was missing');

    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {randoParam: "Random"}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);
    assert.strictEqual(loadRes3._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes3._getData(),
        'required argument "name" was missing');

    //Error Block (no transcript found)
    //2 tests
    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Ballers"}});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);
    assert.strictEqual(loadRes4._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes4._getData(),
        'no transcript found with that name');

    const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Transcript"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);
    assert.strictEqual(loadRes5._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes5._getData(),
        'no transcript found with that name');

    //FOUND BLOCK (name passed and transcript found)
    //2 tests
    const loadReq6 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Transcript 1"}});
    const loadRes6 = httpMocks.createResponse();
    load(loadReq6, loadRes6);
    assert.strictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), {value: "Fuck it, we ball"});

    const loadReq7 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "Transcript 2"}});
    const loadRes7 = httpMocks.createResponse();
    load(loadReq7, loadRes7);
    assert.strictEqual(loadRes7._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes7._getData(), {value: "Fuck, we can't ball"});


    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

});
