function qry(query, callback, arr = []) {
	con.query(query, arr, function(err, result) {
		if (err) res.json(err);
		else callback(result);
	});
}

var store_ID = 1;

function travers(req, res) {
	qry(
		'SELECT name, id FROM categories WHERE store_id = ?',
		function(cats) {
			res.render('store_owner/products', { cats });
			console.log(cats);
		},
		[store_ID]
	);
}

app.get('/delete-cat', (req, res) => {
	let id = req.param('id');
	qry(
		'DELETE FROM categories WHERE id = ?',
		function(cats) {
			res.redirect('/store_products');
		},
		[id]
	);
});

app.get('/edit-cat', (req, res) => {
	let id = req.param('id');
	let name = req.param('name');
	qry(
		'UPDATE categories SET name = ? WHERE id = ?',
		function(cats) {
			res.redirect('/store_products');
		},
		[name, id]
	);
});

// function travers(req, res) {
// 	res.render('store_owner/products');
// }

module.exports = travers;
