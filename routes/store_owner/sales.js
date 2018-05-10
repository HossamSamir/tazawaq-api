function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry(
		'SELECT id,cost,delivery_cost,info,location,user_id,status,TIMESTAMPDIFF(MINUTE,time_ordered,NOW()) AS elapsed_time,TIMESTAMPDIFF(MINUTE,time_accepted,NOW()) AS accepted_time_passed,note FROM orders WHERE store_id=? and status=2 ORDER BY id DESC',
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
					res.render('store_owner/sales', { store_id, sales:orders });
				}
			);
		}
	);
	// var store_id = req.params.store_id;
	// sql.qry('SELECT cost,date,info,location FROM sales WHERE store_id=? ORDER BY id DESC', [store_id], function(sales) {
	// 	res.render('store_owner/sales', { sales, store_id });
	// });
}

module.exports = travers;
