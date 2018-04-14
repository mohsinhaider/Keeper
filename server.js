const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const db = require('./config/db');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(upload());

