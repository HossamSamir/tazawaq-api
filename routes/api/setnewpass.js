var crypto = require('crypto');

app.get('/api/setnewpass',function(req,res){
    var code = req.param("code");
    var phone = req.param("phone");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");

    con.query('SELECT id FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND code=? AND phone=? LIMIT 1',
        [code, phone], function(err,codeData) {
        if(!err) {
            if(codeData.length) {
                con.query('SELECT id FROM users WHERE phone=? LIMIT 1',
                    [phone], function(err,userData) {
                    if(!err) {
                        if(userData.length) {
                            con.query('UPDATE users SET password=? WHERE id=?', [hash, userData[0]['id']], function(err,data) {
                                if(!err) {
                                    res.json({
                                        response: 1,
                                        id: userData[0]['id']
                                    });
                                } else res.json({err});
                            });
                        }
                        else res.json({ response: 0 });
                    }
                    else res.json({err});
                });

                con.query('DELETE FROM awaiting_verification WHERE id=?', [codeData[0]['id']], function(err,data) {
                    if(!err) {

                    } else res.json({err});
                });
            }
            else res.json({ response: 0 });
        }
        else res.json({err});
    });
});
