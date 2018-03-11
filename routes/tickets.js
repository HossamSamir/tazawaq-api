function travers(req, res) {
	sql.qry('SELECT COUNT(id) AS cnt FROM tickets WHERE status = 0', function(closedCount) {
		sql.qry('SELECT COUNT(id) AS cnt FROM tickets WHERE status = 1', function(openCount) {
			sql.qry('SELECT id, title, status FROM tickets ORDER BY status DESC, id DESC', function(tickets) {
		    	res.render('tickets', { tickets, closed:closedCount[0].cnt,open:openCount[0].cnt });
		    });
		})
	});
}

module.exports = travers;

app.get('/fetch-ticket-messages',function(req,res){
    var ticket_id = req.param("id");

    sql.qry('SELECT message,sender_type FROM ticket_messages WHERE ticket_id=? ORDER BY id ASC', [ticket_id],function(messages) {
        res.json({ messages });
    });
});

app.get('/send-ticket-message',function(req,res){
    var ticket_id = req.param("ticket_id");

    sql.qry('SELECT id FROM tickets WHERE id=? AND status=1', [ticket_id], function(tickets) {
        if(!tickets.length)
            return res.json({ response: 0 }); // لا يمكنك الرد على هذه التذكرة

        var message = req.param("message");
        sql.qry('INSERT INTO ticket_messages(ticket_id,sender_type,message) VALUES(?,1,?)',
            [ticket_id, message], function(messages) {

            res.json({ response: 1 }); // Added message
        });
    });
});

app.get('/close-ticket',function(req,res){
    var ticket_id = req.param("id");

    sql.qry('UPDATE tickets SET status=0 WHERE id=?', [ticket_id], function(tickets) {
        res.json({ response: 1 });
    });
});
