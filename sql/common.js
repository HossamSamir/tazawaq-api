exports.qry = function qry(query, arr = [], callback) {
	if(typeof(arr) === 'function') {
		callback = arr;
		arr = [];
	}

	con.query(query, arr, function(err,result) {
		if(err) console.log(err);
		else callback(result);
	});
}
