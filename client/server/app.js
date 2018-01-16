var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/public'));

// index page
app.get('/', function(req, res) {
    // res.send(true)
    res.render('./signin');
});

// about page
// app.get('/about', function(req, res) {
//     res.render('pages/about');
// });

app.listen(8080);
console.log('8080 is the magic port');
