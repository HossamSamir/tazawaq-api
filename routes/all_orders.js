function travers(req, res) {
	sql.qry(
		'SELECT id,cost,delivery_cost,info,location,user_id,status,store_id,TIMESTAMPDIFF(MINUTE,time_ordered,NOW()) AS elapsed_time,TIMESTAMPDIFF(MINUTE,time_accepted,NOW()) AS accepted_time_passed,note,cost_dicounted FROM orders where store_id > 0 and status < 2 ORDER BY id DESC',
		function(orders_res) {
			var orders = [];
			async.forEachOf(
				orders_res,
				function(order, i, callback) {
					sql.qry(
						'SELECT username, phone FROM users WHERE id=? LIMIT 1',
						[order.user_id],
						function(userData) {
							sql.qry(
								'SELECT display_name, passname FROM stores WHERE id=? LIMIT 1',
								[order.store_id],
								function(storeData) {

									if (userData.length) orders.push({
											username: userData[0].username,
											phone: userData[0].phone,
											data: order,
											store_display_name: storeData[0].display_name,
											store_passname: storeData[0].passname
										});
									else orders.push({ username: 'غير متاح', phone: '', data: order, store_display_name: storeData[0].display_name,
										store_passname: storeData[0].passname });

									callback(null);
							});
						}
					);
				},
				function(err) {
					if (err) throw err;
					res.render('all_orders', { orders });
				}
			);
		}
	);
}

app.get('/delete-order',function(req,res) {
	var id = req.param("id");
	sql.qry('DELETE FROM orders WHERE id=?', [id], function() {
		res.redirect('all_orders');
	});
});

module.exports = travers;
