// For MealsScreen.js => Meals array

app.get('/api/user-by-id',function(req,res){
    var user_id = req.param("user_id");

    con.query('SELECT username  FROM users WHERE id=?',
         [user_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
                res.json({
                    response: data
                });
            }
        }
        else
        {
            res.json({ response: 0, err });
        }
    });
});
