// For Restaurant screen

app.get('/api/store-categories',function(req,res){
    var store_id = req.param("store_id");

    con.query('SELECT id AS `key`, name AS screenName FROM categories WHERE store_id=? ORDER BY id DESC',
    [store_id], function(err,data) {
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
