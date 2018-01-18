const express = require('express');
const path = require('path');
const app = express();

exports.sayHello = () => {
	app.get('/', (req, res) => res.render('index'));
	app.get('/home', (req, res) => res.render('home'));
	console.log('asfasfasfasf');
};
