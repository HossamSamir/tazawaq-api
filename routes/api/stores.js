// For HomeScreen.js

/*
    PARAMETERS! MUST READ!

    Name: user_id
    Description: the ID of this user, we need this to fetch their location from database
    Note: if user isn't logged-in, send user_id as -1 and send location in the following format lat=float&lng=float&region=string

    Name: maxcost
    Description: The maximum delivery cost this user wants to see (or can afford)
    Values: any float > 0.0 OR 0.0 to disable this filter
    Note: make sure to send this as a float, not integer

    Name: maxtime
    Description: The maximum delivery time this user wants to see
    Values: any integer > 0 OR 0 to disable this filter

    Name: sortby
    Description: what should data be sorted by
    Values:
        0 - put stores nearest to user first
        1 - sort by rating (highest first)
        2 - sort by delivery time (lowest first)
        3 - sort by delivery cost (lowest first)

*/

// app.get('/api/stores',function(req,res) {
//     var user_id = req.param("user_id");
//     var category_id = req.param("id");
//
//     if(user_id == -1)
//     {
//         FetchStores(
//             res,
//             parseFloat(req.param("maxcost")),
//             parseInt(req.param("maxtime")),
//             parseInt(req.param("sortby")),
//             parseFloat(req.param("lat")),
//             parseFloat(req.param("lng")),
//             req.param("region"));
//     }
//     else
//     {
//         con.query('SELECT latitude,longitude,region FROM users WHERE id=? LIMIT 1',
//             [user_id],function(err,user) {
//             if(err) return res.json({response: -1, err});
//             if(!user.length) return res.json({response: -2});
//
//             FetchStores(
//                 res,
//                 parseFloat(req.param("maxcost")),
//                 parseInt(req.param("maxtime")),
//                 parseInt(req.param("sortby")),
//                 user[0].latitude,
//                 user[0].longitude,
//                 user[0].region,
//                 category_id);
//         });
//     }
// });
//
// function FetchStores(res, maxcost, maxtime, sortby, lat, lng, region,category_id)
// {
//     var filteringClause = "";
//     if(maxcost > 0.0 && maxtime > 0)
//     {
//         filteringClause = ` WHERE region='${region}' AND delivery_cost <= ${con.escape(maxcost)} AND delivery_time <= ${con.escape(maxtime)}`;
//     }
//     else if(maxtime > 0)
//     {
//         filteringClause = ` WHERE region='${region}' AND delivery_time <= ${con.escape(maxtime)}`;
//     }
//     else if(maxcost > 0.0)
//     {
//         filteringClause = ` WHERE region='${region}' AND delivery_cost <= ${con.escape(maxcost)}`;
//     }
//     else {
//         filteringClause = ` WHERE region='${region}'`;
//     }
//
//     var sortingClause = "";
//     switch(sortby)
//     {
//         case 0:
//             sortingClause = ` ORDER BY ACOS(SIN(latitude*0.0174532777777778)*SIN(${lat}*0.0174532777777778) + COS(latitude*0.0174532777777778)*COS(${lat}*0.0174532777777778)*COS((longitude-${lng})*0.0174532777777778))`;
//             break;
//         case 1:
//             con.query(`SELECT AVG(rating) AS stars, store_id FROM ratings GROUP BY store_id ORDER BY AVG(rating) DESC`,
//             function(err,stores_res) {
//                 if(!err) {
//                     if(!stores_res.length) {
//                         con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
//                             'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status '+
//                              'FROM stores' + filteringClause, function(err,stores) {
//                             if(!err) {
//                                 if(stores.length == 0) return res.json({ response: 0 });
//                                 else
//                                 {
//                                     res.json({ response: 1, stores });
//                                 }
//                             }
//                             else
//                             {
//                                 res.json({ response:0, err });
//                             }
//                         });
//                         return;
//                     }
//
//                     var stores = [], fetchedStoreIDs = "";
//                     async.forEachOf(stores_res, function (store, i, callback) {
//                         sql.qry('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
//                             'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status '+
//                              'FROM stores' +
//                              `${filteringClause} AND id=${store.store_id} LIMIT 1`,
//                             function(storesFull) {
//                                 if(storesFull.length)
//                                 {
//                                     fetchedStoreIDs += (i == 0) ? `${store.store_id}` : `,${store.store_id}`;
//                                     stores.push( { ...storesFull[0], stars: store.stars } );
//                                 }
//                                 callback(null);
//                         });
//                     }, function(err) {
//                         if(err) throw err;
//                         if(!fetchedStoreIDs) return res.json({ response: 1, stores });
//
//                         con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
//                             'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status '+
//                              'FROM stores' +
//                              `${filteringClause} AND id NOT IN (${fetchedStoreIDs}) `,
//                              function(err,other_stores) {
//                             if(!err) {
//                                 if(other_stores.length == 0) return res.json({ response: 1, stores });
//                                 else
//                                 {
//                                     other_stores.forEach(function(other_store) {
//                                         stores.push( { ...other_store, stars: -1 } );
//                                     });
//                                     res.json({ response: 1, stores });
//                                 }
//                             }
//                             else
//                             {
//                                 res.json({ response:0, err });
//                             }
//                         });
//                     });
//                 }
//                 else
//                 {
//                     res.json({ response:0, err });
//                 }
//             });
//             return;
//         case 2:
//             sortingClause = ` ORDER BY delivery_time ASC`;
//             break;
//         case 3:
//             sortingClause = ` ORDER BY delivery_cost ASC`;
//             break;
//     }
//
//     con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
//         'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status '+
//          'FROM stores' + filteringClause +' and store_category_id ='+ category_id + sortingClause, function(err,stores_res) {
//         if(!err) {
//             if(stores_res.length == 0) return res.json({ response: 0 });
//             else
//             {
//                 var stores = [];
//                 async.forEachOf(stores_res, function (store, i, callback) {
//                     sql.qry('SELECT rating FROM ratings WHERE store_id=?', [ store.key ], function(storesRatings) {
//                         if(storesRatings.length)
//                             stores.push( { ...store, stars: storesRatings[0].rating } );
//                         else
//                             stores.push( { ...store, stars: -1 } );
//                         callback(null);
//                     });
//                 }, function(err) {
//                     if(err) throw err;
//
//                     res.json({ response: 1, stores });
//                 });
//             }
//         }
//         else
//         {
//             res.json({ response:0, err });
//         }
//     });
// }
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

