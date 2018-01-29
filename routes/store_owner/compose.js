function travers(req, res) {
	var store_id = req.params.store_id;
	res.render('store_owner/compose', { store_id });
}

module.exports = travers;
