function travers(req, res) {
	sql.qry('SELECT COUNT(id) AS cnt FROM users', function(usersCount) {
		sql.qry('SELECT COUNT(id) AS cnt FROM stores', function(storesCount) {
			sql.qry('SELECT COUNT(id) AS cnt FROM sales', function(salesCount) {
				res.render('index', { usersCt: usersCount[0].cnt,
					storesCt: storesCount[0].cnt, salesCt: salesCount[0].cnt });
			});
		});
	});
}

module.exports = travers;
