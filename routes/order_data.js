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


// id = req.param('id');
// sql.qry("select * from orders where id = ?",[id],function(order,err){
//   ids = order[0].ids;
//
//   var meals = [];
//   var stored_ids = [];
//   console.log(ids);
//   var ids = ids.split(",");
//
//      for(let i in ids){
//     if(ids[i] != null || ids[i] != 'null'){
//       if(search(meals,ids[i]) == false){
//       con.query('SELECT id AS `key`, name, img AS image, cost AS price, info AS `desc` '+
//            'FROM products WHERE id=? LIMIT 1', [ids[i]], function(err,data) {
//           if(!err) {
//             var data = data[0];
//             if(data != null){
//               meals.push({
//                 key:data.key,
//                 name: data.name,
//                 desc:data.desc,
//                 count:count(ids,ids[i])
//               })
//               stored_ids.push(ids[i]);
//             }
//           }
//           else {
//               res.json({ response:"here", err });
//           }
//           if(i == ids.length-1){
//             //you data coud be here ----------------->
//             meals = removeDuplicates(meals,'key');
//             console.log(meals,res)
//             render(meals);
//           }
//       });
//     }
//     else{
//       if(i == ids.length-1){
//         //you data coud be here ----------------->
//         meals = removeDuplicates(meals,'key');
//         render(meals,res);
//         console.log(meals)
//       }
//       }
//     }
//   } // end of for loop whic is the player in the order (3ak never mind)
// })





function render(meals,res){
res.json(meals);
}


app.get('/order_data/:id',function(req,res){
  id = req.param('id');
  sql.qry("select * from orders where id = ?",[id],function(order,err){
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
              sql.qry('select * from products where store_id = ?',[order[0].store_id],function(products,err){
                res.render('order_data',{meal:meals,products})
              })
            }
        });
      }
      else{
        if(i == ids.length-1){
          //you data coud be here ----------------->
          meals = removeDuplicates(meals,'key');
          sql.qry('select * from products where store_id = ?',[order[0].store_id],function(products,err){
            res.render('order_data',{meal:meals,products,id})
          })

          console.log(meals)
        }
        }
      }
    } // end of for loop whic is the player in the order (3ak never mind)
  })
})

app.get('/delete-order-product',function(req,res){
  var order_id = req.param('order_id');
  var product_id = req.param('product_id');
  var current_product_count = req.param('current_product_count');
  var new_product_count = req.param('new_product_count');
  sql.qry('select * from orders where id = ? ',[order_id],function(order,err){
  if(!err){
    var past_ids = order[0].ids;
    var new_ids = past_ids;

    //ids filtering ---->
    if(new_product_count == 0){
      var new_ids = past_ids.split(','+product_id).join("");
    }
    else {
      for(let i=(current_product_count-new_product_count);i>0;i--){
        new_ids = new_ids.replace(','+product_id,'');
      }
    }
    //info filtering ----->
    past_info = order[0].info;
    var past_price = order[0].cost;
    sql.qry('select * from products where id = ?',[product_id],(product,err)=>{

      var cost_dicounted = order[0].cost_dicounted;

      //info edit
      if(new_product_count == 0){
        var new_info = past_info.replace('- عدد'+current_product_count+' '+product[0].name,'')
        console.log(new_info);

      }
      else{
        var middle_info = past_info.replace('- عدد'+current_product_count+' '+product[0].name,'')
        var new_info = middle_info+'- عدد'+new_product_count+' '+product[0].name
      }



      //new price calculations ---->
        if(cost_dicounted == '0.00'){
          var new_price = past_price-(product[0].cost*(current_product_count-new_product_count));
        }
        else{
          var new_price = past_price-(product[0].cost*(current_product_count-new_product_count));
          var dicounted_percent = cost_dicounted/(past_price-order[0].delivery_cost);
          var cost_dicounted = (dicounted_percent*(new_price-order[0].delivery_cost));
        }

        sql.qry('update orders set cost = ? , cost_dicounted = ? , info = ? ,ids = ? where id = ?',[new_price,cost_dicounted,new_info,new_ids,order_id],function(final,err){
          if(!err){
            res.redirect('/order_data/'+order_id);
          }
          else{
            res.send(err);
          }
        })
    })


    //The end
  }
  else {
    res.send(err);
  }

  })
})

app.get('/order_add_product',function(req,res){
  order_id = req.param('order_id');
  product_id = req.param('product_id');
  count = req.param('count');
  sql.qry('select * from products where id = ?',[product_id],function(product,err){
    sql.qry('select * from orders where id = ?',[order_id],function(order,err){
      name = '- عدد'+count+' '+product[0].name;
      new_info = order[0].info+name;
      new_ids = order[0].ids+","+product_id;
      var past_price = order[0].cost;
      var cost_dicounted = order[0].cost_dicounted;
      if(cost_dicounted == '0.00'){
        var new_price = past_price+(product[0].cost*(count));
      }
      else{
        var new_price = past_price+(product[0].cost*(count));
        var dicounted_percent = cost_dicounted/(past_price-order[0].delivery_cost);
        var cost_dicounted = (dicounted_percent*(new_price-order[0].delivery_cost));
      }

      for(let i = count;i>0;i--){
        new_ids = new_ids+","+product_id;
        if(i == 1){
          console.log('new price : '+new_price+'cost discounted:'+cost_dicounted);
          sql.qry("update orders set info = ? ,ids = ?,cost = ?,cost_dicounted= ? where id= "+order_id,[new_info,new_ids,new_price,cost_dicounted],function(data,err2){
            if(!err2){
              res.redirect('/order_data/'+order_id)
            }
            else{
              res.json({err2});
            }
          })
        }
      }
    })
  })
})
