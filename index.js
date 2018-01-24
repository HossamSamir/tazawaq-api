const express = require('express');
app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const login = require('./routes/login');
const index = require('./routes/index');
const logout = require('./routes/logout');

app.set('view engine', 'ejs');
app.use(express.static(path.join(`${__dirname}/client`, 'views')));
app.set('views', path.join(`${__dirname}/client`, 'views'));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.use('/login', login);
app.use('/logout', logout);
app.use('/', index);

// MySQL database
/*var mysql = require('mysql');

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"tazawaq",
});*/

// API
require('./routes/api/signin');
require('./routes/api/signup');
require('./routes/api/verifycode');
require('./routes/api/user_location');
require('./routes/api/requestnewpass');
require('./routes/api/setnewpass');
