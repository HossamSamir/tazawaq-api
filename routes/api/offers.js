// Fetch offers which this user should see
app.get('/api/offers-for-me', function(req, res) {
	var user_id = req.param('user_id');

	con.query(
		'SELECT id,store_id,name,info,cost_before,cost_after,img ' +
			'FROM offers WHERE status=1 ORDER BY id DESC LIMIT 1',
		function(err, data) {
			if (!err) {
				if (data.length == 0) return res.json({ response: 0 });
				else {
					// no offers to show
					// Fetched latest offer, but gotta check if this user has already seen it
					var offer_id = data[0].id;
					con.query(
						'SELECT id FROM seen_offers WHERE offer_id=? AND user_id=? LIMIT 1',
						[offer_id, user_id],
						function(err, seen) {
							if (!err) {
								if (seen.length) return res.json({ response: 0 });
								else {
									// Seen
									// Hasn't seen yet, record that they see it now
									con.query(
										'INSERT INTO seen_offers(offer_id,user_id) VALUES(?,?)',
										[offer_id, user_id],
										function(err, insert) {
											if (err) return res.json({ response: 0 });

											res.json({
												response: data[0]
											});
										}
									);
								}
							} else {
								res.json({ response: 0, err });
							}
						}
					);
				}
			} else {
				res.json({ response: 0, err });
			}
		}
	);
});

// Fetch all available offers (for Offers screen maybe)
app.get('/api/all-offers', function(req, res) {
	con.query(
		'SELECT id,store_id,name,info,cost_before,cost_after,img ' +
			'FROM offers WHERE status=1 ORDER BY id DESC',
		function(err, data) {
			if (!err) {
				if (data.length == 0) return res.json({ response: 0 });
				else {
					res.json({
						response: data
					});
				}
			} else {
				res.json({ response: 0, err });
			}
		}
	);
});

// fecth single offer details
app.get('/api/offer', function(req, res) {
	var offer_id = req.param('offer_id');
	con.query(
		'SELECT id,store_id,name,info,cost_before,cost_after,img ' +
			'FROM offers WHERE status=1 AND id = ? ORDER BY id DESC',
		[offer_id],
		function(err, data) {
			if (!err) {
				if (data.length == 0) return res.json({ response: 0 });
				else {
					res.json({
						response: data
					});
				}
			} else {
				res.json({ response: 0, err });
			}
		}
	);
});
