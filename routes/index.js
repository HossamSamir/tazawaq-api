var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
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
