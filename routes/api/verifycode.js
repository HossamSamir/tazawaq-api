app.get('/api/verifycode',function(req,res){
    var code = req.param("code");
    var identifier = req.param("identifier");
    var type = req.param("type");
    var process = req.param("process");

    con.query('SELECT id,phone,email,password,conftype,location,latitude,longitude,region,country
        FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND code=? AND (email=? OR phone=?) LIMIT 1',
        [email, phone], function(err,codeData) {
        if(!err) {
            if(data.length)
            {
                if(process == 0) // signup request
                {
                    con.query('SELECT id from users WHERE name=? LIMIT 1', [username], function(err,data) {
                        if(!err) {
                            if(data.length > 0)
                            {
                                res.json({
                                    response: 0
                                });
                            }
                            else
                            {
                                con.query('INSERT INTO users(phone,email,password,conftype,location,latitude,longitude,region,country) VALUES(?,?,?,?,?,?,?,?,?)',
                                [phone,email,hash,conftype,location,latitude,longitude,region,country], function(err,data) {
                                    if(!err) {
                                        con.query('SELECT LAST_INSERT_ID() AS user_id', function(err,data) {
                                            if(!err) {
                                                con.query('DELETE FROM awaiting_verification WHERE id=?', [codeData[0]['id']], function(err,data) {
                                                    if(!err) {
                                                        res.json({
                                                            response: 2,
                                                            id: String(data[0]['user_id'])
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
                                    else
                                    {
                                        res.json(err);
                                    }
                                })
                            }
                        }
                        else
                        {
                            res.json(err);
                        }
                    });
                }
                else { // reset password request
                    con.query('DELETE FROM awaiting_verification WHERE id=?', [codeData[0]['id']], function(err,data) {
                        if(!err) {
                            res.json({
                                response: 2
                            });
                        } else res.json(err);
                    });
                }
            }
            else
            {
                res.json({
                    response: 1
                });
            }
        }
        else res.json(err);
    });
});
