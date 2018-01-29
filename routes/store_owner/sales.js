function travers(req, res) {
	var store_id = req.params.store_id;
	sql.qry('SELECT cost,date,info,location FROM sales WHERE store_id=? ORDER BY id DESC', [store_id], function(sales) {
		res.render('store_owner/sales', { sales, store_id });
	});
}

module.exports = travers;
