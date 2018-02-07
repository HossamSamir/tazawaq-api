// User makes an order
app.get('/api/make-order',function(req,res){
    var store_id = req.param("store_id");
    var user_id = req.param("user_id");
    var cost = req.param("cost");
    var info = req.param("info");
    var address = req.param("address");
    var address_hint = req.param("address_hint");
    var full_location = address + " - " + address_hint;

    con.query('INSERT INTO orders(store_id,user_id,cost,info,location) VALUES(?,?,?,?,?)',
    [store_id,user_id,cost,info,full_location],
    function(err,orders) {
        if(err) return res.json({response: 0});

        res.json({ response: 1 });
    });
});
