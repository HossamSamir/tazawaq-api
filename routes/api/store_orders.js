var crypto = require('crypto');




app.get('/api/delivered-order', function(req, res) {

	var id = req.param('id');

	var store_id = req.param('store_id');

	sql.qry(

		'SELECT id,cost,info,location FROM orders WHERE id=? LIMIT 1',

		[id],

		function(orders) {

			var order = orders[0];

			sql.qry(

				'INSERT INTO sales(store_id,info,location,cost,date) VALUES(?,?,?,?, NOW() )',

				[store_id, order.info, order.location, order.cost],

				function(insert) {

					sql.qry("UPDATE orders SET status=2 WHERE id=?", [id], function(del) {

						sql.qry('select * from orders  WHERE id=? ', [id], function(order,err) {
						//client push notification ----------->
						con.query('SELECT token FROM user_push_tokens WHERE user_id=? LIMIT 100',
						[order[0].user_id], function(err,tokens) {
								if(tokens.length)
								{
										var pushTokensArr = [];
										tokens.forEach(function(tok) {
											push(tok.token,'عزيزي العميل : تم توصيل طلبك بنجاح ، ولاتنسى تقييم مستوى الخدمة على وسائل التواصل ، و بانتظار تكرار طلب الخدمة ')

												// pushTokensArr.push(tok.token);
										});
										// SendPushNotifications(pushTokensArr,'');
								}
						});
					});
            res.json({ response:1 });

					});

				}

			);

		}

	);

});


app.get('/push-noti',function(req,res){
	var text = req.param('text');

	con.query('SELECT token FROM user_push_tokens ', function(err,tokens) {
			if(tokens.length)
			{
					var pushTokensArr = [];
					tokens.forEach(function(tok) {
						push(tok.token,text)
							// pushTokensArr.push(tok.token);
					});
				// if(SendPushNotifications(pushTokensArr,text)){
				// 	res.redirect('/notify')
				// }
			}
	});
});


app.get('/api/delivering-order', function(req, res) {

	var id = req.param('id');


	sql.qry('UPDATE orders SET status=1  WHERE id=? ', [id], function(orders,err) {
		sql.qry('UPDATE orders SET time_accepted=NOW()  WHERE id=? ', [id], function(order,err) {
		  res.json({ response:1 });

			sql.qry('select * from orders  WHERE id=? ', [id], function(order,err) {
			//client push notification ----------->
			con.query('SELECT token FROM user_push_tokens WHERE user_id=? LIMIT 100',
			[order[0].user_id], function(err,tokens) {
					if(tokens.length)
					{
							var pushTokensArr = [];
							tokens.forEach(function(tok) {
								push(tok.token,'عزيزي العميل : تم قبول طلبك وسيقوم فريق التوصيل بإعداد الطلب و توصيله بأقرب وقت .')
									pushTokensArr.push(tok.token);
							});
							// SendPushNotifications(pushTokensArr,'');
					}
			});
		});



		});
	});

});














app.get('/api/store-owner-login',function(req,res){
    var passname = req.param("passname");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");

    con.query('SELECT id FROM stores WHERE passname=? AND password=? LIMIT 1', [passname, hash], function(err,data) {
        if(!err) {
            if(data.length == 0)
            {
                res.json({
                    response: 0
                });
            }
            else
            {
                res.json({
                    response: String(data[0]['id'])
                });
            }
        }
        else
        {
            res.json({ response:0, err });
        }
    });
});

function getStatusAsStr(status) {
    switch(status)
    {
        case 0:
            return ("قيد القبول");
        case 1:
            return ("جاري التوصيل");
        case 2:
            return ("تم التوصيل");
    }
}

app.get('/api/get-store-orders', function(req, res) {
	var store_id = req.param("store_id");
	sql.qry('SELECT id,cost,info,location,store_id,status,user_id,note,cost_dicounted FROM orders WHERE store_id=? and status <= 1 ORDER BY status ASC, id DESC', [store_id], function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT phone,username FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userData) {
				sql.qry('select * from stores where id = ?',[order.store_id],function(store,err){

				if(userData.length)
					orders.push( [ userData[0].phone, order.location,  order.status,order.id,order.note,userData[0].username,order.cost_dicounted,store[0].delivery_cost,userData[0].phone] );
				else
					orders.push( [ 'غير متاح', order.location,  order.status,order.id,order.note,'غير متاح',order.cost_dicounted,store[0].delivery_cost,userData[0].phone ] );
				callback(null);
				})
			});
		}, function(err) {
			if(err) return res.json({ response: 0 });;
			res.json({ response: 1, orders });
		});
	});
});

app.get('/api/change_store_status',function(req,res){
	var id = req.param('store_id');
	var status = req.param('status');
	sql.qry('UPDATE stores SET status=?  WHERE id=? ', [status,id], function(orders,err) {
		res.json({res:status})
	});
})

app.get('/api/get-orders', function(req, res) {

	sql.qry('SELECT * FROM orders WHERE status <= 50 ORDER BY status ASC, id DESC', function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT phone,username FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userData) {
				sql.qry('select * from stores where id = ?',[order.store_id],function(store,err){

				if(userData.length)
					orders.push( [ userData[0].phone, order.location, order.cost, order.info] );
				else
					orders.push( [ 'غير متاح', order.location, order.cost] );
				callback(null);
				})
			});
		}, function(err) {
			if(err) return res.json({ response: 0 });;
			res.json({ response: 1, orders });
		});
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
      res.json( response);
    })
    .catch((error) => {
      res.send('Error sending message:', error);
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
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}
