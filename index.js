const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

express()
	// static files >>
	.use(express.static(path.join(`${__dirname}/client`, 'views')))
	.set('views', path.join(`${__dirname}/client`, 'views'))
	.set('view engine', 'ejs')
	.get('/', (req, res) => res.render('index'))
	.get('/home', (req, res) => res.render('home'))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
// console.log(`${__dirname}/client`);
