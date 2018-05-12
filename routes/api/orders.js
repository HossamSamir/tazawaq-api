// we use that function to don't dopilcate orders in cart screen

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


app.get('/api/make-special-order',function(req,res){
  var user_id = req.param("user_id");
  var cost = req.param("cost");
  var note = req.param("note");
  var restaurant = req.param("restaurant");
  var info = restaurant+' - '+req.param("info");
  var address = req.param("address");
  con.query('INSERT INTO orders(store_id,user_id,cost,info,location,delivery_cost,time_ordered,note) VALUES(-1,?,?,?,?,0, NOW(),?)',  [user_id,cost,info,address,note],
    function(err,orders) {
      if(!err){
        res.json({response:1})
      }
      else {
        res.json({response:err})
      }
    });

})

app.get('/api/special_orders_status',function(req,res){
sql.qry("select * from meta_data where name = 'special_orders_status'",function(status,err){
  res.json({status:status[0].value});
})
})




app.get('/api/make-order',function(req,res){
    var store_id = req.param("store_id");
    var user_id = req.param("user_id");
    var cost = req.param("cost");
    var note = req.param("note");
    var info = req.param("info");
    var ids = req.param("ids");
    var ids = ids.split(",");
    var address = req.param("address");
    var address_hint = req.param("address_hint");
    var full_location = (!address_hint) ? (address) : (address + " - " + address_hint);
    var stored_ids = [];

    con.query('SELECT delivery_cost FROM stores WHERE id=? LIMIT 1', [store_id], function(err,storeDeliveryCost) {
        if(!err) {
            var dCost = storeDeliveryCost[0].delivery_cost;
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

                      for(let k in meals){
                        if(info){
                          var info = info + '-'+' عدد'+meals[k].count+''+ ' '+meals[k].name;
                        }
                        else{
                          var info =  '-'+' عدد'+meals[k].count+''+ ' '+meals[k].name;
                        }
                        if(k == meals.length-1){
                          //here it goes to play ---------->


                          con.query('INSERT INTO orders(store_id,user_id,cost,info,location,delivery_cost,time_ordered,note) VALUES(?,?,?,?,?,?, NOW(),?)',
                          [store_id,user_id,cost,info,full_location,dCost,note],
                          function(err,orders) {
                              if(err) return res.json({response: err});
                              //add products ---->

                              //end add products
                              con.query('SELECT token FROM expo_push_tokens WHERE store_id=? LIMIT 100',
                              [store_id], function(err,tokens) {
                                  if(tokens.length)
                                  {
                                      var pushTokensArr = [];
                                      tokens.forEach(function(tok) {
                                          pushTokensArr.push(tok.token);
                                      });
                                      SendPushNotifications(pushTokensArr);
                                  }
                              });

                              res.json({ response: 1 });
                          });




                          //end of game
                        }
                      }
                    }
                });
              }
              else{
                if(i == ids.length-1){
                  //you data coud be here ----------------->
                  meals = removeDuplicates(meals,'key');
                  for(let k in meals){
                    if(info){
                      var info = info + '-'+' عدد'+meals[k].count+' وجبه'+ ' '+meals[k].name;
                    }
                    else{
                      var info =  '-'+' عدد'+meals[k].count+' وجبه'+ ' '+meals[k].name;
                    }
                    if(k == meals.length-1){
                      //here it goes to play ---------->


                      con.query('INSERT INTO orders(store_id,user_id,cost,info,location,delivery_cost,time_ordered) VALUES(?,?,?,?,?,?, NOW())',
                      [store_id,user_id,cost,info,full_location,dCost],
                      function(err,orders) {
                          if(err) return res.json({response: err});
                          //add products ---->

                          //end add products
                          con.query('SELECT token FROM expo_push_tokens WHERE store_id=? LIMIT 100',
                          [store_id], function(err,tokens) {
                              if(tokens.length)
                              {
                                  var pushTokensArr = [];
                                  tokens.forEach(function(tok) {
                                      pushTokensArr.push(tok.token);
                                  });
                                  SendPushNotifications(pushTokensArr);
                              }
                          });


                        res.json({ response: 1 });
                      });




                      //end of game
                    }
                  }

                }
                }
              }
            }
        }
        else res.json({ response:0, err });
    })











    app.get('/api/order-time',function(req,res){
      var order_id = req.param("id");
      var dateFormat = require('dateformat');
    var now = new Date();
    var timediff = require('timediff');

    var time_now = dateFormat(now, "isoDateTime");
      con.query('SELECT store_id,time_accepted '+
           'FROM orders WHERE id=? LIMIT 1', [order_id], function(err,order) {
             var time_passed = timediff(order[0]['time_accepted'], time_now, 'YDHms');
             con.query('SELECT delivery_time '+
                  'FROM stores WHERE id=? LIMIT 1', [order[0]['store_id']], function(err,restaurant) {
                    deliver_time =

                     time_left = Number(restaurant[0]['delivery_time']) - Number(time_passed.minutes);
                    res.json({time:time_left});
                  });

           });
    })











});
//show current orders api
app.get('/api/show-orders-current',function(req,res){
    var user_id = req.param("user_id");
    var dateFormat = require('dateformat');
  var now = new Date();
  var timediff = require('timediff');
  var time_now = dateFormat(now, "isoDateTime");

    con.query('SELECT id AS `key`,  info AS title, cost AS price,time_accepted, status,store_id '+
         'FROM orders WHERE user_id=? and status < 2 ', [user_id], function(err,data) {
        if(!err) {
            if(data.length == 0) return res.json({ response: 0 });
            else
            {
              con.query('SELECT delivery_time AS `deliveryTime` '+
                   'FROM stores WHERE id=?  ', [data[0].store_id], function(err,deliveryTime) {
                     var new_data = [];
                  for(let i in data){
                    var timediff = require('timediff');

                    if(data[i].status == 1){
                      console.log(data[i])
                      var time_now = dateFormat(now, "isoDateTime");
                      var time_accepted = dateFormat(data[i].time_accepted,"isoDateTime");
                       var time_passed = timediff(time_accepted, time_now, 'YDHms');
                      console.log('time now :'+time_now +'time accepted : '+time_accepted);
                      time_left = Number(deliveryTime[0].deliveryTime) - Number(time_passed.minutes);
                      new_data.push({
                        key:data[i].key,
                        title:data[i].title,
                        price:data[i].price,
                        status:data[i].status,
                        store_id:data[i].store_id,
                        time:time_left
                      })
                    }
                    else{
                      new_data.push({
                        key:data[i].key,
                        title:data[i].title,
                        price:data[i].price,
                        status:data[i].status,
                        store_id:data[i].store_id,

                      })
                    }
                    if(i == data.length-1){
                      res.json({
                        deliveryTime: deliveryTime[0].deliveryTime,
                          response: new_data
                      });
                    }
                  }

              });
            }
        }
        else {
            res.json({ response:0, err });
        }
    });
});

