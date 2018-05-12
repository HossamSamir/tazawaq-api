function travers(req, res) {
	sql.qry(
		'SELECT id,cost,delivery_cost,info,location,user_id,status,store_id,TIMESTAMPDIFF(MINUTE,time_ordered,NOW()) AS elapsed_time,TIMESTAMPDIFF(MINUTE,time_accepted,NOW()) AS accepted_time_passed,note FROM orders where status=2 ORDER BY id DESC',
		function(orders_res) {
			var orders = [];
			async.forEachOf(
				orders_res,
				function(order, i, callback) {
					sql.qry(
						'SELECT username, phone FROM users WHERE id=? LIMIT 1',
						[order.user_id],
						function(userData) {
							if(order.store_id == -1){
								if (userData.length) orders.push({
										username: userData[0].username,
										phone: userData[0].phone,
										data: order,
										store_display_name: order.info.split('-')[0],
										store_passname: order.info.split('-')[0]
									});
								else orders.push({ username: 'غير متاح', phone: '', data: order, store_display_name: order.info.split('-')[0],
									store_passname: order.info.split('-')[0] });

								callback(null);
							}
							else{
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

						}
					);
				},
				function(err) {
					if (err) throw err;
					res.render('sales', { sales:orders });
				}
			);
		}
	);
	// sql.qry('SELECT cost,date,store_id,info,location FROM sales ORDER BY id DESC', function(sales_res) {
	// 	var sales = [];
	// 	async.forEachOf(sales_res, function (sale, i, callback) {
	// 		sql.qry('SELECT display_name FROM stores WHERE id=? LIMIT 1', [ sale.store_id ], function(storeName) {
	// 			if(storeName.length) sales.push( { name: storeName[0].display_name, data: sale } );
	// 			else sales.push( { name: 'غير متوفر الآن', data: sale } );
	// 			callback(null);
	// 		});
	// 	}, function(err) {
	// 		if(err) throw err;
	// 		res.render('sales', { sales	});
	// 	});
	// });
}

module.exports = travers;
