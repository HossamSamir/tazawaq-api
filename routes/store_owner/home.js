function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry('SELECT COUNT(id) AS cnt, SUM(cost) AS totalCost FROM sales WHERE store_id=?', [store_id], function(salesCount) {
		sql.qry('SELECT COUNT(id) AS cnt FROM products WHERE store_id=?', [store_id], function(productsCount) {
			sql.qry('SELECT cost,date,info FROM sales WHERE store_id=? ORDER BY id DESC LIMIT 5', [store_id],
				function(sales_res) {
				res.render('store_owner/home', {
					salesCt: salesCount[0].cnt,
					productsCt: productsCount[0].cnt,
					salesCost: salesCount[0].totalCost,
					store_id,
					sales: sales_res
				});
			});
		});
	});
}

module.exports = travers;
