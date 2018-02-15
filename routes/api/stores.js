// For HomeScreen.js

/*
    PARAMETERS! MUST READ!
    Name: user_id
    Description: the ID of this user, we need this to fetch their location from database
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

app.get('/api/stores',function(req,res){
    var user_id = req.param("user_id");
    var maxcost = parseFloat(req.param("maxcost"));
    var maxtime = parseInt(req.param("maxtime"));
    var sortby = parseInt(req.param("sortby"));

    con.query('SELECT latitude,longitude,region FROM users WHERE id=? LIMIT 1',
        [user_id],function(err,user) {
        if(err) return res.json({response: -1, err});
        if(!user.length) return res.json({response: -2});

        var lat = user[0].latitude, lng = user[0].longitude, region = user[0].region;

        var filteringClause = "";
        if(maxcost > 0.0 && maxtime > 0)
        {
            filteringClause = ` WHERE region='${region}' AND delivery_cost <= ${con.escape(maxcost)} AND delivery_time <= ${con.escape(maxtime)}`;
        }
        else if(maxtime > 0)
        {
            filteringClause = ` WHERE region='${region}' AND delivery_time <= ${con.escape(maxtime)}`;
        }
        else if(maxcost > 0.0)
        {
            filteringClause = ` WHERE region='${region}' AND delivery_cost <= ${con.escape(maxcost)}`;
        }
        else {
            filteringClause = ` WHERE region='${region}'`;
        }

        var sortingClause = "";
        switch(sortby)
        {
            case 0:
                sortingClause = ` ORDER BY ACOS(SIN(latitude*0.0174532777777778)*SIN(${lat}*0.0174532777777778) + COS(latitude*0.0174532777777778)*COS(${lat}*0.0174532777777778)*COS((longitude-${lng})*0.0174532777777778))`;
                break;
            case 1:
                con.query(`SELECT AVG(rating) AS stars, store_id FROM ratings GROUP BY store_id ORDER BY AVG(rating) DESC`,
                function(err,stores_res) {
                    if(!err) {
                        if(!stores_res.length) {
                            con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
                                'delivery_cost AS deliver_price, delivery_time AS time '+
                                 'FROM stores' + filteringClause, function(err,stores) {
                                if(!err) {
                                    if(stores.length == 0) return res.json({ response: 0 });
                                    else
                                    {
                                        res.json({ response: 1, stores });
                                    }
                                }
                                else
                                {
                                    res.json({ response:0, err });
                                }
                            });
                            return;
                        }

                        var stores = [], fetchedStoreIDs = "";
                        async.forEachOf(stores_res, function (store, i, callback) {
                            sql.qry('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
                                'delivery_cost AS deliver_price, delivery_time AS time '+
                                 'FROM stores' +
                                 `${filteringClause} AND id=${store.store_id} LIMIT 1`,
                                function(storesFull) {
                                    if(storesFull.length)
                                    {
                                        fetchedStoreIDs += (i == 0) ? `${store.store_id}` : `,${store.store_id}`;
                                        stores.push( { ...storesFull[0], stars: store.stars } );
                                    }
                                    callback(null);
                            });
                        }, function(err) {
                            if(err) throw err;
                            if(!fetchedStoreIDs) return res.json({ response: 1, stores });

                            con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
                                'delivery_cost AS deliver_price, delivery_time AS time '+
                                 'FROM stores' +
                                 `${filteringClause} AND id NOT IN (${fetchedStoreIDs})`,
                                 function(err,other_stores) {
                                if(!err) {
                                    if(other_stores.length == 0) return res.json({ response: 1, stores });
                                    else
                                    {
                                        other_stores.forEach(function(other_store) {
                                            stores.push( { ...other_store, stars: -1 } );
                                        });
                                        res.json({ response: 1, stores });
                                    }
                                }
                                else
                                {
                                    res.json({ response:0, err });
                                }
                            });
                        });
                    }
                    else
                    {
                        res.json({ response:0, err });
                    }
                });
                return;
            case 2:
                sortingClause = ` ORDER BY delivery_time ASC`;
                break;
            case 3:
                sortingClause = ` ORDER BY delivery_cost ASC`;
                break;
        }

        con.query('SELECT id AS `key`, display_name AS name, img AS image, info AS `desc`,'+
            'delivery_cost AS deliver_price, delivery_time AS time '+
             'FROM stores' + filteringClause + sortingClause, function(err,stores_res) {
            if(!err) {
                if(stores_res.length == 0) return res.json({ response: 0 });
                else
                {
                    var stores = [];
            		async.forEachOf(stores_res, function (store, i, callback) {
            			sql.qry('SELECT rating FROM ratings WHERE store_id=?', [ store.key ], function(storesRatings) {
                            if(storesRatings.length)
                                stores.push( { ...store, stars: storesRatings[0].rating } );
                            else
                                stores.push( { ...store, stars: -1 } );
            				callback(null);
            			});
            		}, function(err) {
            			if(err) throw err;

                        res.json({ response: 1, stores });
            		});
                }
            }
            else
            {
                res.json({ response:0, err });
            }
        });
    });
});
