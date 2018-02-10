// When user gives a number of stars to a store (as a rating)
app.get('/api/rating',function(req,res){
    var store_id = req.param("store_id");
    var user_id = req.param("user_id");
    var stars = req.param("stars");

    con.query('INSERT INTO ratings(user_id,store_id,rating) VALUES(?,?,?)',
    [user_id,store_id, stars], function(err,ratings) {
        if(err) return res.json({response: 0});

        res.json({ response: 1 });
    });
});