app.get('/api/show-orders-past',function(req,res){
  var user_id = req.param("user_id");

  con.query('SELECT id AS `key`,  info AS title, cost AS price, status,store_id '+
       'FROM orders WHERE user_id=? and status = 2 ', [user_id], function(err,data) {
      if(!err) {
          if(data.length == 0) return res.json({ response: 0 });
          else
          {
            con.query('SELECT delivery_time AS `deliveryTime` '+
                 'FROM stores WHERE id=?  ', [data[0].store_id], function(err,deliveryTime) {


              res.json({
                deliveryTime: deliveryTime[0].deliveryTime,
                  response: data
              });
            });
          }
      }
      else {
          res.json({ response:0, err });
      }
  });
});

app.get('/api/order-price',function(req,res){
    var ids = req.param("ids");
    var price = 0;

    var store_id = 0;
    if(ids == 'null' || ids == 'null,'){
      res.json({response:0})
    }
    else{
        var ids = ids.split(",");
    for(let i in ids){
      if(ids[i] != null || ids[i] != 'null'){
        con.query('SELECT cost,store_id '+
             'FROM products WHERE id=? LIMIT 1', [ids[i]], function(err,data) {
            if(!err) {
              var data = data[0];
            if(data != null){
              var store_id = data.store_id;
            }

              if(data != null){
                console.log(store_id)
                price = price + data.cost
              }

            }
            else {
                res.json({ response:0, err });
            }
            if(i == ids.length-1){
              con.query('SELECT delivery_cost,delivery_time '+
                   'FROM stores WHERE id=? LIMIT 1', [store_id], function(err,deliver_price) {
                     console.log(deliver_price);
                     // 1- before : delevery price 2 - after : price with delivery
                     res.json({
                          before:deliver_price[0].delivery_cost,
                          after:price+deliver_price[0].delivery_cost,
                          store_id,
                          deliveryTime:deliver_price[0].delivery_time
                     });
                  });

              }
            })
      }
    }
  }
});

function SendPushNotifications(pushTokens)
{
    const Expo = require('expo-server-sdk');

    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that you want to send to clents
    let messages = [];
    for (let pushToken of pushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: 'default',
            body: 'هناك طلب جديد على متجرك، تفحص صفحة طلبات المتجر',
            data: { },
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);

    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}
