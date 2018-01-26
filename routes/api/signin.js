var crypto = require('crypto');

app.get('/api/signin',function(req,res){
    var identifier = req.param("identifier");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");

    con.query('SELECT id from users WHERE (phone=? OR email=? OR username=?) AND password=? LIMIT 1', [identifier, identifier, identifier, hash], function(err,data) {
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