app.get('/api/stores',function(req,res) {
//   res.json({
//     stores:[
//       {
// key: 1,
// name: "الرجاء تحديث التطبيق من المتجر",
// image: "http://66.45.240.101:90/assets/static/images/uploaded_images/store_images/store_26.jpg",
// desc: "الرجاء تحديث التطبيق من المتجر",
// deliver_price: 12,
// time: 60,
// min_delivery_cost: 0,
// status: 1
// },
//     ],
//     response: 1
//   })
  var user_id = req.param("user_id");
     var category_id = req.param("id");
     var fetch = require('node-fetch')
     var page_state = 1
     var page = req.param('page');
     var offest = page*6;
     console.log(page)
     if(page == null || page == 'null' || typeof page === 'undefined'){
       page_state = 0
     }
     console.log(page_state)
     if(page_state == 0){
       con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
           'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status,latitude,longitude '+
            'FROM stores' +' where '+'store_category_id ='+ category_id+' ORDER BY order_number ASC' , function(err,stores_res) {
           if(!err) {
			   if (stores_res.length == 0) return res.json({ response: 0, stores: [] });
               else
               {

                  res.json({stores:stores_res,response: 1})
               }
           }
           else
           {
			   res.json({ response: 0, err, stores: [] });
           }
       });
     }
     else {
       con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
           'delivery_cost AS deliver_price, delivery_time AS time, min_delivery_cost, status,order_number,latitude,longitude '+
            'FROM stores' +' where '+'store_category_id ='+ category_id +'  ORDER BY order_number ASC', function(err,stores_res) {
           if(!err) {
			   if (stores_res.length == 0) return res.json({ response: 0, stores: [] });
               else
               {
                 // res.json({ response: 0, stores: [] });
								 console.log('user'+user_id)

                 con.query('select * from users where id = ? ',[user_id],(err,user)=>{
                   var GeoPoint = require('geopoint')
                   var stores2 = []
                   for(let i in stores_res){
                     point1 = new GeoPoint(stores_res[i].latitude, stores_res[i].longitude);
                      point2 = new GeoPoint(user[0].latitude, user[0].longitude);
                      var distance = point1.distanceTo(point2, true)//output in kilometers
											console.log('user lat : '+user[0].latitude+'user lang :'+user[0].longitude);
											console.log(distance);
                      if(distance <= 10){
                        stores2.push(stores_res[i])
                      }
                      if(i == stores_res.length-1){
                         if (stores2.length == 0) {
													 console.log(stores2);

													 res.json({ response: 0, stores: [] });
											 }
								 			 else {
												 res.json({stores:stores2,response: 1})
												 console.log(stores2);
								 			 }

                      }
                      }
                     // console.log(data)

                 })
               }
           }
           else
           {
			   res.json({ response: 0, err, stores: [] });
           }
       });
     }

});
