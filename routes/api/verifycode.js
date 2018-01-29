app.get('/api/verifycode',function(req,res){
    var code = req.param("code");
    var identifier = req.param("identifier");
    var process = req.param("process");

    con.query('SELECT id,phone,email,username,password,location,latitude,longitude,region ' +
        'FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND code=? AND phone=? LIMIT 1',
        [code, identifier], function(err,codeData) {
        if(!err) {
            if(codeData.length)
            {
                con.query('SELECT id from users WHERE phone=? OR email=? OR username=? LIMIT 1', [identifier,codeData[0]['email'],codeData[0]['username']],
                function(err,data) {
                    if(!err) {
                        if(data.length > 0)
                        {
                            if(process == 0) { // signup request
                                res.json({
                                    response: 0  // already registered
                                });
                            }
                            else { // reset password request
                                res.json({
                                    response: 2
                                });
                            }
                        }
                        else
                        {
                            if(process == 0) { // signup request
                                con.query('INSERT INTO users(phone,email,username,password,location,latitude,longitude,region) VALUES(?,?,?,?,?,?,?,?)',
                                [codeData[0]['phone'],codeData[0]['email'],codeData[0]['username'],
                                codeData[0]['password'],codeData[0]['location'],codeData[0]['latitude'],codeData[0]['longitude'],
                                    codeData[0]['region']], function(err,data) {
                                    if(!err) {
                                        var user_id = data.insertId;
                                        con.query('DELETE FROM awaiting_verification WHERE id=?', [codeData[0]['id']], function(err,data) {
                                            if(!err) {
                                                res.json({
                                                    response: 2,
                                                    id: String(user_id)
                                                });
                                            } else res.json(err);
                                        });
                                    }
                                    else
                                    {
                                        res.json(err);
                                    }
                                })
                            }
                            else { // reset password request
                                res.json({
                                    response: 3  // not registered
                                });
                            }
                        }
                    }
                    else
                    {
                        res.json(err);
                    }
                });
            }
            else
            {
                res.json({
                    response: 1 // invalid code
                });
            }
        }
        else res.json(err);
    });
});
