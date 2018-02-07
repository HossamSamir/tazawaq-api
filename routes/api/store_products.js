// For MealsScreen.js => Meals array

app.get('/api/store-products',function(req,res){
    var store_id = req.param("store_id");

    con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
         'FROM products WHERE store_id=? AND status=1 ORDER BY id DESC', [store_id], function(err,data) {
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
