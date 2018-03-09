function travers(req, res) {
	sql.qry('SELECT cost,date,store_id,info,location FROM sales ORDER BY id DESC', function(sales_res) {
		var sales = [];
		async.forEachOf(sales_res, function (sale, i, callback) {
			sql.qry('SELECT display_name FROM stores WHERE id=? LIMIT 1', [ sale.store_id ], function(storeName) {
				if(storeName.length) sales.push( { name: storeName[0].display_name, data: sale } );
				else sales.push( { name: 'غير متوفر الآن', data: sale } );
				callback(null);
			});
		}, function(err) {
			if(err) throw err;
			res.render('sales', { sales	});
		});
	});
}

module.exports = travers;
