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
// modules
const home = require('./routes/home');
const logout = require('./routes/logout');

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

app.get('/', checkAuth, home);
app.get('/logout', checkAuth, logout);

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
