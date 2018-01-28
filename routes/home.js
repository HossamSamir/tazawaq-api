function travers(req, res) {
	sql.qry('SELECT COUNT(id) AS cnt FROM users', function(usersCount) {
		sql.qry('SELECT COUNT(id) AS cnt FROM stores', function(storesCount) {
			sql.qry('SELECT COUNT(id) AS cnt FROM sales', function(salesCount) {
				sql.qry('SELECT SUM(cost) AS totalCost FROM sales', function(salesCst) {
					sql.qry('SELECT cost,date,store_id,info FROM sales ORDER BY id DESC LIMIT 5', function(sales_res) {
						var sales = [];
						async.forEachOf(sales_res, function (sale, i, callback) {
							sql.qry('SELECT display_name FROM stores WHERE id=? LIMIT 1', [ sale.store_id ], function(storeName) {
								sales.push( { name: storeName[0].display_name, data: sale } );
								callback(null);
							});
						}, function(err) {
							if(err) throw err;
						    sql.qry('SELECT display_name,passname,region FROM stores ORDER BY id DESC LIMIT 4', function(stores) {
									res.render('index', { usersCt: usersCount[0].cnt,
										storesCt: storesCount[0].cnt,
										salesCt: salesCount[0].cnt,
										salesCost: salesCst[0].totalCost,
										sales, stores
								 	});
								});
						});
					});
				});
			});
		});
	});
}

module.exports = travers;
