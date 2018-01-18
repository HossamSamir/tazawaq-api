var express = require('express');
var router = express.Router();
if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

router.get('/', function(req, res, next) {
	if (localStorage.getItem('loggedIn') == 'true')
		res.render('index', { title: 'Express' });
	else res.render('login', { title: 'Express' });
});

module.exports = router;
