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
					sql.qry("select * from meta_data where name = 'special_orders_status' ",function(status,err){
						res.render('special_orders', { orders,status:status[0].value });
					})
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


app.get('/special_orders_status_action',function(req,res){
	var status = req.param("status");
	sql.qry("update meta_data set value = ? where name = 'special_orders_status'",[status],function(data,err){
		if(!err){
			res.redirect('special_orders');
		}
		else{
			res.send(err);
		}
	})
})
module.exports = travers;
