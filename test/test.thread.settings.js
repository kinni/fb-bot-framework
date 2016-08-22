/**
 * Created by kinnimew on 30/4/16.
 */
var FBBotFramework = require('../');

var nock = require('nock');
var expect = require('chai').expect;

describe('Thread Settings APIs', function () {


    var bot;
    var recipient = 1;
    var dummyResponse = {
        recipient_id: '1030608157033270',
        message_id: 'mid.1462087493117:d0dcdd2121dce00540'
    };

    before(function (done) {
        bot = new FBBotFramework({page_token: "DUMMY_PAGE_TOKEN", verify_token: "DUMMY_VERIFY_TOKEN"}, function (err) {
            done();
        })
    });

    it('should set the Greeting Text', function (done) {

        var text = "hello world!";

        var payload = {
            setting_type: "greeting",
            greeting: {text: text}
        };

        nock('https://graph.facebook.com')
            .post('/v2.6/me/thread_settings', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.setGreetingText(text, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();
        });

    });

    it('should set the Get Started Button', function (done) {

        var successfulResponse = {
            "result": "Successfully added new_thread's CTAs"
        };

        var getStarted = "GET_STARTED";

        var payload = {
            "setting_type": "call_to_actions",
            "thread_state": "new_thread",
            "call_to_actions": [
                {
                    "payload": getStarted
                }
            ]
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/thread_settings', payload)
            .query({access_token: bot.page_token})
            .reply(200, successfulResponse);


        bot.setGetStartedButton(getStarted, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(successfulResponse);
            done();

        });

    });

    it('should set the Persistent Menu', function (done) {

        var successfulResponse = {
            "result": "Successfully added new_thread's CTAs"
        };

        var menuButtons = [
            {
                "type": "postback",
                "title": "Help",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
                "type": "postback",
                "title": "Start a New Order",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
            },
            {
                "type": "web_url",
                "title": "View Website",
                "url": "http://petersapparel.parseapp.com/"
            }
        ];

        var payload = {
            "setting_type": "call_to_actions",
            "thread_state": "existing_thread",
            "call_to_actions": menuButtons
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/thread_settings', payload)
            .query({access_token: bot.page_token})
            .reply(200, successfulResponse);


        bot.setPersistentMenu(menuButtons, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(successfulResponse);
            done();

        });

    });


});