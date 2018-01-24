const path = require('path');
// express configs
const express = require('express');
app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static(path.join(`${__dirname}/client`, 'views')));
app.set('views', path.join(`${__dirname}/client`, 'views'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// localStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}
// importing routes
const home = require('./routes/home');
const logout = require('./routes/logout');
const sales = require('./routes/sales');
const markets = require('./routes/markets');
const users = require('./routes/users');
const store_home = require('./routes/store_owner/home');
const store_orders = require('./routes/store_owner/orders');
const store_sales = require('./routes/store_owner/sales');
const store_users = require('./routes/store_owner/users');
const store_products = require('./routes/store_owner/products');
const store_offers = require('./routes/store_owner/offers');
const store_compose = require('./routes/store_owner/compose');
const store_email = require('./routes/store_owner/email');

// routes
app.get('/', checkAuth, home);
app.get('/logout', checkAuth, logout);
app.get('/sales', checkAuth, sales);
app.get('/markets', checkAuth, markets);
app.get('/users', checkAuth, users);
app.get('/store_owner', checkAuth, store_home);
app.get('/store_orders', checkAuth, store_orders);
app.get('/store_sales', checkAuth, store_sales);
app.get('/store_users', checkAuth, store_users);
app.get('/store_products', checkAuth, store_products);
app.get('/store_offers', checkAuth, store_offers);
app.get('/store_compose', checkAuth, store_compose);
app.get('/store_email', checkAuth, store_email);

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

// MySQL database
/*var mysql = require('mysql');

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"tazawaq",
});*/

// API
// require('./routes/api/signin');
// require('./routes/api/signup');
// require('./routes/api/verifycode');
// require('./routes/api/user_location');
// require('./routes/api/requestnewpass');
// require('./routes/api/setnewpass');
