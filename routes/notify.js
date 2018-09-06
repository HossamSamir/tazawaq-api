function travers(req, res) {
		res.render('notify');

}

app.get('/push-noti',function(req,res){
	var text = req.param('text');

	con.query('SELECT token FROM user_push_tokens ', function(err,tokens) {
			if(tokens.length)
			{
				for(let i in tokens){
					push(tokens[i].token,text);
				}
			}
	});
});

function push(registrationToken,body){

  // See documentation on defining a message payload.
  var message = {
    notification: {
      title:'Talbatk',
      body,
      icon: "default",
sound:"default",
vibrate:"true"

    },
  };
   var options = {
     priority:"high",
   }
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken,message,options)
    .then((response) => {
      // Response is a message ID string.
      console.log( response.results);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

}

function SendPushNotifications(pushTokens,message_body)
{
    const Expo = require('expo-server-sdk');

    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that you want to send to clents
    let messages = [];
    for (let pushToken of pushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: 'default',
            body: message_body,
            data: { },
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);

    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                return true;
            } catch (error) {
                return false
            }
        }
    })();
}


module.exports = travers;
