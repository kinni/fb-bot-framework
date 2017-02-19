/**
 * Created by mewkinni on 19/2/2017.
 */
var express = require('express');
var app = express();

var FBBotFramework = require('../');

// Initialize
var bot = new FBBotFramework({
    page_token: "THIS_IS_PAGE_TOKEN",
    verify_token: "THIS_IS_VERIFY_TOKEN"
});

// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());

// Setup listener for incoming messages
bot.on('message', function (userId, message) {

    // Send text message
    // bot.sendTextMessage(userId, "Echo Message:" + message);

    // Send quick replies
    var replies = [
        {
            "content_type": "text",
            "title": "👍",
            "payload": "thumbs_up"
        },
        {
            "content_type": "text",
            "title": "👎",
            "payload": "thumbs_down"
        }
    ];
    bot.sendQuickReplies(userId, message, replies);
});

bot.on('quickreply', function (userId, payload) {
    bot.sendTextMessage(userId, "payload:" + payload);
});

// Config the Get Started Button and register a callback
bot.setGetStartedButton("GET_STARTED");
bot.on('postback', function (userId, payload) {

    if (payload == "GET_STARTED") {
        getStarted(userId);
    }

    // Other postback callbacks here
    // ...

});

function getStarted(userId) {

    // Get started process 
}

// Setup listener for attachment
bot.on('attachment', function (userId, attachment) {

    // Echo the audio attachment
    if (attachment[0].type == "audio") {
        bot.sendAudioAttachment(userId, attachment[0].payload.url);
    }

});

// Make Express listening
app.listen(3000);