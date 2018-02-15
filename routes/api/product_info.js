// For SingleMeal.js => Meal

app.get('/api/product-info',function(req,res){
    var product_id = req.param("product_id");

    con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
         'FROM products WHERE id=? LIMIT 1', [product_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
                res.json({
                   
                    response: data[0]
                });
            }
        }
        else {
            res.json({ response:0, err });
        }
    });
});
