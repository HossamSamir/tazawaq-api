app.get('/api/is-user-banned',function(req,res){
    var user_id = req.param("user_id");

    con.query('SELECT is_banned from users WHERE id=? LIMIT 1',
        [user_id], function(err,data) {
        if(!err) {
            if(data.length == 0)
            {
                res.json({
                    response: -1
                });
            }
            else
            {
                res.json({
                    response: data[0]['is_banned']
                });
            }
        }
        else
        {
            res.json(err);
        }
    });
});
