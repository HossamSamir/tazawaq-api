var _ID;
function travers(req, res) {
	var store_id = req.params.store_id;
	_ID = store_id;
	sql.qry(
		'SELECT name, id FROM categories WHERE store_id = ?',
		[store_id],
		function(cats) {
			res.render('store_owner/products', { cats, store_id });
		}
	);
}

app.get('/add-cat', (req, res) => {
	let catName = req.param('name');
	sql.qry(
		'INSERT INTO categories (store_id, name) VALUES (?, ?)',
		[_ID, catName],
		function(cats) {
			res.redirect(`/store_products/${_ID}`);
		}
	);
});

app.get('/delete-cat', (req, res) => {
	let id = req.param('id');
	sql.qry('DELETE FROM categories WHERE id = ?', [id], function(cats) {
		sql.qry('DELETE FROM products WHERE category_id = ?', [id], function(cats) {
			res.redirect(`/store_products/${_ID}`);
		});
	});
});

app.get('/edit-cat', (req, res) => {
	let id = req.param('id');
	let name = req.param('name');
	sql.qry('UPDATE categories SET name = ? WHERE id = ?', [name, id], function(
		cats
	) {
		res.redirect(`/store_products/${_ID}`);
	});
});

// function travers(req, res) {
// 	res.render('store_owner/products');
// }

module.exports = travers;
