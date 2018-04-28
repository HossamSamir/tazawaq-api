async = require('async');
const path = require('path');
const config = require('./config');
// express configs
const express = require('express');
app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static(path.join(`${__dirname}/client`, 'views')));
app.set('views', path.join(`${__dirname}/client`, 'views'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// File upload (for images)
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Domain name (we prepend this to uploaded images)
domain = 'http://138.197.98.186:3000';

// Actually connect
con.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('mysql connected as id ' + con.threadId);
});

// Have some SQL commons
sql = require('./sql/common');

// node-session used for authentication
var NodeSession = require('node-session');

// Init
nodeSession = new NodeSession({
	secret: 'Z3UBzdH9GRsoRCTKbi5MTPyChpzXLsTA',
	lifetime: Infinity
});

// App use
function session(req, res, next) {
	nodeSession.startSession(req, res, next);
}
app.use(session);

// Check if this session is of an app owner
function isAppOwner(req, res, next) {
	if (req.session.has('app_owner')) {
		next();
	} else {
		var username = req.query.username;
		var password = req.query.password;
		if (
			typeof username != 'undefined' &&
			username == 'super_admin' &&
			password == 'h5?bxt!7qF*?8OZ9'
		) {
			req.session.put('app_owner', 'true');
			res.redirect('/');
		} else {
			res.render('login', {});
		}
	}
}

// Check if this session is of a store owner
function isStoreOwner(req, res, next) {
	var store_id = req.params.store_id;
	if (
		req.session.has('app_owner') ||
		req.session.get('store_id') == String(store_id)
	) {
		next();
	} else {
		res.render('store_owner/store_login', {});
	}
}

// importing routes
const home = require('./routes/home');
const logout = require('./routes/logout');
const sales = require('./routes/sales');
const all_orders = require('./routes/all_orders');
const markets = require('./routes/markets');
const users = require('./routes/users');
const tickets = require('./routes/tickets');
const offers = require('./routes/offers');
const store_home = require('./routes/store_owner/home');
const store_orders = require('./routes/store_owner/orders');
const store_sales = require('./routes/store_owner/sales');
const store_products = require('./routes/store_owner/products');
const store_login = require('./routes/store_owner/store_login');

// routes
app.get('/', isAppOwner, home);
app.get('/logout', isAppOwner, logout);
app.get('/sales', isAppOwner, sales);
app.get('/all_orders', isAppOwner, all_orders);
app.get('/markets', isAppOwner, markets);
app.get('/users', isAppOwner, users);
app.get('/tickets', isAppOwner, tickets);
app.get('/offers', isAppOwner, offers);
app.get('/store/:store_id?', isStoreOwner, store_home);
app.get('/store_orders/:store_id', isStoreOwner, store_orders);
app.get('/store_sales/:store_id', isStoreOwner, store_sales);
app.get('/store_products/:store_id', isStoreOwner, store_products);
app.get('/store_login/', isStoreOwner, store_login);

// API
require('./routes/api/signin');
require('./routes/api/signup');
require('./routes/api/verifycode');
require('./routes/api/user_location');
require('./routes/api/requestnewpass');
require('./routes/api/setnewpass');
require('./routes/api/tickets');
require('./routes/api/store_orders');
require('./routes/api/store_products');
require('./routes/api/store_categories');
require('./routes/api/product_info');
require('./routes/api/store_info');
require('./routes/api/rating');
require('./routes/api/orders');
require('./routes/api/offers');
require('./routes/api/store_push_tokens');
require('./routes/api/stores');
require('./routes/api/meals_by_ids');
require('./routes/api/user_by_id');
require('./routes/api/is_user_banned');
require('./routes/api/add_user_token');
