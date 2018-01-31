function travers(req, res) {
	sql.qry('SELECT id, title, status FROM tickets ORDER BY status DESC, id DESC', function(tickets) {
    	res.render('tickets', { tickets });
    });
}

module.exports = travers;

app.get('/fetch-ticket-messages',function(req,res){
    var ticket_id = req.param("id");

    sql.qry('SELECT message,sender_type FROM ticket_messages WHERE ticket_id=? ORDER BY id ASC', [ticket_id],function(messages) {
        res.json({ messages });
    });
});
