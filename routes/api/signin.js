var crypto = require('crypto');

app.get('/api/signin',function(req,res){
    var identifier = req.param("identifier");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var lookFor = (emailRegex.test(identifier)) ? "email" : "phone";

    con.query('SELECT id from users WHERE ' + lookFor + '=? AND password=? LIMIT 1', [identifier, hash], function(err,data) {
    if(!err) {
        if(data.length == 0)
        {
            res.json({
                response: 0
            });
        }
        else
        {
            res.json({
                response: String(data[0]['id'])
            });
        }
    }
    else
    {
        res.json(err);
    }
});
});
