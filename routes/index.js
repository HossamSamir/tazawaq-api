var express = require('express');
var router = express.Router();
if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

router.get('/', function(req, res, next) {
	if (localStorage.getItem('loggedIn') == 'true') {
		res.render('index', { title: 'Express' });
	} else {
		var username = req.query.username;
		var password = req.query.password;
		if (
			typeof username != 'undefined' &&
			username.toUpperCase() == 'ADMIN' &&
			password.toUpperCase() == 'ADMIN'
		) {
			res.render('index', { title: 'Express' });
			localStorage.setItem('loggedIn', 'true');
		} else {
			res.render('login', {});
		}
	}
});

router.get('/sales', function(req, res, next) {
	res.render('sales', { title: 'Express' });
});

router.get('/markets', function(req, res, next) {
	res.render('markets', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
	res.render('users', { title: 'Express' });
});

module.exports = router;
