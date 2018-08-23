app.get('/api/store-push-tokens',function(req,res){
    var store_id = req.param("store_id");
    var token = req.param("token");

    con.query('SELECT id FROM expo_push_tokens WHERE store_id=? AND token=? LIMIT 1',
    [store_id, token], function(err,tokens) {
        if(err) return res.json({response: 0, err});

        if(tokens.length) return res.json({ response: 1 });

        con.query('INSERT INTO expo_push_tokens(store_id,token) VALUES(?,?)',
        [store_id, token], function(insert) {
            if(err) return res.json({response: 0, err});

            res.json({ response: 1 });
        });
    });
});

app.get('/api/test',function(req,res){
  // assets/static/images/logo.png

push('')

});
function push(registrationToken,body){

  // See documentation on defining a message payload.
  var message = {
    notification: {
      title:'Talbatk',
      body,
    },
  };
   var options = {
     priority:"high",
   }
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken,message,options)
    .then((response) => {
      // Response is a message ID string.
      res.json( response);
    })
    .catch((error) => {
      res.send('Error sending message:', error);
    });

}
