require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt  = require('bcrypt');
const app = express();

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

app.use( express.static('public') );
app.use( express.urlencoded({ extended: true }) );
app.set( 'view engine', 'ejs' );

// session management
app.use(session({
	secret: 'chorebuddy_secrets',
	resave: true,
	saveUninitialized: true
}));
app.use( (req, res, next) => {
	res.locals.user_id = req.session.user_id;

	next();
});

const apiRoute = require('./routers/api');
app.use('/api', apiRoute);

app.get('/', (req, res) => {
	res.render('login');
});

// TODO(erh) this is broken.
app.post('/login', async (req, res) => {
	let login_email = req.body.email;
	let login_pass  = req.body.password;

	let query = 'SELECT id, family_id, email, first, last, password, parent, admin FROM users WHERE email = ?';
	connection.query(query, login_email, async (err, results) => {
		if ( err ) {
			console.log(err);
			res.status(500).send('error');
		}
		console.log(results);
		if ( results.length > 0 ) {
			try {
				if ( await bcrypt.compare(login_pass, results[0].password) ) {
					req.session.logged_in = true;
					req.session.user_id = results[0].id;
					req.session.first   = results[0].first;
					req.session.last    = results[0].last;
					req.session.email   = results[0].email;
					req.session.parent  = results[0].parent;
					req.session.admin   = results[0].admin;
				} else {
					res.send('Incorrect username or password.');
				}
			} catch {
				res.status(500).send('Error');
			}
		} else {
			res.send('Incorrect username or password.');
		}
	});
});



app.listen(process.env.SERVER_PORT);