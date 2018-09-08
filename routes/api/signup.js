var crypto = require('crypto');
function SendCode(to, code) {
    const fetch = require('node-fetch');

    var msg = 'Welcome in Talbatk | Your verification code is : ' + code;

    fetch('http://api.unifonic.com/wrapper/sendSMS.php?userid=med_st99@hotmail.com&password=WZthPuBN&msg='+msg+'&sender=Talbatk&to=+966'+to+'&encoding=UTF8',
    {
        method: 'POST',
    });
}


app.get('/terms-and-policy',function(req,res){
  res.redirect('https://drive.google.com/file/d/17RyuCco1h7XDyDCSLBV6xgzIZC5nzmVY/view?usp=sharing');
})
app.get('/test',function(req,res){
  const fetch = require('node-fetch');
  code = 123;
var msg = 'Welcome in Talbatk | Your verification code is : ' + code;
  fetch('http://api.unifonic.com/wrapper/sendSMS.php?userid=med_st99@hotmail.com&password=WZthPuBN&msg='+msg+'&sender=Talbatk&to=+201270290279&encoding=UTF8',
  {
      method: 'POST',
  });
  res.send('done')
})
app.get('/api/signup',function(req,res){
    var phone = req.param("phone");
    var email = req.param("email");
    var username = req.param("username");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");
    var location = req.param("location");
    var latitude = req.param("latitude");
    var longitude = req.param("longitude");
    var region = req.param("region");

    con.query('SELECT id, code, phone FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND phone=? LIMIT 1',
        [phone], function(err,data) {
    if(!err) {
        if(data.length > 0)
        {
            // code was sent before and it hasn't expired yet

            // resend
            SendCode(data[0]['phone'], data[0]['code']);

            /*// todo update data
            con.query('UPDATE ', [], function(err,data) {
                if(!err) {
                    res.json({
                        response: 1,
                        id: userData[0]['id']
                    });
                } else res.json(err);
            });*/

            res.json({
                response: 1
            });
        }
        else
        {
            con.query('SELECT id FROM users WHERE phone=?  LIMIT 1', [phone], function(err,data) {
                if(!err) {
                    if(data.length > 0)
                    {
                        // already registered
                        res.json({
                            response: 0
                        });
                    }
                    else
                    {
                        // not registered, generate and send code

                        var code = Math.floor(Math.random()*(89998)+10000); // from 10,000 to 99,999
                        SendCode(phone, code);
                        con.query(
                            'INSERT INTO awaiting_verification(code,phone,email,username,password,location,latitude,longitude,region) VALUES(?,?,?,?,?,?,?,?,?)',
                            [code,phone,email,username,hash,location,latitude,longitude,region], function(err,data) {
                            if(!err) {
                                res.json({
                                    response: 2
                                });
                            }
                            else
                            {
                                res.json(err);
                            }
                        })
                    }
                }
                else {
                    res.json(err);
                }
            });
        }
    }
    else
    {
        res.json(err);
    }
    });
});
