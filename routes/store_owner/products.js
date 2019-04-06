const fs = require('fs');
var _ID;
function travers(req, res) {
	var store_id = req.params.store_id;
	var last_product_id = req.query.last_product_id;
	var search = req.query.search;
	if(typeof search !== 'undefined'){
		query = `SELECT id, category_id, name, info, cost, status, img FROM products WHERE store_id = ? and  parent_id = 0 and name LIKE '%${search}%' ORDER BY name limit 10`
	}
	else {
		query="SELECT id, category_id, name, info, cost, status, img FROM products WHERE store_id = ? and id > ? and parent_id = 0 ORDER BY name limit 10";
	}
console.log(search);
	_ID = store_id;
	sql.qry(
		'SELECT name, id, status FROM categories WHERE store_id = ?',
		[store_id],
		function(cats) {
			sql.qry(
				query,
				[store_id,last_product_id],
				function(products) {
					products.forEach((product, i) => {
						product.status = product.status == 0 ? 'غير نشط' : 'نشط';
						sql.qry('SELECT id, category_id, name, info, cost, status, img, parent_id FROM products WHERE  parent_id = ?',[product.id],function(sub_products,err){
							product.sub_products = sub_products;

							for (var ii = 0; ii < cats.length; ii++) {

								if (product.category_id == cats[ii].id) {
									product.category_name = cats[ii].name;
									break;
								}
							}
							console.log('i'+i+'length'+products.length)
							if(products.length == i+1){
								res.render('store_owner/products', { cats, products, store_id });

							}
						});


					});
				}
			);
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
	let status = req.param('status');
	sql.qry('UPDATE categories SET name = ?, status = ? WHERE id = ?', [name, status, id], function(
		cats
	) {
		res.redirect(`/store_products/${_ID}`);
	});
});

app.get('/delete-product', (req, res) => {
	let id = req.param('id');
	sql.qry('DELETE FROM products WHERE id = ?', [id], function(cats) {
		fs.unlink(
			`client/views/assets/static/images/uploaded_images/store_images/products/product_${id}.jpg`
		);
		res.redirect(`/store_products/${_ID}`);
	});
});

app.post('/add-product', function(req, res) {
	var name = req.param('name');
	var image = req.files.image || null;
	var info = req.param('info');
	var status = req.param('status');
	var category_id = req.param('category_id');
	var price = req.param('price');

	if (!name || image === null || !info || !status || !category_id || !price) {
		res.send('هناك مدخلات ناقصة او لم تُكتب بشكل صحيح من فضلك راجعها');
	} else {
		sql.qry(
			'INSERT INTO products (store_id, category_id, name, info, cost, status, img) VALUES(?,?,?,?,?,?,"")',
			[_ID, category_id, name, info, price, status],
			function(response) {
				var img_path = `client/views/assets/static/images/uploaded_images/store_images/products/product_${
					response.insertId
				}.jpg`;
				image.mv(img_path, function(err) {
					if (err) return res.status(500).send(err);

					sql.qry(
						'UPDATE products SET img=? WHERE id=?',
						[
							`${domain}/${img_path.replace('client/views/', '')}`,
							response.insertId
						],
						function(stores) {
							for(let i = 1;i<7;i++){
								var category_price = req.param('category_'+i+'_price');
								var category_name = req.param('category_'+i+'_name');
								if(category_price != '' && category_name != ''){
									sql.qry('INSERT INTO products (store_id, category_id, name, info, cost, status, img,parent_id) VALUES(?,?,?,?,?,?,"",?)',[_ID,0, category_name, '0', category_price, 1,response.insertId],function(data1,err){
										console.log("data "+data1+"err"+err+"i "+i)
										if(i == 6){
											if(!err){
												res.redirect(`/store_products/${_ID}`);
											}
											else {
												res.json({data1,err})
											}
										}
									})
								}
								else {
									res.redirect(`/store_products/${_ID}`);
								}
							}
						}
					);
				});
			}
		);
	}
});

app.post('/edit-product', function(req, res) {
	var name = req.param('name');
	var category_id = req.param('category_id');
	var price = req.param('price');
	var info = req.param('info');
	var status = req.param('status');
	var image = req.files.image || null;
	var product_id = req.param('product_id');
	var sub = req.param('sub');
	var sub_num = req.param('sub_num')-1;
	// console.log(name, category_id, price, info, status, image);

	if (!name || !info || !status || !category_id || !price) {
		res.send('هناك مدخلات ناقصة او لم تُكتب بشكل صحيح من فضلك راجعها');
	} else {

		sql.qry(
			'UPDATE products SET name = ?, category_id = ?, cost = ?, info = ?, status = ? WHERE id = ?',
			[name, category_id, price, info, status, product_id],
			function(response) {
				if(sub == 'true'){
					console.log(sub_num);
					for(let i = sub_num;i >= 0;i--){
						console.log('aaa')

						console.log('i='+i);
						var sub_name = req.param('sub_name_'+i);
						var sub_cos = req.param('sub_cost_'+i);
						var sub_id = req.param('sub_id_'+i);
						sql.qry(
							'UPDATE products SET name = ?,  cost = ? WHERE id = ?',
							[sub_name, sub_cos, sub_id],
							function(response) {

							})
							if(i== 0){
								// var store_id = req.params.store_id;

								// console.log('store = '+_ID);

								res.redirect(`/store_products/${_ID}?last_product_id=0`);
							}

		 			}
				}
				if (image != null) {
					var img_path = `client/views/assets/static/images/uploaded_images/store_images/products/product_${product_id}.jpg`;
					image.mv(img_path, function(err) {
						if (err) return res.status(500).send(err);

						sql.qry(
							'UPDATE products SET img=? WHERE id=?',
							[
								`${domain}/${img_path.replace('client/views/', '')}`,
								product_id
							],
							function(stores) {
								res.redirect(`/store_products/${_ID}`);
							}
						);
					});
				} else {
					res.redirect(`/store_products/${_ID}?last_product_id=0`);
				}
			}
		);
	}
});

// function travers(req, res) {
// 	res.render('store_owner/products');
// }

module.exports = travers;
