// MySQL database
var mysql = require('mysql');

// Config connection

con = mysql.createConnection({
		host: '66.45.240.101',
        user: 'admin',
        password: 'amr',
        database: 'talbatk'
});


/*
con = mysql.createConnection({
		host: 'localhost',
        user: 'root',
        password: '',
        database: 'talbatk'
});
*/
