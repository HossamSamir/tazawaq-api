function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry(
		'SELECT id,cost,delivery_cost,info,location,user_id,status,TIMESTAMPDIFF(MINUTE,time_ordered,NOW()) AS elapsed_time FROM orders WHERE store_id=? ORDER BY id DESC',
		[store_id],
		function(orders_res) {
			var orders = [];
			async.forEachOf(
				orders_res,
				function(order, i, callback) {
					sql.qry(
						'SELECT username, phone FROM users WHERE id=? LIMIT 1',
						[order.user_id],
						function(userData) {
							if (userData.length)
								orders.push({
									username: userData[0].username,
									phone: userData[0].phone,
									data: order
								});
							else
								orders.push({ username: 'غير متاح', phone: '', data: order });
							callback(null);
						}
					);
				},
				function(err) {
					if (err) throw err;
					res.render('store_owner/orders', { store_id, orders });
				}
			);
		}
	);
}

app.get('/delivered-order', function(req, res) {
	var id = req.param('id');
	var store_id = req.param('store_id');
	var user_id = req.param('user_id');
	sql.qry(
		'SELECT id,cost,info,location FROM orders WHERE id=? LIMIT 1',
		[id],
		function(orders) {
			var order = orders[0];
			sql.qry(
				'INSERT INTO sales(store_id,info,location,cost,date) VALUES(?,?,?,?, NOW() )',
				[store_id, order.info, order.location, order.cost],
				function(insert) {
					sql.qry("DELETE FROM orders WHERE id=?", [id], function(del) {
						con.query('SELECT token FROM user_push_tokens WHERE user_id=? LIMIT 10',
						[user_id], function(err,tokens) {
							if(tokens.length)
							{
								var pushTokensArr = [];
								tokens.forEach(function(tok) {
									pushTokensArr.push(tok.token);
								});
								SendPushNotifications(pushTokensArr, 'عميلنا الكريم : تم توصيل طلبك بنجاح و لا تنسى تقييم مستوى الخدمة و بانتظار طلبك القادم', () => {
									res.redirect('store_orders/' + store_id);
								});
							}
							else res.redirect('store_orders/' + store_id);
						});
						//res.redirect('store_orders/' + store_id);
					});
				}
			);
		}
	);
});

app.get('/delivering-order', function(req, res) {
	var id = req.param('id');
	var store_id = req.param('store_id');
	var user_id = req.param('user_id');
	sql.qry('UPDATE orders SET status=1 WHERE id=?', [id], function(orders) {
		sql.qry('UPDATE orders SET time_accepted=NOW()  WHERE id=? ', [id], function(order,err) {
			con.query('SELECT token FROM user_push_tokens WHERE user_id=? LIMIT 10',
			[user_id], function(err,tokens) {
				if(tokens.length)
				{
					var pushTokensArr = [];
					tokens.forEach(function(tok) {
						pushTokensArr.push(tok.token);
					});
					SendPushNotifications(pushTokensArr, 'عميلنا الكريم : تم قبول طلبك و جاري اعداد الطلب و التوصيل', () => {
						res.redirect('store_orders/' + store_id);
					});
				}
				else res.redirect('store_orders/' + store_id);
			});
		  //res.redirect('store_orders/' + store_id);
		});

	});
});

function SendPushNotifications(pushTokens, message, callback)
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
            body: message,
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

		callback()
    })();
}

module.exports = travers;
