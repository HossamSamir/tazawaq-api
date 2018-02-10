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

    con.query('SELECT id AS ticket_id, title, status FROM tickets WHERE user_id=?', [user_id],function(err,tickets) {
        if(err) return res.json({response: -1});

        if(!tickets.length) return res.json({response: 0}); // User got no tickets

        res.json({ response: 1, tickets });
        /*
            tickets array of Objects, Object {
                ticket_id,  // for navigation, pass this as a prop to SINGLE ticket screen
                title,
                status      // 1 means open, else it's closed and don't allow them to reply
            }
        */
    });
});

// This returns the messages of this ticket
app.get('/api/get-ticket-messages',function(req,res){
    var ticket_id = req.param("ticket_id");

    con.query('SELECT message,sender_type FROM ticket_messages WHERE ticket_id=?', [ticket_id],function(err,messages) {
        if(err) return res.json({response: -1});

        // if(!messages.length) return res.json({response: 0}); // Ticket got no messages...will this ever happen? No..

        res.json({ response: 1, messages });
        // Note: sender_type | 0 means sent by user | 1 means sent by admin
    });
});
