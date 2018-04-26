function travers(req, res) {
	sql.qry('SELECT id,username,location,region,phone,email,is_banned FROM users ORDER BY id DESC', function(users) {
		res.render('users', { users });
	});
}

app.get('/delete-user',function(req,res) {
	var id = req.param("id");
	sql.qry('DELETE FROM users WHERE id=?', [id], function() {
		res.redirect('users');
	});
});

app.get('/set-user-ban-state',function(req,res) {
	var id = req.param("id");
	var state = req.param("state");
	sql.qry('UPDATE users SET is_banned=? WHERE id=?', [state, id], function() {
		res.redirect('users');
	});
});

module.exports = travers;
