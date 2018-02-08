module.exports = (req, res) => {
	req.session.forget('app_owner');
	res.render('login', { });
};
