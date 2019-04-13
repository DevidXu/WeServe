const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const https = require('https');
var path = require('path');
var logger = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));


const DB = require('./server/database');
const CN = require('./server/Connections');

/* register your backend service here */
app.get('/sampleTest', (req, res) => {
    res.send(JSON.stringify({ info: "true" }));
});

app.get('/login', (req, res) => {
    return;
});


app.use('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname+"/index.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
