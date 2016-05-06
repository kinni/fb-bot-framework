/**
 * Created by kinnimew on 30/4/16.
 */
var FBBotFramework = require('../');

var express = require('express');
var request = require('request');
var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');

var sinon = require('sinon');

describe('Initialize', function () {

    it('should initialize correctly if token is supplied', function () {
        var bot = new FBBotFramework({page_token: "DUMMY_PAGE_TOKEN", verify_token: "DUMMY_VERIFY_TOKEN"}, function (err) {
            expect(err).to.be.a('null');
        });
    });

    it('should throw error if token is missing', function () {

        expect(function () {
            var bot = new FBBotFramework();
        }).to.throw(Error);

    });

});

describe('Middleware', function () {

    var server;
    var bot;
    var app = express();

    before(function (done) {
        bot = new FBBotFramework({page_token: "DUMMY_PAGE_TOKEN", verify_token: "DUMMY_VERIFY_TOKEN"});
        app.use('/webhook', bot.middleware());

        server = app.listen(3000, function () {
            done();
        })
    });

    after(function (done) {
        server.close(function () {
            done();
        });
    });


    it('GET /webhook should return hub.challenge value', function (done) {

        var hub = {
            verify_token: bot.verify_token,
            challenge: 'bar'
        };

        var req = {
            url: 'http://localhost:3000/webhook',
            method: 'GET',
            qs: {
                'hub.verify_token': hub.verify_token,
                'hub.challenge': hub.challenge
            }
        };

        request(req, function (err, res, body) {
            expect(err).to.be.null;
            expect(res.statusCode).equal(200);
            expect(body).equal(hub.challenge);
            done();
        })

    });

    it('POST /webhook should return HTTP200', function (done) {

        var body = {
            "object": "page",
            "entry": [{
                "id": 874297639348115,
                "time": 1462071915462,
                "messaging": [{
                    "sender": {"id": 1030608157033272},
                    "recipient": {"id": 874297639348115},
                    "timestamp": 1462071915446,
                    "message": {"mid": "mid.1462071915439:2db22192d03e67b801", "seq": 317, "text": "Hello World!"}
                }]
            }]
        };

        var req = {
            url: 'http://localhost:3000/webhook',
            method: 'POST',
            body: body,
            json: true
        };

        request(req, function (err, res, body) {
            expect(err).to.be.null;
            expect(res.statusCode).equal(200);
            done();
        })
    })
});

describe('Event Handlers', function () {

    var server;
    var bot;
    var app = express();

    var onMessageListener = sinon.spy();
    var onPostbackListener = sinon.spy();

    before(function (done) {
        bot = new FBBotFramework({page_token: "DUMMY_PAGE_TOKEN", verify_token: "DUMMY_VERIFY_TOKEN"});

        bot.on('message', onMessageListener);
        bot.on('postback', onPostbackListener);

        app.use('/webhook', bot.middleware());
        server = app.listen(3000, function () {
            done();
        });
    });

    it('should trigger message event', function (done) {

        var senderId = 1030608157033272;
        var text = "Hello World!";

        var body = {
            "object": "page",
            "entry": [{
                "id": 874297639348115,
                "time": 1462071915462,
                "messaging": [{
                    "sender": {"id": senderId},
                    "recipient": {"id": 874297639348115},
                    "timestamp": 1462071915446,
                    "message": {"mid": "mid.1462071915439:2db22192d03e67b801", "seq": 318, "text": text}
                }]
            }]
        };

        var req = {
            url: 'http://localhost:3000/webhook',
            method: 'POST',
            body: body,
            json: true
        };

        request(req, function (err, res, body) {
            expect(onMessageListener.called).to.be.true;
            expect(onMessageListener.args[0][0]).equal(senderId);
            expect(onMessageListener.args[0][1]).equal(text);
            done();
        });

    });

    it('should trigger Postback event', function (done) {

        var senderId = "1030608157033272";
        var payload = "DUMMY_PAYLOAD";

        var body = {
            "object": "page",
            "entry": [{
                "id": 874297639348115,
                "time": 1462071915462,
                "messaging": [{
                    "sender": {"id": senderId},
                    "recipient": {"id": 874297639348115},
                    "timestamp": 1462071915446,
                    "postback": {"payload": payload}
                }]
            }]
        };

        var req = {
            url: 'http://localhost:3000/webhook',
            method: 'POST',
            body: body,
            json: true
        };

        request(req, function (err, res, body) {
            expect(onPostbackListener.called).to.be.true;
            expect(onPostbackListener.args[0][0]).equal(senderId);
            expect(onPostbackListener.args[0][1]).equal(payload);
            done();
        });


    });
});