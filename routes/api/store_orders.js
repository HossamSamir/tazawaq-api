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

            res.json({ response:1 });

					});

				}

			);

		}

	);

});



app.get('/api/delivering-order', function(req, res) {

	var id = req.param('id');


	sql.qry('UPDATE orders SET status=1  WHERE id=? ', [id], function(orders,err) {
		sql.qry('UPDATE orders SET time_accepted=NOW()  WHERE id=? ', [id], function(order,err) {
		  res.json({ response:1 });
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
	sql.qry('SELECT id,cost,info,location,status,user_id,note FROM orders WHERE store_id=? and status <= 1 ORDER BY status ASC, id DESC', [store_id], function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT phone,username FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userData) {
				if(userData.length)
					orders.push( [ userData[0].phone, order.location, order.cost, order.info, order.status,order.id,order.note,userData[0].username ] );
				else
					orders.push( [ 'غير متاح', order.location, order.cost, order.info, order.status,order.id,order.note,'غير متاح' ] );
				callback(null);
			});
		}, function(err) {
			if(err) return res.json({ response: 0 });;
			res.json({ response: 1, orders });
		});
	});
});
