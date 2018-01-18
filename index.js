const express = require('express');
const app = express();
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
