// import * as nock from 'nock';
const nock = require('nock');
import Cache from '../src/Storage';
import axios from 'axios';
import useAxios from '../src/useAxios';
import {requestIntercepter,
    responseInterceptor,
    responseErrorInterceptor} from '../src/Storage';

test('should be a function', () => {
    expect(useAxios).toEqual(expect.any(Function));
})

const USERS = [{uuid: '123', name: 'Foo'}];
const TEST_ETAG_0 = '123ABC';
const TEST_ETAG_1 = '#123ABC';
const BASE_PATH = 'http://api.example.com';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(requestIntercepter);
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

function replyIfNoneMatchWithEtag(req, etag, results) {
    if (req.headers['if-none-match'] === etag) {
        return [200, results];
    }
    return [404, 'invalid etag'];
}

function replyEtag0() {
    replyIfNoneMatchWithEtag(this.req, TEST_ETAG_0, USERS);
}

function replyEtag1() {
    replyIfNoneMatchWithEtag(this.req, TEST_ETAG_1, USERS);
}

function replyIfNotEtagHeaders() {
    if (!this.req.headers['if-none-match']) {
        return [200, USERS];
    }
    return [404, 'ETAG headers found'];
}

test('should do the second request with a If-none-match header', done => {
    const call1 = nock(BASE_PATH).get('/users').reply(200, USERS, {Etag: TEST_ETAG_0});
    const call2 = nock(BASE_PATH).get('/users').reply(200, replyEtag0);
    axiosInstance.get(BASE_PATH + '/users').then(() => {
        axiosInstance.get(BASE_PATH + '/users').then(() => {
            expect(call1.isDone()).toBeTruthy();
            expect(call2.isDone()).toBeTruthy();
            done();
        }).catch(done);
    }).catch(done);
})

test('should works with normally when no etag is provided', done => {
    const call1 = nock(BASE_PATH).get('/actions').reply(200, USERS);
    const call2 = nock(BASE_PATH).get('/actions').reply(200, replyIfNotEtagHeaders);
    axiosInstance.get(BASE_PATH + '/actions').then(() => {
        axiosInstance.get(BASE_PATH + '/actions').then(() => {
            expect(call1.isDone()).toBeTruthy();
            expect(call2.isDone()).toBeTruthy();
            done();
        }).catch(done);
    }).catch(done);
})

test('should get the latest etag', done => {
    const call1 = nock(BASE_PATH).get('/actionsA').reply(200, USERS, {Etag: TEST_ETAG_0});
    const call2 = nock(BASE_PATH).get('/actionsA').reply(200, USERS, {Etag: TEST_ETAG_1});
    const call3 = nock(BASE_PATH).get('/actionsA').reply(200, replyEtag1);
    axiosInstance.get(BASE_PATH + '/actionsA').then(() => {
        axiosInstance.get(BASE_PATH + '/actionsA').then(() => {
            axiosInstance.get(BASE_PATH + '/actionsA').then(() => {
                expect(call1.isDone()).toBeTruthy();
                expect(call2.isDone()).toBeTruthy();
                expect(call3.isDone()).toBeTruthy();
                done();
            }).catch(done);
        }).catch(done);
    }).catch(done);
}) 

test('not cacheable methods should works with normally - POST', done => {
    const call1 = nock(BASE_PATH).post('/model').reply(200, USERS);
    axiosInstance.post(BASE_PATH + '/model').then(() => {
        expect(call1.isDone()).toBeTruthy();
        done();
    }).catch(done);
});

test('should do second request without etag if cache was reset', done => {
    const call1 = nock(BASE_PATH).get('/users').reply(200, USERS, { Etag: TEST_ETAG_0 });
    const call2 = nock(BASE_PATH).get('/users').reply(200, replyIfNotEtagHeaders);
    axiosInstance.get(BASE_PATH + '/users').then(() => {
        Cache.reset();
        axiosInstance.get(BASE_PATH + '/users').then(() => {
            expect(call1.isDone()).toBeTruthy();
            expect(call2.isDone()).toBeTruthy();
            done();
        }).catch(done);
    }).catch(done);
});