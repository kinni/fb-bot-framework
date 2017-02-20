# FB Bot Framework
`fb-bot-framework` is a node framework for [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)(FB Messenger Bot).

## Installation
```bash
npm install fb-bot-framework --save
```

## Features
* work as Express Middleware
* implement of [Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference).
* customize notification type(REGULAR, SILENT_PUSH, NO_PUSH) for each individual message
* implement of Thread Settings API (Greeting Text / Get Started Button / Persistent Menu)


## Example Usage
You can use ```bot.middleware()``` to hook any request to the path ```/webhook``` to the bot.

```js
var express = require('express');
var app = express();

var FBBotFramework = require('fb-bot-framework');

// Initialize
var bot = new FBBotFramework({
	page_token: "THIS_IS_PAGE_TOKEN",
    verify_token: "THIS_IS_VERIFY_TOKEN"
});

// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());

// Setup listener for incoming messages
bot.on('message', function(userId, message){
    // bot.sendTextMessage(userId, "Echo Message:" + message);
	
    // Send quick replies
    var replies = [
        {
            "content_type": "text",
            "title": "Good",
            "payload": "thumbs_up"
        },
        {
            "content_type": "text",
            "title": "Bad",
            "payload": "thumbs_down"
        }
    ];
    bot.sendQuickReplies(userId, message, replies);
});

// Setup listener for quick reply messages
bot.on('quickreply', function(userId, payload){
	bot.sendTextMessage(userId, "payload:" + payload);
});

// Config the Get Started Button and register a callback
bot.setGetStartedButton("GET_STARTED");
bot.on('postback', function(userId, payload){

    if (payload == "GET_STARTED") {
        getStarted(userId);
    }
    
    // Other postback callbacks here
    // ...
    
});

function getStarted(userId){
    
    // Get started process 
}

// Setup listener for attachment
bot.on('attachment', function(userId, attachment){
    
    // Echo the audio attachment
    if (attachment[0].type == "audio") {
        bot.sendAudioAttachment(userId, attachment[0].payload.url);
    }
    
});

// Make Express listening
app.listen(3000);
```

## API
### Events
#### ```bot.on("message", function(userId, message))```

Triggered when an user sends a typed message to the bot.
* ```userId``` - String: The Facebook Id of the sender.
* ```message``` - String: The actual message sent by the user.

####  ```bot.on("postback", function(userId, payload))```

Triggered when an user clicks a button which will send a postback message.
* ```userId``` - String: The Facebook Id of the sender.
* ```payload``` - String: The payload associated with the button clicked by the user.

####  ```bot.on("quickreply", function(userId, payload))```

Triggered when an user clicks a quick reply button..
* ```userId``` - String: The Facebook Id of the sender.
* ```payload``` - String: The payload associated with the button clicked by the user.


### Functions
#### ```bot.setGreetingText(text, cb)```
Set the greeting message for new conversations.
* ```text``` - The greeting text
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.setGetStartedButton(payload, cb)```
Set the Get Started button postback callback in the Welcome Screen.
* ```payload``` - The postback callback to be called
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.setPersistentMenu(menuButtons, cb)```
Set the Persistent Menu which is always available to the user.
* ```menuButtons``` - The menu button for the Persistent Menu
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.
```js
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
bot.setPersistentMenu(menuButtons);
```

#### ```bot.sendTextMessage(userId, text, notificationType, cb)```
Send a text message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```text``` - The actual text
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendImageMessage(userId, imageUrl, notificationType, cb)```
Send an image message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```imageUrl``` - The url of the image
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendAudioAttachment(userId, audioUrl, notificationType, cb)```
Send an image message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```audioUrl``` - The url of the audio file
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendVideoAttachment(userId, videoUrl, notificationType, cb)```
Send an image message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```videoUrl``` - The url of the video file
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendFileAttachment(userId, fileUrl, notificationType, cb)```
Send an image message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```fileUrl``` - The url of the file
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendButtonMessage(userId, text, buttons, notificationType, cb)```
Send a message with buttons to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```text``` - The title of the message
* ```buttons``` - The buttons of the message
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

```js
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
bot.sendButtonMessage(recipient, text, buttons);
```

#### ```bot.sendGenericMessage(userId, elements, notificationType, cb)```
Send a message with bubbles(horizontal scroll cards) to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```elements``` - The elements of the message
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

```js

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

bot.sendGenericMessage(recipient, elements, buttons);
```

#### ```bot.sendBubbleMessage(userId, elements, notificationType, cb)```
It is the same as ```sendGenericMessage()```

#### ```bot.sendReceiptMessage(userId, receipt, notificationType, cb)```
Send a message with receipt to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```elements``` - The elements of the message
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

```js

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

bot.sendReceiptMessage(recipient, receipt);
```

#### ```bot.sendLocationRequest(userId, text, notificationType, cb)```
Send a location request message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```text``` - The prompt text ask for location
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

#### ```bot.sendQuickReplies(userId, text, replies, notificationType, cb)```
Send quick reply message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```text``` - The title of the message
* ```replies``` - The quick reply buttons
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Optional, callback with arguments of ```err``` and ```result```.

```js
var replies = [
    {
        "content_type": "text",
        "title": "Good",
        "payload": "thumbs_up"
    },
    {
        "content_type": "text",
        "title": "Bad",
        "payload": "thumbs_down"
    }
];
bot.sendQuickReplies(userId, message, replies);

bot.on('quickreply', function (userId, payload) {
    console.log("payload =" + payload);
});

```

#### ```bot.sendListMessage(userId, elements, notificationType, cb)```
Send quick reply message to a specific user.
* ```userId``` - The recipient's Facebook Id
* ```elements``` - The list elements of the message
* ```notificationType``` - Optional, push notification type: REGULAR (default), SILENT_PUSH, NO_PUSH
* ```cb``` - Op

```js
var elements = [
    {
        "title": "Classic T-Shirt Collection",
        "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
        "subtitle": "See all our colors",
        "default_action": {
            "type": "web_url",
            "url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
        },
        "buttons": [
            {
                "title": "View",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/collection",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
            }
        ]
    },
    {
        "title": "Classic White T-Shirt",
        "image_url": "https://peterssendreceiveapp.ngrok.io/img/white-t-shirt.png",
        "subtitle": "100% Cotton, 200% Comfortable",
        "default_action": {
            "type": "web_url",
            "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
        },
        "buttons": [
            {
                "title": "Shop Now",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/shop?item=100",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
            }
        ]                
    },
    {
        "title": "Classic Blue T-Shirt",
        "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
        "subtitle": "100% Cotton, 200% Comfortable",
        "default_action": {
            "type": "web_url",
            "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
        },
        "buttons": [
            {
                "title": "Shop Now",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
            }
        ]                
    },
    {
        "title": "Classic Black T-Shirt",
        "image_url": "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
        "subtitle": "100% Cotton, 200% Comfortable",
        "default_action": {
            "type": "web_url",
            "url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
        },
        "buttons": [
            {
                "title": "Shop Now",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
            }
        ]                
    }
];
bot.sendListMessage(userId, elements);

```

#### ```bot.getUserProfile(userId, cb)```
Get the Facebook profile from a specific user.
* ```userId``` - The target's Facebook Id
* ```cb``` - callback with arguments of ```err``` and ```profile```.

```js
bot.getUserProfile(userId, function (err, profile) {
    console.log(profile);
});
```