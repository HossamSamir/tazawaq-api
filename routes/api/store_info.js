// For MealsScreen.js => Restaurant

app.get('/api/store-info',function(req,res){
    var store_id = req.param("store_id");

    con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
        'delivery_cost AS deliver_price, delivery_time AS time '+
         'FROM stores WHERE id=? LIMIT 1', [store_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
                con.query(`SELECT AVG(rating) AS stars FROM ratings WHERE store_id=?`, [store_id], function(err,stars) {
                    if(!err) {
                        if(stars.length) {
                            res.json({
                                response: {...data[0], stars: stars[0].stars}
                            });
                        }
                        else {
                            res.json({
                                response: {...data[0], stars: -1}
                                // stars = -1 means this has not been rated before
                            });
                        }
                    }
                    else
                    {
                        res.json({ response:0, err });
                    }
                });
            }
        }
        else
        {
            res.json({ response:0, err });
        }
    });
});
