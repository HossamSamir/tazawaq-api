function travers(req, res) {
	sql.qry(
		'SELECT id,cost,delivery_cost,info,location,user_id,status,store_id,TIMESTAMPDIFF(MINUTE,time_ordered,NOW()) AS elapsed_time,TIMESTAMPDIFF(MINUTE,time_accepted,NOW()) AS accepted_time_passed,note  FROM orders where store_id < 0 and status < 2 ORDER BY id DESC',
		function(orders_res) {
			var orders = [];
			async.forEachOf(
				orders_res,
				function(order, i, callback) {
					sql.qry(
						'SELECT username, phone FROM users WHERE id=? LIMIT 1',
						[order.user_id],
						function(userData) {


									if (userData.length) orders.push({
											username: userData[0].username,
											phone: userData[0].phone,
											data: order,
										});
									else orders.push({ username: 'غير متاح', phone: '', data: order });

									callback(null);

						}
					);
				},
				function(err) {
					if (err) throw err;
					res.render('special_orders', { orders });
				}
			);
		}
	);
}

app.get('/delete-special-order',function(req,res) {
	var id = req.param("id");
	sql.qry('DELETE FROM orders WHERE id=?', [id], function() {
		res.redirect('special_orders');
	});
});

module.exports = travers;
