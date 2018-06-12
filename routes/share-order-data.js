function removeDuplicates( arr, prop ) {
  var obj = {};
  for ( var i = 0, len = arr.length; i < len; i++ ){
    if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
  }
  var newArr = [];
  for ( var key in obj ) newArr.push(obj[key]);
  return newArr;
}
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
//search for id inside library logic function
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
app.get('/share-order-data',function(req,res){
  id = req.param('id');

  sql.qry("select * from orders where id = ?",[id],function(order,err){
    console.log('sss')

    ids = order[0].ids;
    var meals = [];
    var stored_ids = [];
    console.log(ids);
    var ids = ids.split(",");

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
                  img:data.image,
                  name: data.name,
                  desc:data.desc,
                  cost: data.price,
                  count:count(ids,ids[i])
                })
                stored_ids.push(ids[i]);
              }
            }
            else {
                res.json({ response:"here", err });
            }
            if(i == ids.length-1){
              //you data coud be here ----------------->
              meals = removeDuplicates(meals,'key');
              sql.qry('select * from users where id = ?',[order[0].user_id],function(user,err){
                res.render('share-order-data',{meal:meals,order:order[0],user:user[0]})
              })
              }
        });
      }
      else{
        if(i == ids.length-1){
          //you data coud be here ----------------->
          meals = removeDuplicates(meals,'key');
          sql.qry('select * from users where id = ?',[order[0].user_id],function(user,err){
            res.render('share-order-data',{meal:meals,order:order[0],user:user[0]})
          })
        }
        }
      }
    } // end of for loop whic is the player in the order (3ak never mind)
  })
})
