require('dotenv').config();

const express = require('express');
const router = express.Router();

const mysql = require('mysql2');
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_SCHEMA,
	port: process.env.DB_PORT,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

router.get('/test', (req, res) => {
	res.json({'success': true});
});

router.get('/tables', (req, res) => {
	connection.query('SELECT * FROM families', (err, results) => {
		console.log('tables');
		console.log(err);
		res.json(results);
	});
});

// display chores (complete/incomplete) for the week
router.get('/week', (req, res) => {
	
});

module.exports = router;