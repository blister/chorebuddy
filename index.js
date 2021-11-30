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
	if ( req.session.logged_in ) {
		res.locals.logged_in = req.session.logged_in;
		res.locals.family_id = req.session.family_id;
		res.locals.family_name = req.session.family_name;
		res.locals.user_id = req.session.user_id;
		res.locals.first = req.session.first;
		res.locals.last = req.session.last;
		res.locals.email = req.session.email;
		res.locals.parent = req.session.parent;
		res.locals.admin = req.session.admin;
	} else {
		res.locals.logged_in = false;
	}

	next();
});

const apiRoute = require('./routers/api');
app.use('/api', apiRoute);

app.get('/', (req, res) => {
	if ( res.locals.logged_in ) {
		res.render('index');
	} else {
		res.render('login');
	}
	
});

app.get('/logout', (req, res) => {
	if ( req.session ) {
		req.session.destroy(err => {
			if ( err ) {
				res.status(400).send('Unable to log out');
			} else {
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
});

app.post('/login', async (req, res) => {
	let login_email = req.body.email;
	let login_pass  = req.body.password;

	let query = `
		SELECT 
			u.id, u.family_id, f.name AS family_name, u.email, 
			u.first, u.last, u.password, u.parent, u.admin 
		FROM users AS u
		LEFT JOIN families AS f ON u.family_id = f.id
		WHERE u.email = ?
	`;
	connection.query(query, login_email, async (err, results) => {
		if ( err ) {
			console.log(err);
			res.status(500).send('error');
		}
		
		if ( results.length > 0 ) {
			try {
				if ( await bcrypt.compare(login_pass, results[0].password) ) {
					req.session.logged_in   = true;
					req.session.user_id     = results[0].id;
					req.session.family_id   = results[0].family_id;
					req.session.family_name = results[0].family_name;
					req.session.first       = results[0].first;
					req.session.last        = results[0].last;
					req.session.email       = results[0].email;
					req.session.parent      = results[0].parent;
					req.session.admin       = results[0].admin;

					res.redirect('/');
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