/**
 * Created by kinnimew on 30/4/16.
 */
var FBBotFramework = require('../');

var nock = require('nock');
var expect = require('chai').expect;

describe('Send API', function () {


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

    it('should send text message', function (done) {

        var text = "hello world!";

        var payload = {
            recipient: {id: recipient},
            message: {text: text}
        };

        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendTextMessage(recipient, text, FBBotFramework.NOTIFICATION_TYPE.SILENT_PUSH, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send image message', function (done) {

        var imageUrl = "https://petersapparel.com/img/shirt.png";

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "https://petersapparel.com/img/shirt.png"
                    }
                }
            }
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendImageMessage(recipient, imageUrl, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send audio attachment', function (done) {

        var audioUrl = "https://petersapparel.com/img/shirt.png";

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "audio",
                    "payload": {
                        "url": audioUrl
                    }
                }
            }
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendAudioAttachment(recipient, audioUrl, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send video attachment', function (done) {

        var videoUrl = "https://petersapparel.com/bin/clip.mp4";

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "audio",
                    "payload": {
                        "url": videoUrl
                    }
                }
            }
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendAudioAttachment(recipient, videoUrl, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send file attachment', function (done) {

        var fileUrl = "https://petersapparel.com/bin/receipt.pdf";

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "audio",
                    "payload": {
                        "url": fileUrl
                    }
                }
            }
        };


        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendAudioAttachment(recipient, fileUrl, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send button message', function (done) {

        var text = "What do you want to do next?";
        var buttons = [
            {
                "type": "web_url",
                "url": "https://petersapparel.parseapp.com",
                "title": "Show Website"
            },
            {
                "type": "postback",
                "title": "Start Chatting",
                "payload": "USER_DEFINED_PAYLOAD"
            }
        ];

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": text,
                        "buttons": buttons
                    }
                }
            }
        };

        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendButtonMessage(recipient, text, buttons, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send generic/bubble message', function (done) {

        var elements = [
            {
                "title": "Classic White T-Shirt",
                "image_url": "http://petersapparel.parseapp.com/img/item100-thumb.png",
                "subtitle": "Soft white cotton t-shirt is back in style",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://petersapparel.parseapp.com/view_item?item_id=100",
                        "title": "View Item"
                    },
                    {
                        "type": "web_url",
                        "url": "https://petersapparel.parseapp.com/buy_item?item_id=100",
                        "title": "Buy Item"
                    },
                    {
                        "type": "postback",
                        "title": "Bookmark Item",
                        "payload": "USER_DEFINED_PAYLOAD_FOR_ITEM100"
                    }
                ]
            },
            {
                "title": "Classic Grey T-Shirt",
                "image_url": "http://petersapparel.parseapp.com/img/item101-thumb.png",
                "subtitle": "Soft gray cotton t-shirt is back in style",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://petersapparel.parseapp.com/view_item?item_id=101",
                        "title": "View Item"
                    },
                    {
                        "type": "web_url",
                        "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                        "title": "Buy Item"
                    },
                    {
                        "type": "postback",
                        "title": "Bookmark Item",
                        "payload": "USER_DEFINED_PAYLOAD_FOR_ITEM101"
                    }
                ]
            }
        ];

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": elements
                    }
                }
            }
        };

        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendBubbleMessage(recipient, elements, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should send receipt message', function (done) {

        var receipt = {
            "recipient_name": "Stephane Crozatier",
            "order_number": "12345678902",
            "currency": "USD",
            "payment_method": "Visa 2345",
            "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
            "timestamp": "1428444852",
            "elements": [
                {
                    "title": "Classic White T-Shirt",
                    "subtitle": "100% Soft and Luxurious Cotton",
                    "quantity": 2,
                    "price": 50,
                    "currency": "USD",
                    "image_url": "http://petersapparel.parseapp.com/img/whiteshirt.png"
                },
                {
                    "title": "Classic Gray T-Shirt",
                    "subtitle": "100% Soft and Luxurious Cotton",
                    "quantity": 1,
                    "price": 25,
                    "currency": "USD",
                    "image_url": "http://petersapparel.parseapp.com/img/grayshirt.png"
                }
            ],
            "address": {
                "street_1": "1 Hacker Way",
                "street_2": "",
                "city": "Menlo Park",
                "postal_code": "94025",
                "state": "CA",
                "country": "US"
            },
            "summary": {
                "subtotal": 75.00,
                "shipping_cost": 4.95,
                "total_tax": 6.19,
                "total_cost": 56.14
            },
            "adjustments": [
                {
                    "name": "New Customer Discount",
                    "amount": 20
                },
                {
                    "name": "$10 Off Coupon",
                    "amount": 10
                }
            ]
        };

        var payload = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": receipt
                }
            }
        };

        nock('https://graph.facebook.com')
            .post('/v2.6/me/messages', payload)
            .query({access_token: bot.page_token})
            .reply(200, dummyResponse);

        bot.sendReceiptMessage(recipient, receipt, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.deep.equal(dummyResponse);
            done();

        });

    });

    it('should return user\'s profile', function (done) {

        var response = {
            "first_name": "Peter",
            "last_name": "Chang",
            "profile_pic": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p200x200/13055603_10105219398495383_8237637584159975445_n.jpg?oh=1d241d4b6d4dac50eaf9bb73288ea192&amp;oe=57AF5C03&amp;__gda__=1470213755_ab17c8c8e3a0a447fed3f272fa2179ce",
            "locale": "en_US",
            "timezone": -7,
            "gender": "male"
        };

        nock('https://graph.facebook.com')
            .get('/v2.6/' + recipient)
            .query({fields: "first_name,last_name,profile_pic,locale,timezone,gender", access_token: bot.page_token})
            .reply(200, response);

        bot.getUserProfile(recipient, function (err, profile) {
            expect(err).to.be.null;
            expect(profile).deep.equal(response);
            done();
        });

    });

});