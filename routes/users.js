function travers(req, res) {
	sql.qry('SELECT id,username,location,region,phone,email FROM users ORDER BY id DESC', function(users) {
		res.render('users', { users });
	});
}

app.get('/delete-user',function(req,res) {
	var id = req.param("id");
	sql.qry('DELETE FROM users WHERE id=?', [id], function() {
		res.redirect('users');
	});
});

module.exports = travers;
