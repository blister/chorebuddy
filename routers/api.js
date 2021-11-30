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
	if ( ! res.locals.logged_in ) {
		res.json({'success': false, 'message': 'You are not logged in. Please authenticate.'});
	} else {
		let family_id = res.locals.family_id;
		let user_id = res.locals.user_id;
		console.log(family_id, user_id);
		let query = `
			SELECT 
				c.id,c.family_id,c.name,c.description,c.value,
				c.assigned_to,c.frequency,c.repeat_on, cl.completed_on, cl.approved_on, 
				cl.approver_id, u.first, u.last
			FROM chores AS c
			LEFT JOIN chore_log AS cl
			ON c.id = cl.chore_id AND yearweek(cl.completed_on, 1) = yearweek(curdate(), 1)
			LEFT JOIN users AS u
			ON cl.approver_id = u.id
			WHERE 
				c.family_id = ? AND
				(c.assigned_to = ? OR c.assigned_to IS NULL)
		`;

		connection.query(query, [family_id, user_id], (err, results) => {
			res.json(results);
		});
	}
	
});

module.exports = router;