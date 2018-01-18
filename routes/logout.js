var express = require('express');
var router = express.Router();
if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

router.get('/', function(req, res, next) {
	localStorage.setItem('loggedIn', 'false');
	res.render('login', { title: 'Express' });
});

module.exports = router;
