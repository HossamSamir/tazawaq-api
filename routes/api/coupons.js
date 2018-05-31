app.get('/api/check-coupon',function(req,res){
  var store_id = req.param('store_id');
  var code = req.param('code');
  sql.qry('select * from coupons where code = ? AND (store_id = ? OR store_id = 0) AND status = 1 ',[code,store_id],function(data,err){
    if(data.length == 1){
      res.json({response:1,percent:data[0].percent})
    }
    else {
      res.json({response:0})
    }
  })
})
