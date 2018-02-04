function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry('SELECT id,cost,info,location,user_id FROM orders WHERE store_id=? ORDER BY id DESC', [store_id], function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT username, phone FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userData) {
				if(userData.length)
					orders.push( { username: userData[0].username, phone: userData[0].phone, data: order } );
				else
					orders.push( { username: 'غير متاح', phone:'', data: order } );
				callback(null);
			});
		}, function(err) {
			if(err) throw err;
			res.render('store_owner/orders', { store_id, orders });
		});
	});
}

app.get('/delivered-order', function(req, res) {
	var id = req.param("id");
	var store_id = req.param("store_id");
	sql.qry('SELECT id,cost,info,location FROM orders WHERE id=? LIMIT 1', [id], function(orders) {
		var order = orders[0];
		sql.qry('INSERT INTO sales(store_id,info,location,cost,date) VALUES(?,?,?,?, NOW() )',
			[store_id, order.info, order.location, order.cost], function(insert) {
			sql.qry('DELETE FROM orders WHERE id=?', [id], function(del) {
				res.redirect('store_orders/' + store_id);
			});
		});
	});
});

module.exports = travers;
