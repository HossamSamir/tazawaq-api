app.get('/api/add-user-token',function(req,res){
    var user_id = req.param("user_id");
    var token = req.param("token");

    con.query('SELECT id FROM user_push_tokens WHERE  token=? LIMIT 1',
    [ token], function(err,tokens) {
        if(err) return res.json({response: 0, err});

        if(tokens.length) return res.json({ response: 1 });

        con.query('INSERT INTO user_push_tokens(user_id,token) VALUES(?,?)',
        [user_id, token], function(insert) {
            if(err) return res.json({response: 0, err});

            res.json({ response: 1 });
        });
    });
});
