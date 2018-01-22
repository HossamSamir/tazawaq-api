var crypto = require('crypto');

function SendCode(via, to, code) {
    if(via == 0) // email
    {
        /*var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });*/

        /*var mailgun = require("mailgun-js");
        var api_key = 'YOUR_API_KEY';
        var DOMAIN = 'YOUR_DOMAIN_NAME';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

        var data = {
            from: 'Tathoq <me@samples.mailgun.org>',
            to: to + ', YOU@YOUR_DOMAIN_NAME',
            subject: 'Tathoq Registration',
            text: 'هذا هو الكود الخاص بك ' + code
        };

        mailgun.messages().send(data, function (error, body) {
            console.log(body);
        });*/
    }
    else // phone
    {
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
}

app.get('/api/signup',function(req,res){
    var phone = req.param("phone");
    var email = req.param("email");
    var password = req.param("password");
    var hash = crypto.createHash('md5').update(password).digest("hex");
    var conftype = req.param("conftype");
    var location = req.param("location");
    var latitude = req.param("latitude");
    var longitude = req.param("longitude");
    var region = req.param("region");
    var country = req.param("country");

    con.query('SELECT id, code, type, email, phone FROM awaiting_verification WHERE TIMESTAMPDIFF(MINUTE,time_generated,NOW()) <= 20 AND (email=? OR phone=?) LIMIT 1',
        [email, phone], function(err,data) {
    if(!err) {
        if(data.length > 0)
        {
            // code was sent before and it hasn't expired yet
            SendCode(data[0]['type'], date[0]['type'] === 0 ? date[0]['email'] : date[0]['phone'], date[0]['code']);

            res.json({
                response: 1
            });
        }
        else
        {
            con.query('SELECT id FROM users WHERE email=? OR phone=? LIMIT 1', [email, phone], function(err,data) {
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
                        SendCode(conftype, conftype === 0 ? email : phone, code);
                        con.query(
                            'INSERT INTO awaiting_verification(code,phone,email,password,conftype,location,latitude,longitude,region,country) VALUES(?,?,?,?,?,?,?,?,?,?)',
                            [code,phone,email,hash,conftype,location,latitude,longitude,region,country], function(err,data) {
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
