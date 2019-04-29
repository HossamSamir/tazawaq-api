app.get('/api/user_location',function(req,res){
    var id = req.param("id");
    var location = req.param("location");
    var latitude = req.param("latitude");
    var longitude = req.param("longitude");
    var region = req.param("region");
    console.log('id :'+id+'location :'+location+'latitude :'+latitude+'long:'+longitude);

    con.query('UPDATE users SET location=?,latitude=?,longitude=?,region=? WHERE id=?',
        [location,latitude,longitude,region,'8'],function(err,data) {
          console.log('err'+err);
          console.log('data'+data);
        if(!err) res.json({reply:1});
        else res.json({reply:0});
    });
    con.query('UPDATE users SET location=?,latitude=?,longitude=?,region=? WHERE id=?',
        [location,latitude,longitude,region,id],function(err,data) {
          console.log('err'+err);
          console.log('data'+data);
        if(!err) res.json({reply:1});
        else res.json({reply:0});
    });
});
