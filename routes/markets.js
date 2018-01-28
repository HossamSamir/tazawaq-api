function travers(req, res) {
	sql.qry('SELECT id,display_name,passname,region FROM stores ORDER BY id DESC', function(stores) {
		res.render('markets', { stores });
	});
}

app.get('/delete-store',function(req,res) {
	var id = req.param("id");
	sql.qry('DELETE FROM stores WHERE id=?', [id], function(stores) {
		res.redirect('markets');
	});
});

app.post('/edit-store',function(req,res) {
	var name = req.param("newName");
	var image = req.files.newImage || null;
	var id = req.param("id");

	if(image !== null && name !== '')
	{
		var img_path = 'uploaded_images/store_images/store_'+id+'.jpg';
		image.mv(img_path, function(err) {
	    	if (err) return res.status(500).send(err);

			sql.qry('UPDATE stores SET img=?,display_name=? WHERE id=?', [(domain + "/" + img_path), name, id], function(stores) {
				res.redirect('markets');
			});
		});
	}
	else
	{
		if(image === null)
		{
			sql.qry('UPDATE stores SET display_name=? WHERE id=?', [name, id], function(stores) {
				res.redirect('markets');
			});
		}
		else
		{
			var img_path = 'uploaded_images/store_images/store_'+id+'.jpg';
			image.mv(img_path, function(err) {
		    	if (err) return res.status(500).send(err);

				sql.qry('UPDATE stores SET img=? WHERE id=?', [(domain + "/" + img_path), id], function(stores) {
					res.redirect('markets');
				});
			});
		}
	}
});

module.exports = travers;
