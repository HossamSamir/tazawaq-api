// When user opens a new ticket and sends initial message
app.get('/api/ticket-open',function(req,res){
    var user_id = req.param("user_id");
    var title = req.param("title");
    var message = req.param("message");

    con.query('INSERT INTO tickets(user_id,title) VALUES(?,?)', [user_id, title], function(err,tickets) {
        if(err) return res.json({response: 0});

        var ticket_id = tickets.insertId;
        con.query('INSERT INTO ticket_messages(ticket_id,sender_type,message) VALUES(?,0,?)',
            [ticket_id, message], function(err,messages) {
            if(err) return res.json({response: 0});

            res.json({ response: 1, ticket_id }); // Opened and added message
        });
    });
});

// When user replies to a ticket that is already open
app.get('/api/ticket-reply',function(req,res){
    var ticket_id = req.param("ticket_id");

    con.query('SELECT id FROM tickets WHERE id=? AND status=1', [ticket_id], function(err,tickets) {
        if(err)
            return res.json({response: -1});

        if(!tickets.length)
            return res.json({ response: 0 }); // لا يمكنك الرد على هذه التذكرة

        var message = req.param("message");
        con.query('INSERT INTO ticket_messages(ticket_id,sender_type,message) VALUES(?,0,?)',
            [ticket_id, message], function(err,messages) {
            if(err) return res.json({response: -1});

            res.json({ response: 1 }); // Added message
        });
    });
});

// This returns a list of tickets by this user
app.get('/api/get-my-tickets',function(req,res){
    var user_id = req.param("user_id");

    con.query('SELECT id AS ticket_id, title, status FROM tickets WHERE user_id=?',
        [user_id],function(err,tickets_res) {

        if(err) return res.json({response: -1}); // Error
        if(!tickets_res.length) return res.json({response: 0}); // User got no tickets

        var tickets = [];
		async.forEachOf(tickets_res, function (ticket, i, callback) {
			sql.qry('SELECT message FROM ticket_messages WHERE ticket_id=? ORDER BY id DESC LIMIT 1',
            [ ticket.ticket_id ], function(recentMsg) {
				tickets.push( { ...ticket, recent_msg: recentMsg[0].message } );
				callback(null);
			});
		}, function(err) {
			if(err) throw err;

            res.json({ response: 1, tickets });
            /*
                tickets array of Objects, Object {
                    ticket_id,  // for navigation, pass this as a prop to SINGLE ticket screen
                    title,
                    status,      // 1 means open, else it's closed and don't allow them to reply
                    recent_msg      // most recent message
                }
            */
		});
    });
});

// This returns the messages of this ticket
app.get('/api/get-ticket-messages',function(req,res){
    var ticket_id = req.param("ticket_id");
    var data = [];
    con.query('SELECT message,sender_type FROM ticket_messages WHERE ticket_id=?', [ticket_id],function(err,messages) {
        if(err) return res.json({response: -1});
        for(let i in messages){
          var id = i;
          var new_id = id++;
          data.push({
            _id: new_id,
            createdAt: new Date(),
            text: messages[i].message,
            user:{
              _id: messages[i].sender_type+1,
              name: 'React Native',
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
            }
          })
          if(i == messages.length-1){
            res.json({ response: 1, data });
          }
        }

        // Note: sender_type | 0 means sent by user | 1 means sent by admin
    });
});
