const fs = require('fs');
const crypto = require('crypto');

function travers(req, res) {
	sql.qry(
		'SELECT status,id,display_name,passname,store_category_id,region,order_number FROM stores ORDER BY order_number',
		function(stores) {
			res.render('markets', { stores });
		}
	);
}

app.get('/open-stores',function(req,res){
	sql.qry('update stores set status = 1',function(data,err){
		res.redirect('/markets')
	})
})

app.get('/close-stores',function(req,res){
	sql.qry('update stores set status = 0',function(data,err){
		res.redirect('/markets')
	})
})

app.get('/delete-store', function(req, res) {
	var id = req.param('id');
	sql.qry('DELETE FROM stores WHERE id=?', [id], function() {
		fs.unlink(
			`client/views/assets/static/images/uploaded_images/store_images/store_${id}.jpg`,
			(err) => {
				if (err) {
					throw err;
				}
			}
		);

		res.redirect('markets');
		sql.qry('SELECT id FROM products WHERE store_id=?', [id], function(
			products
		) {
			if(!products.length) return res.redirect('markets');

			products.forEach(function(product) {
				fs.unlink(
					`client/views/assets/static/images/uploaded_images/store_images/products/product_${
						product.id
					}.jpg`,
					(err) => {
		  				if (err) {
							throw err;
						}
					}
				);
			});

			sql.qry('DELETE FROM products WHERE store_id=?', [id], function() {
				res.redirect('markets');
			});
		});
	});
});

app.post('/edit-store', function(req, res) {
	var name = req.param('newName');
	var password = req.param('newPassword');
	var image = req.files.newImage || null;
	var id = req.param('id');
	var region = req.param('region');
	var delivery_cost = req.param('delivery_cost');
	var min_delivery_cost = req.param('min_delivery_cost');
	var delivery_time = req.param('delivery_time');
	var status = req.param('status');
	var category = req.param('category');
	var order_number = req.param('order_number');

	var fields = [];

	if(name) fields.push({ name: 'display_name', value: name });
	if(password) fields.push({ name: 'password', value: crypto
		.createHash('md5')
		.update(password)
		.digest('hex') });
	if(region) fields.push({ name: 'region', value: region });
	if(delivery_cost) fields.push({ name: 'delivery_cost', value: delivery_cost });
	if(delivery_time) fields.push({ name: 'delivery_time', value: delivery_time });
	if(status) fields.push({ name: 'status', value: status });
	 if(category) fields.push({ name: 'store_category_id', value: category });
	 if(order_number) fields.push({ name: 'order_number', value: order_number });

	if(min_delivery_cost) fields.push({ name: 'min_delivery_cost', value: min_delivery_cost });
	if(image) fields.push({ name: 'img', value: 'client/views/assets/static/images/uploaded_images/store_images/store_' +
		id +
		'.jpg' });

	async.forEachOf(
		fields,
		function(field, i, callback) {
			if(field.name === 'img') {
				image.mv(field.value, function(err) {
					if (err) return res.status(500).send(err);
					var img_path =
						'client/views/assets/static/images/uploaded_images/store_images/store_' +
						id +
						'.jpg';
					var new_path = domain+'/'+img_path.replace('client/views/', '');
					sql.qry(
						'UPDATE stores SET img=? WHERE id=?',
						[new_path, id],
						function(stores) {
							callback(null)
						}
					);
				});
			} else {
				sql.qry(
					'UPDATE stores SET '+field.name+'=? WHERE id=?',
					[field.value, id],
					function(stores) {
						callback(null);
					}
				);
			}
		},
		function(err) {
			if (err) throw err;

			if(req.param('store_admin') == 1) res.redirect(`store/${id}`);
			else res.redirect('markets');
		}
	);
});

app.post('/add-store', function(req, res) {
	var display_name = req.param('name');
	var image = req.files.image || null;
	var password = req.param('password');
	var passname = req.param('passname');
	var region = req.param('region');
	var address = req.param('address');
	var lat = req.param('lat');
	var lng = req.param('lng');
	var delivery_cost = req.param('delivery_cost');
	var min_delivery_cost = req.param('min_delivery_cost');
	var delivery_time = req.param('delivery_time');
	var category = req.param('category')
	if (
		!display_name ||
		image === null ||
		!password ||
		!region ||
		!address ||
		!lat ||
		!lng ||
		!delivery_cost ||
		!min_delivery_cost ||
		!delivery_time
		||
		!category
	) {
		res.send('هناك مدخلات ناقصة او لم تُكتب بشكل صحيح من فضلك راجعها');
		return;
	}

	sql.qry('SELECT id FROM stores WHERE passname=?', [passname], function(
		result
	) {
		if (result.length) {
			res.send('اسم الدخول على لوحة التحكم مُستخدم من قبل');
		} else {
			var hash = crypto
				.createHash('md5')
				.update(password)
				.digest('hex');
			sql.qry(
				'INSERT INTO stores(display_name,min_delivery_cost,delivery_cost,delivery_time,passname,password,address,latitude,longitude,region,img,store_category_id) ' +
					'VALUES(?,?,?,?,?,?,?,?,?,?,"",?)',
				[
					display_name,
					min_delivery_cost,
					delivery_cost,
					delivery_time,
					passname.replace(/\s+/g, '_'),
					hash,
					address,
					lat,
					lng,
					region,
					category
				],
				function(insert) {
					var id = insert.insertId;
					var img_path =
						'client/views/assets/static/images/uploaded_images/store_images/store_' +
						id +
						'.jpg';
					image.mv(img_path, function(err) {
						if (err) return res.status(500).send(err);
						var img_path =
							'client/views/assets/static/images/uploaded_images/store_images/store_' +
							id +
							'.jpg';
						var new_path = `${domain}/${img_path.replace('client/views/', '')}`
						sql.qry(
							'UPDATE stores SET img=? WHERE id=?',
							[new_path, id],
							function(stores) {
								res.redirect('markets');
							}
						);
					});
				}
			);
		}
	});
});

module.exports = travers;
