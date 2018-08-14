function travers(req, res) {
	res.render('background');
}


app.get('/background_action',function(req,res){
	var image = req.files.image
	var img_path = `client/views/assets/static/images/uploaded_images/offers_images/offer.jpg`;
	image.mv(img_path, function(err) {
		if (err) return res.status(500).send(err);

		sql.qry(
			"UPDATE meta_data SET value=? WHERE name='background'",
			[
				`${domain}/${img_path.replace('client/views/', '')}`
			],
			function(stores) {
				res.redirect('/background');
			}
		);
})
});
module.exports = travers;
