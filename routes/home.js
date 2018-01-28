function qry(query, callback) {
	con.query(query, function(err, result) {
		if (err) res.json(err);
		else callback(result);
	});
}

function travers(req, res) {
	var country = 'SELECT';
	var c2 = 'saudi';
	qry('SELECT phone FROM users WHERE location="egypt"', function(usersCount) {
		// qry('SELECT COUNT(id) AS cnt FROM stores', function(storesCount) {
		// 	qry('SELECT COUNT(id) AS cnt FROM sales', function(salesCount) {
		// 		res.render('index', { usersCt: usersCount[0].cnt,
		// 			storesCt: storesCount[0].cnt, salesCt: salesCount[0].cnt });
		// 	});
		// });
		console.log(usersCount);
	});
}

module.exports = travers;
