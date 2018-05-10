
function SendCode(to, code) {
    const fetch = require('node-fetch');

    var msg = 'Welcome in Talbatk | Your verification code is : ' + code;

    fetch('http://api.unifonic.com/wrapper/sendSMS.php?userid=med_st99@hotmail.com&password=WZthPuBN&msg='+msg+'&sender=Talbatk&to=+966'+to+'&encoding=UTF8',
    {
        method: 'POST',
    });
}

app.get('/api/requestnewpass',function(req,res){
    var phone = req.param("phone");

    con.query('SELECT id, code, phone FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND phone=? LIMIT 1',
        [phone], function(err,data) {
    if(!err) {
        if(data.length > 0)
        {
            // code was sent before and it hasn't expired yet
            SendCode(data[0]['phone'], data[0]['code']);

            res.json({
                response: 1
            });
        }
        else
        {
            con.query('SELECT id FROM users WHERE phone=? LIMIT 1', [phone], function(err,data) {
                if(!err) {
                    if(data.length == 0)
                    {
                        // not registered
                        res.json({
                            response: 0
                        });
                    }
                    else
                    {
                        // registered, generate and send code

                        var code = Math.floor(Math.random()*(89998)+10000); // from 10,000 to 99,999
                        SendCode(phone, code);
                        con.query(
                            "INSERT INTO awaiting_verification(code,phone,password,location,latitude,longitude,region) VALUES(?,?,'','','','','')",
                            [code,phone], function(err,data) {
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
    }});
});
