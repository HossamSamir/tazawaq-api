app.get('/api/verifycode',function(req,res){
    var code = req.param("code");
    var identifier = req.param("identifier");
    var process = req.param("process");

    con.query('SELECT id,phone,password,location,latitude,longitude,region,country
        FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND code=? AND phone=? LIMIT 1',
        [code, identifier], function(err,codeData) {
        if(!err) {
            if(data.length)
            {
                if(process == 0) // signup request
                {
                    con.query('SELECT id from users WHERE phone=? LIMIT 1', [identifier], function(err,data) {
                        if(!err) {
                            if(data.length > 0)
                            {
                                res.json({
                                    response: 0
                                });
                            }
                            else
                            {
                                con.query('INSERT INTO users(phone,password,location,latitude,longitude,region,country) VALUES(?,?,?,?,?,?,?)',
                                [codeData[0]['phone'],codeData[0]['password'],codeData[0]['location'],codeData[0]['latitude'],codeData[0]['longitude'],
                                    codeData[0]['region'],codeData[0]['country']], function(err,data) {
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
