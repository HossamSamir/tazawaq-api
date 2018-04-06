// For SingleMeal.js => Meal
var count = (ids,id)=>{
  var num  = 0;
  for(let i in ids){
    if(ids[i] == id){
      num++
    }
    if(i == ids.length-1){
      return num;
    }
  }
}
function removeDuplicates( arr, prop ) {
  var obj = {};
  for ( var i = 0, len = arr.length; i < len; i++ ){
    if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
  }
  var newArr = [];
  for ( var key in obj ) newArr.push(obj[key]);
  return newArr;
}
var search = (ids,id) =>{
  var result  = false;
  if(ids.length != 0 ){
    for(let g in ids){
      if(ids[g].key == id){
        result = true;
      }
      if(i == ids.length-1){
        return result;
      }
    }
  }
  else{
    return result;
  }

}
app.get('/api/meals-by-ids',function(req,res){
  var stored_ids = [];
    var ids = req.param("ids");

    var ids = ids.split(",");
    var meals = [];
    for(let i in ids){
      if(ids[i] != null || ids[i] != 'null'){
        if(search(meals,ids[i]) == false){
        con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
             'FROM products WHERE id=? LIMIT 1', [ids[i]], function(err,data) {
            if(!err) {
              var data = data[0];
              if(data != null){
                meals.push({
                  key:data.key,
                  name: data.name,
                  desc:data.desc,
                  price:data.price,
                  count:count(ids,ids[i])
                })
                stored_ids.push(ids[i]);
              }
            }
            else {
                res.json({ response:0, err });
            }
            if(i == ids.length-1){
              //you data coud be here ----------------->
              res.json({
                   meals:removeDuplicates(meals,'key')
              });
            }
        });
      }
      else{
        if(i == ids.length-1){
          //you data coud be here ----------------->
          res.json({
               meals:removeDuplicates(meals,'key')
          });
        }
        }
      }
    }

});
