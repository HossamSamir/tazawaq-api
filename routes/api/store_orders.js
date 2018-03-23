var crypto = require('crypto');

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
	sql.qry('SELECT id,cost,info,location,status,user_id FROM orders WHERE store_id=? ORDER BY status ASC, id DESC', [store_id], function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT phone FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userData) {
				if(userData.length)
					orders.push( [ userData[0].phone, 'location('+order.location+')', order.cost, order.info, getStatusAsStr(order.status) ] );
				else
					orders.push( [ 'غير متاح', 'location('+order.location+')', order.cost, order.info, getStatusAsStr(order.status) ] );
				callback(null);
			});
		}, function(err) {
			if(err) return res.json({ response: 0 });;
			res.json({ response: 1, orders });
		});
	});
});
