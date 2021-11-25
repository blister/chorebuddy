require('dotenv').config();

const express = require('express');
const app = express();

const mysql = require('mysql2');

app.use( express.static('public') );

app.listen(process.env.SERVER_PORT);