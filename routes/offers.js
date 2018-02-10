function travers(req, res) {
	sql.qry(
		'SELECT id,store_id, name, info, cost_before, cost_after, status, img FROM offers',
		offers => {
			res.render('offers', { offers });
		}
	);
}

module.exports = travers;
