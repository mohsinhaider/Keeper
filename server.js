const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const db = require('./config/db');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');

const app = express();
const port = 8080;

const mongoose = require('mongoose');
var Sheet = require('./app/models/sheet');
var Question = require('./app/models/question');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(upload());

mongoose.connect(db.url);

app.listen(port, () => {
    console.log('Keeper started on ' + port + '!');
})