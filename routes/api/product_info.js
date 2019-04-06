// For SingleMeal.js => Meal

app.get('/api/product-info',function(req,res){
    var product_id = req.param("product_id");
    var data3 = [];
    con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
         'FROM products WHERE id=? and parent_id = 0 LIMIT 1', [product_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
              con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
                   'FROM products WHERE parent_id = ? ', [product_id], function(err,data2) {
                     if(data2.length > 0){
                       for(let i in data2){
                         data3.push(
                           {key: data2[i].key, name: data2[i].name,price: data2[i].price},
                         )
                         if(i == data2.length-1){
                           res.json({
                               response: data[0],
                               childs:data3,
                               check:data3
                           });
                         }
                       }
                     }
                     else {
                       res.json({
                           response: data[0],
                           childs:[],
                           check:[]
                       });
                     }


              });
            }
        }
        else {
            res.json({ response:0, err });
        }
    });
});
