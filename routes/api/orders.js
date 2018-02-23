// User makes an order
app.get('/api/make-order',function(req,res){
    var store_id = req.param("store_id");
    var user_id = req.param("user_id");
    var cost = req.param("cost");
    var info = req.param("info");
    var address = req.param("address");
    var address_hint = req.param("address_hint");
    var full_location = address + " - " + address_hint;

    con.query('INSERT INTO orders(store_id,user_id,cost,info,location) VALUES(?,?,?,?,?)',
    [store_id,user_id,cost,info,full_location],
    function(err,orders) {
        if(err) return res.json({response: 0});

        con.query('SELECT token FROM expo_push_tokens WHERE store_id=? LIMIT 100',
        [store_id], function(err,tokens) {
            if(tokens.length)
            {
                var pushTokensArr = [];
                tokens.forEach(function(tok) {
                    pushTokensArr.push(tok.token);
                });
                SendPushNotifications(pushTokensArr);
            }
        });

        res.json({ response: 1 });
    });
});

app.get('/api/show-orders-current',function(req,res){
    var user_id = req.param("user_id");

    con.query('SELECT id AS `key`,  info AS title, cost AS price, status '+
         'FROM orders WHERE user_id=? and status < 2 ', [user_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
                res.json({

                    response: data[0]
                });
            }
        }
        else {
            res.json({ response:0, err });
        }
    });
});

app.get('/api/show-orders-past',function(req,res){
    var user_id = req.param("user_id");

    con.query('SELECT id AS `key`,  info AS title, cost AS price, status '+
         'FROM orders WHERE user_id=? and status = 2 ', [user_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
                res.json({

                    response: data[0]
                });
            }
        }
        else {
            res.json({ response:0, err });
        }
    });
});


app.get('/api/order-price',function(req,res){
    var ids = req.param("ids");
    var price = 0;
    var ids = ids.split(",");
    var store_id = 0;
    for(let i in ids){
      if(ids[i] != null || ids[i] != 'null'){
        con.query('SELECT cost,store_id '+
             'FROM products WHERE id=? LIMIT 1', [ids[i]], function(err,data) {
            if(!err) {
              var data = data[0];
            
                var store_id = data.store_id;

              if(data != null){
                console.log(store_id)
                price = price + data.cost
              }

            }
            else {
                res.json({ response:0, err });
            }
            if(i == ids.length-1){
              con.query('SELECT delivery_cost '+
                   'FROM stores WHERE id=? LIMIT 1', [store_id], function(err,deliver_price) {
                     res.json({
                          before:price+deliver_price[0].delivery_cost,
                          after:(price+deliver_price[0].delivery_cost)+(.03*(price+deliver_price[0].delivery_cost)),
                          store_id,

                     });
                  });

              }
            })
      }
    }
});



function SendPushNotifications(pushTokens)
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
            body: 'هناك طلب جديد على مطعمك. تفحص صفحة طلبات المطعم',
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
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}
