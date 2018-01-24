module.exports = (req, res) => {
	localStorage.setItem('loggedIn', 'false');
	res.render('login', { title: 'Express' });
};

// module.exports = travers;
