async = require('async');
const path = require('path');

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
domain = 'http://localhost:3000';

// localStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

// MySQL database
var mysql = require('mysql');

con = mysql.createConnection({
	host: 'fugfonv8odxxolj8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	user: 'yv7zhu2a0knkxik6',
	password: 'ke9vo85qqgvps1n6',
	database: 't8chpprig1nsyy5t'
});

con.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('mysql connected as id ' + con.threadId);
});

sql = require('./sql/common');

// importing routes
const home = require('./routes/home');
const logout = require('./routes/logout');
const sales = require('./routes/sales');
const markets = require('./routes/markets');
const users = require('./routes/users');
const tickets = require('./routes/tickets');
const notifications = require('./routes/notifications');
const store_home = require('./routes/store_owner/home');
const store_orders = require('./routes/store_owner/orders');
const store_sales = require('./routes/store_owner/sales');
const store_products = require('./routes/store_owner/products');
const offers = require('./routes/offers');
const store_login = require('./routes/store_owner/store_login');

// routes
app.get('/', checkAuth, home);
app.get('/logout', checkAuth, logout);
app.get('/sales', checkAuth, sales);
app.get('/markets', checkAuth, markets);
app.get('/users', checkAuth, users);
app.get('/tickets', checkAuth, tickets);
app.get('/notifications', checkAuth, notifications);
app.get('/store/:store_id', checkAuth, store_home);
app.get('/store_orders/:store_id', checkAuth, store_orders);
app.get('/store_sales/:store_id', checkAuth, store_sales);
app.get('/store_products/:store_id', checkAuth, store_products);
app.get('/store_login/', checkAuth, store_login);
app.get('/offers', checkAuth, offers);

// checking authentication session
function checkAuth(req, res, next) {
	if (localStorage.getItem('loggedIn') == 'true') {
		next();
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
}

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
require('./routes/api/product_info');
require('./routes/api/store_info');
require('./routes/api/rating');
