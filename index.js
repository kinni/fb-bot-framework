/**
 * Created by kinnimew on 26/4/16.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var request = require("request");

const FB_MESSENGER_ENDPOINT = "https://graph.facebook.com/v2.6/me/messages";
const FB_PROFILE_ENDPOINT = "https://graph.facebook.com/v2.6/";

const NOTIFICATION_TYPE = {
    REGULAR: "REGULAR",
    SILENT_PUSH: "SILENT_PUSH",
    NO_PUSH: "NO_PUSH"
};

function FBBotFramework(options, cb) {

    if (!options || !options.page_token) {

        var error = new Error("Page Access Token missing. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart");

        if (typeof cb === "function") {
            return cb(error)
        }

        throw error;
    }

    this.page_token = options.page_token;
    this.verify_token = options.verify_token;
    this.commands = [];

    if (cb) cb(null);

}

// Setup
util.inherits(FBBotFramework, EventEmitter);

FBBotFramework.NOTIFICATION_TYPE = NOTIFICATION_TYPE;

FBBotFramework.prototype.verify = function (req, res) {
    if (req.query['hub.verify_token'] === this.verify_token) {
        res.send(req.query['hub.challenge']);
    } else {
        res.status(500).send('Error, wrong validation token');
    }
};

// Send API, Details please visit https://developers.facebook.com/docs/messenger-platform/send-api-reference#request

FBBotFramework.prototype.send = function (recipient, messageData, notificationType, cb) {
    notificationType = notificationType || NOTIFICATION_TYPE.REGULAR;

    if (typeof notificationType === 'function') {
        cb = notificationType;
        notificationType = NOTIFICATION_TYPE.REGULAR
    }

    var req = {
        url: FB_MESSENGER_ENDPOINT,
        qs: {access_token: this.page_token},
        method: "POST",
        json: {
            recipient: {id: recipient},
            message: messageData,
            notification_type: notificationType
        }
    };

    request(req, function (err, res, body) {
        if (cb) {
            if (err) return cb(err);
            if (body.error) return cb(body.error);
            cb(null, body);
        }
    });

};


FBBotFramework.prototype.sendTextMessage = function (recipient, text, notificationType, cb) {
    var messageData = {text: text};
    this.send(recipient, messageData, notificationType, cb);
};

FBBotFramework.prototype.sendImageMessage = function (recipient, imageUrl, notificationType, cb) {
    var messageData = {
        attachment: {
            type: "image",
            payload: {url: imageUrl}
        }
    };

    this.send(recipient, messageData, notificationType, cb);
};

FBBotFramework.prototype.sendButtonMessage = function (recipient, text, buttons, notificationType, cb) {

    var messageData = {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: text,
                buttons: buttons
            }
        }
    };

    this.send(recipient, messageData, notificationType, cb);
};


// Limitation
// Title: 45 characters
// Subtitle: 80 characters
// Call-to-action title: 20 characters
// Call-to-action items: 3 buttons
// Bubbles per message (horizontal scroll): 10 elements

FBBotFramework.prototype.sendBubbleMessage = FBBotFramework.prototype.sendGenericMessage = function (recipient, elements, notificationType, cb) {
    var messageData = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: elements
            }
        }
    };

    this.send(recipient, messageData, notificationType, cb);

};

FBBotFramework.prototype.sendReceiptMessage = function (recipient, receipt, notificationType, cb) {

    if (!receipt.template_type) {
        receipt.template_type = "receipt";
    }

    var messageData = {
        "attachment": {
            "type": "template",
            "payload": receipt
        }
    };

    this.send(recipient, messageData, notificationType, cb);
};

FBBotFramework.prototype.getUserProfile = function (userId, cb) {

    var req = {
        method: "GET",
        uri: FB_PROFILE_ENDPOINT + userId,
        qs: {
            fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
            access_token: this.page_token
        },
        json: true
    };

    request(req, function (err, res, body) {
        if (err) return cb(err);
        if (body.error) return cb(body.error);
        cb(null, body);
    });
};

// Middleware
FBBotFramework.prototype.middleware = function () {

    var bot = this;

    return function (req, res) {
        if (req.method === 'GET') {
            return bot.verify(req, res);
        }

        if (req.method === 'POST') {

            // Read data from the request
            var data = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                data += chunk;
            });

            req.on('end', function () {

                // Always return HTTP200 to Facebook's POST Request
                res.send({});

                var messageData = JSON.parse(data);
                var messagingEvent = messageData.entry[0].messaging;
                messagingEvent.forEach(function (event) {

                    // Extract senderID, i.e. recipient
                    var sender = event.sender.id;

                    if (event.message && event.message.text) {
                        bot.emit('message', sender, event.message.text);
                    }

                    if (event.postback && event.postback.payload) {
                        bot.emit('postback', sender, event.postback.payload);
                    }

                });
            });

        }
    };
};

module.exports = FBBotFramework;