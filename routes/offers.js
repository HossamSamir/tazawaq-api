const fs = require('fs');

function travers(req, res) {
	sql.qry(
		'SELECT id,store_id, name, info, cost_before, cost_after, status, img FROM offers',
		offers => {
			sql.qry('SELECT id, display_name from stores', stores => {
				offers.forEach(offer => {
					for (var i = 0; i < stores.length; i++) {
						if (offer.store_id == stores[i].id) {
							offer.store_name = stores[i].display_name;
							break;
						}
					}
				});
				res.render('offers', { offers, stores });
			});
		}
	);
}

app.post('/add-offer', function(req, res) {
	var name = req.param('name');
	var cost_after = req.param('cost_after');
	var cost_before = req.param('cost_before');
	var store_id = req.param('store_id');
	var info = req.param('info');
	var status = req.param('status');
	var image = req.files.image || null;
	if (
		!name ||
		image === null ||
		!info ||
		!status ||
		!cost_after ||
		!cost_before ||
		!store_id
	) {
		res.send('هناك مدخلات ناقصة او لم تُكتب بشكل صحيح من فضلك راجعها');
	} else {
		sql.qry(
			'INSERT INTO offers (name, cost_after, cost_before, info, status, store_id, img) VALUES(?,?,?,?,?,?,"")',
			[name, cost_after, cost_before, info, status, store_id, image],
			function(response) {
				var img_path = `client/views/assets/static/images/uploaded_images/offers_images/offer_${
					response.insertId
				}.jpg`;
				image.mv(img_path, function(err) {
					if (err) return res.status(500).send(err);

					sql.qry(
						'UPDATE offers SET img=? WHERE id=?',
						[
							`${domain}/${img_path.replace('client/views/', '')}`,
							response.insertId
						],
						function(stores) {
							res.redirect('/offers');
						}
					);
				});
			}
		);
	}
});

app.post('/edit-offer', function(req, res) {
	var name = req.param('name');
	var cost_after = req.param('cost_after');
	var cost_before = req.param('cost_before');
	var store_id = req.param('store_id');
	var offer_id = req.param('offer_id');
	var info = req.param('info');
	var status = req.param('status');
	var image = req.files.image || null;

	if (!name || !info || !status || !cost_after || !cost_before || !store_id) {
		res.send('هناك مدخلات ناقصة او لم تُكتب بشكل صحيح من فضلك راجعها');
	} else {
		sql.qry(
			'UPDATE offers SET name = ?, cost_after = ?, cost_before = ?, info = ?, status = ?, store_id = ? WHERE id = ?',
			[name, cost_after, cost_before, info, status, store_id, offer_id],
			function(response) {
				if (image != null) {
					var img_path = `client/views/assets/static/images/uploaded_images/offers_images/offer_${offer_id}.jpg`;
					image.mv(img_path, function(err) {
						if (err) return res.status(500).send(err);

						sql.qry(
							'UPDATE offers SET img=? WHERE id=?',
							[`${domain}/${img_path.replace('client/views/', '')}`, offer_id],
							function(stores) {
								res.redirect('/offers');
							}
						);
					});
				} else {
					res.redirect('/offers');
				}
			}
		);
	}
});

app.get('/delete-offer', (req, res) => {
	let id = req.param('id');
	sql.qry('DELETE FROM offers WHERE id = ?', [id], function(cats) {
		fs.unlink(
			`client/views/assets/static/images/uploaded_images/offers_images/offer_${id}.jpg`
		);
		res.redirect('/offers');
	});
});

module.exports = travers;
