// For SingleMeal.js => Meal

app.get('/api/meals-by-ids',function(req,res){
    var ids = req.param("ids");
    var ids = ids.split(",");
    var meals = [];
    for(let i in ids){
      con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
           'FROM products WHERE id=? LIMIT 1', [ids[i]], function(err,data) {

          if(!err) {
            var data = data[0];
            meals.push({data})

          }
          else {
              res.json({ response:0, err });
          }
          if(i == ids.length-1){
            console.log(meals)
            res.json({
                response: meals
            });
          }
      });

    }

});
