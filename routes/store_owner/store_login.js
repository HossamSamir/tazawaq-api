var crypto = require('crypto');

function travers(req, res) {
	// var store_id = req.params.store_id;
	// console.log(store_id);
	res.render('store_owner/store_login');
}

app.post('/store-login', function(req, res) {
	var password = req.param("password");
	var passname = req.param("passname");
	var hash = crypto.createHash('md5').update(password).digest("hex");
	sql.qry('SELECT id FROM stores WHERE passname=? AND password=? LIMIT 1', [passname, hash], function(store) {
		if(!store.length) return res.send("هذا المحل التجاري غير متواجد او كلمة مرور غير صحيحة");

		var store_id = store[0].id;
		req.session.put('store_id', String(store_id));
		res.redirect('store/' + store_id);
	});
});

module.exports = travers;
