function travers(req, res) {
	sql.qry(
		'SELECT * FROM coupons',
		coupons => {
			sql.qry('SELECT id, display_name,img from stores', stores => {
				coupons.forEach(offer => {
					for (var i = 0; i < coupons.length; i++) {
						if (coupons.store_id == stores[i].id) {
							coupons.store_name = stores[i].display_name;
							break;
						}
					}
				});
				res.render('coupons', { offers:coupons, stores });
			});
		}
	);
}

app.get('/delete-coupon',function(req,res){
	var id = req.param('id');
	sql.qry('delete from coupons where id = ?',[id],function(data,err){
		if(!err){
			res.redirect('/coupons');
		}
		else {
			res.send({err})
		}
	})
})
app.get('/add-coupon',function(req,res){
	var code = req.param('code');
	var store_id = req.param('store_id');
	var percent = req.param('percent');
	var status = req.param('status');
	sql.qry('insert into coupons(code,store_id,percent,status) values(?,?,?,?)',[code,store_id,percent,status],function(data,err){
		if(!err){
			res.redirect('/coupons');
		}
		else {
			res.json({err});
		}
	})
})
app.get('/edit-coupon',function(req,res){
	var id = req.param('id');
	var code = req.param('code');
	var store_id = req.param('store_id');
	var percent = req.param('percent');
	var status = req.param('status');
	sql.qry('update coupons set code= ? , store_id = ? , percent = ? , status = ? where id = ? ',[code,store_id,percent,status,id],function(data,err){
		if(!err){
			res.redirect('/coupons');
		}
		else {
			res.json({err});
		}
	})
})


module.exports = travers;
