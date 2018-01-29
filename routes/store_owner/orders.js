function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry('SELECT id,cost,info,location FROM orders WHERE store_id=? ORDER BY id DESC', [store_id], function(orders_res) {
		var orders = [];
		async.forEachOf(orders_res, function (order, i, callback) {
			sql.qry('SELECT username FROM users WHERE id=? LIMIT 1', [ order.user_id ], function(userName) {
				sales.push( { username: userName[0].username, data: order } );
				callback(null);
			});
		}, function(err) {
			if(err) throw err;
			res.render('store_owner/orders', { store_id, orders });
		});
	});
}

module.exports = travers;
