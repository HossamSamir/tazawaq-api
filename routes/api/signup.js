var crypto = require('crypto');

function SendCode(to, code) {
    // phone
    /*
    // Twilio Credentials
    const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const authToken = 'your_auth_token';

    // require the Twilio module and create a REST client
    const client = require('twilio')(accountSid, authToken);

    client.messages.create({
        to: to,
        from: '+15017122661',
        body: 'هذا هو الكود الخاص بك ' + code,
    }).then(message => console.log(message.sid));
    */
}

app.get('/api/signup',function(req,res){
    var phone = req.param("phone");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");
    var location = req.param("location");
    var latitude = req.param("latitude");
    var longitude = req.param("longitude");
    var region = req.param("region");
    var country = req.param("country");

    con.query('SELECT id, code, phone FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND phone=? LIMIT 1',
        [phone], function(err,data) {
    if(!err) {
        if(data.length > 0)
        {
            // code was sent before and it hasn't expired yet
            SendCode(date[0]['phone'], date[0]['code']);

            res.json({
                response: 1
            });
        }
        else
        {
            con.query('SELECT id FROM users WHERE phone=? LIMIT 1', [phone], function(err,data) {
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
                            'INSERT INTO awaiting_verification(code,phone,password,location,latitude,longitude,region,country) VALUES(?,?,?,?,?,?,?,?)',
                            [code,phone,hash,location,latitude,longitude,region,country], function(err,data) {
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
            }
        }
        else
        {
            res.json(err);
        }
    });
});
